"""
Gera as fotografias dos acessórios e do equipamento de treino a partir das
capturas do catálogo do fornecedor (Offside):

  1. recorta o artigo do fundo (branco + quadrados cinzentos do catálogo)
  2. muda a cor do tecido mantendo as sombras e os vincos
  3. aplica o símbolo do Camões Andebol (public/logo/camoes-*.png)
  4. compõe num fundo nas cores da loja, com sombra suave

Uso:  python3 scripts/build_product_images.py <pasta com as capturas>
"""

import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

SRC = sys.argv[1]
OUT = "public/fotos"
LOGO_NAVY = Image.open("public/logo/camoes-navy.png")
LOGO_WHITE = Image.open("public/logo/camoes-white.png")

NAVY = (19, 41, 79)
YELLOW = (247, 198, 0)
BLUE = (31, 95, 200)
WHITE = (242, 243, 245)
SIZE = 1400


def load(name):
    return np.asarray(Image.open(f"{SRC}/{name}").convert("RGB"), np.float32) / 255


def cutout(a, box, include_dark=True):
    """Devolve (rgb, máscara) do artigo dentro da caixa (x0, y0, x1, y1).
    include_dark: incluir zonas escuras sem cor (ex.: alças pretas); desligar quando há texto preto por perto."""
    x0, y0, x1, y1 = box
    a = a[y0:y1, x0:x1]
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / (mx + 1e-6)
    mask = (sat > 0.22) | ((mx < 0.35) if include_dark else False)
    mask = ndi.binary_opening(mask, iterations=2)
    lab, n = ndi.label(mask)
    if n > 1:
        sizes = ndi.sum(mask, lab, range(1, n + 1))
        mask = lab == (np.argmax(sizes) + 1)
    mask = ndi.binary_closing(mask, iterations=6)
    filled = ndi.binary_fill_holes(mask)
    # Buracos grandes e neutros (fundo preso entre a alça e a mochila) não fazem parte do artigo;
    # buracos pequenos (logótipo branco da marca) sim.
    holes, nh = ndi.label(filled & ~mask)
    if nh:
        neutral = (sat < 0.1)
        for i, sl in enumerate(ndi.find_objects(holes), start=1):
            region = holes[sl] == i
            if region.sum() > 2500 and neutral[sl][region].mean() > 0.8:
                filled[sl][region] = False
    mask = filled
    soft = np.asarray(to_img(mask).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
    ys, xs = np.where(mask)
    sl = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
    rgb, m = a[sl], soft[sl]
    # As capturas têm pouca resolução: ampliar antes de aplicar o símbolo, para ficar nítido
    if rgb.shape[0] < 1300:
        f = 1300 / rgb.shape[0]
        size = (int(rgb.shape[1] * f), 1300)
        rgb = np.asarray(to_img(rgb).resize(size, Image.LANCZOS), np.float32) / 255
        m = np.asarray(to_img(m).resize(size, Image.LANCZOS), np.float32) / 255
    return rgb, m


def recolor(a, target, keep_dark=True, soften=0.0, neutral_fabric=None):
    """Pinta as zonas de cor do tecido com `target`, mantendo a luz/sombra.
    soften (0–1): suaviza a textura — útil ao clarear um tecido muito escuro."""
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / (mx + 1e-6)
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    colored = np.clip((sat - 0.2) / 0.15, 0, 1)
    if neutral_fabric is not None:
        # Tecido preto/cinzento: pinta toda a peça exceto o que tem cor (ex.: logótipo da marca)
        # (o "colorido" só conta em pixels claros: nos muito escuros o ruído do JPEG parece cor)
        logo = np.clip((sat - 0.35) / 0.1, 0, 1) * np.clip((mx - 0.25) / 0.1, 0, 1)
        colored = neutral_fabric * (1 - logo)
    if keep_dark:
        colored *= np.clip((lum - 0.12) / 0.1, 0, 1)
    ref = np.median(lum[colored > 0.9]) if (colored > 0.9).any() else 0.5
    shade = lum / ref
    if soften:
        blurred = ndi.gaussian_filter(shade, 2.5)
        shade = 1 + (blurred - 1) * (1 - 0.5 * soften)
    t = np.array(target, np.float32) / 255
    tl = float(t @ np.array([0.299, 0.587, 0.114], np.float32))
    # sombras multiplicam; realces aproximam do branco (mais suave em cores escuras)
    base = t[None, None] * np.minimum(shade, 1)[..., None]
    hi = np.clip(shade - 1, 0, 1)[..., None] * (0.55 if tl > 0.4 else 0.25)
    painted = base + (1 - base) * hi
    out = a * (1 - colored[..., None]) + painted * colored[..., None]
    return np.clip(out, 0, 1)


def apply_logo(a, mask, cx, cy, width, dark=True, opacity=0.95):
    """Aplica o símbolo centrado em (cx, cy) — frações da peça — com `width` em fração da largura."""
    h, w, _ = a.shape
    logo = LOGO_NAVY if dark else LOGO_WHITE
    lw = int(w * width)
    lh = int(logo.height * lw / logo.width)
    lg = np.asarray(logo.resize((lw, lh), Image.LANCZOS), np.float32) / 255
    x0, y0 = int(w * cx - lw / 2), int(h * cy - lh / 2)
    region = a[y0 : y0 + lh, x0 : x0 + lw]
    lum = ndi.gaussian_filter(region @ np.array([0.299, 0.587, 0.114], np.float32), 2)
    shade = np.clip(lum / max(np.median(lum), 1e-3), 0.8, 1.08)[..., None]  # a tinta segue os vincos
    alpha = lg[..., 3:4] * opacity * mask[y0 : y0 + lh, x0 : x0 + lw, None]
    a[y0 : y0 + lh, x0 : x0 + lw] = region * (1 - alpha) + lg[..., :3] * shade * alpha
    return a


def to_img(arr):
    """Converte para imagem limitando a 0–1 (sem isto, valores >1 "dão a volta" e criam franjas de cor)."""
    return Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))


OFFSIDE = Image.open("scripts/assets/offside-mark.png")


def brand(a, orig, box, dark):
    """Substitui o logótipo da marca (Offside) por uma versão limpa, na mesma cor do
    símbolo do Camões. box = (x0, y0, x1, y1) em frações da peça, à volta do logótipo."""
    h, w, _ = a.shape
    pad = 0.03
    x0, x1 = int(max(0, box[0] - pad) * w), int(min(1, box[2] + pad) * w)
    y0, y1 = int(max(0, box[1] - pad) * h), int(min(1, box[3] + pad) * h)
    src = orig[y0:y1, x0:x1]
    fabric = np.median(src.reshape(-1, 3), axis=0)
    diff = np.abs(src - fabric).max(2)
    if fabric.max() - fabric.min() < 0.08:  # tecido neutro: a cor do logótipo também conta
        diff = np.maximum(diff, src.max(2) - src.min(2))
    logo = ndi.binary_opening(diff > 0.2, iterations=1)
    ys, xs = np.where(logo)
    if not len(ys):
        return a
    lx0, lx1, ly0, ly1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1

    # 1) apagar: preencher a zona do logótipo com o tecido à volta (média ponderada desfocada)
    hole = ndi.binary_dilation(logo, iterations=max(3, int(w * 0.006))).astype(np.float32)
    region = a[y0:y1, x0:x1]
    keep = 1 - hole
    sigma = max(4, (lx1 - lx0) * 0.25)
    num = np.stack([ndi.gaussian_filter(region[..., c] * keep, sigma) for c in range(3)], -1)
    den = ndi.gaussian_filter(keep, sigma)[..., None] + 1e-6
    filled = num / den
    region[:] = region * keep[..., None] + filled * hole[..., None]

    # 2) colocar o logótipo limpo, do mesmo tamanho e no mesmo sítio
    bw, bh = lx1 - lx0, ly1 - ly0
    scale = min(bw / OFFSIDE.width, bh / OFFSIDE.height)
    nw, nh = max(1, int(OFFSIDE.width * scale)), max(1, int(OFFSIDE.height * scale))
    mark = np.asarray(OFFSIDE.resize((nw, nh), Image.LANCZOS), np.float32)[..., 3] / 255
    cx, cy = x0 + (lx0 + lx1) // 2, y0 + (ly0 + ly1) // 2
    mx0, my0 = cx - nw // 2, cy - nh // 2
    color = np.array(NAVY if dark else (250, 250, 250), np.float32) / 255
    target = a[my0 : my0 + nh, mx0 : mx0 + nw]
    al = mark[: target.shape[0], : target.shape[1], None]
    a[my0 : my0 + nh, mx0 : mx0 + nw] = target * (1 - al) + color * al
    return a


def background():
    y, x = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32) / SIZE
    top, bottom = np.array([0.965, 0.972, 0.988]), np.array([0.875, 0.903, 0.952])
    bg = top[None, None] * (1 - y[..., None]) + bottom[None, None] * y[..., None]
    # faixas diagonais discretas, como o padrão das camisolas
    stripes = ((x * 0.9 + y * 0.42) * 9 % 1 < 0.42).astype(np.float32)
    bg += stripes[..., None] * 0.012
    # brilho suave atrás do artigo
    d = np.sqrt((x - 0.5) ** 2 + (y - 0.45) ** 2)
    bg += np.clip(0.5 - d, 0, 0.5)[..., None] * 0.08
    # faixa amarela fina em baixo
    bg[int(SIZE * 0.975) :, :] = np.array(YELLOW) / 255
    return np.clip(bg, 0, 1)


def place(canvas, rgb, mask, cx, cy, height):
    """Coloca o artigo no `canvas` com sombra; cx/cy = centro em fração, height em fração."""
    h = int(SIZE * height)
    w = int(rgb.shape[1] * h / rgb.shape[0])
    if w > SIZE * 0.9:
        w = int(SIZE * 0.9)
        h = int(rgb.shape[0] * w / rgb.shape[1])
    img = np.asarray(to_img(rgb).resize((w, h), Image.LANCZOS), np.float32) / 255
    m = np.asarray(to_img(mask).resize((w, h), Image.LANCZOS), np.float32) / 255
    x0, y0 = int(SIZE * cx - w / 2), int(SIZE * cy - h / 2)

    # sombra projetada (desfocada, ligeiramente abaixo)
    sh = Image.new("L", (SIZE, SIZE), 0)
    sh.paste(to_img(m), (x0 + int(w * 0.015), y0 + int(h * 0.025)))
    sh = np.asarray(sh.filter(ImageFilter.GaussianBlur(SIZE * 0.018)), np.float32) / 255
    canvas *= 1 - sh[..., None] * 0.28
    # sombra de contacto (elipse no chão)
    floor = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(floor).ellipse((x0 + w * 0.12, y0 + h * 0.965, x0 + w * 0.88, y0 + h * 1.03), fill=255)
    floor = np.asarray(floor.filter(ImageFilter.GaussianBlur(SIZE * 0.02)), np.float32) / 255
    canvas *= 1 - floor[..., None] * 0.22

    region = canvas[y0 : y0 + h, x0 : x0 + w]
    canvas[y0 : y0 + h, x0 : x0 + w] = region * (1 - m[..., None]) + img * m[..., None]
    return canvas


def save(canvas, name):
    to_img(canvas).save(f"{OUT}/{name}.jpg", quality=86, optimize=True, progressive=True)
    print("criado", name)


if __name__ == "__main__":
    BLACK = (28, 28, 30)
    backpack_src = load("bae1f97b-image.png")
    thermal_src = load("b57865a5-image.jpg")
    kit_src = load("da6e5148-image.jpg")

    # Regra: o logótipo da marca (Offside) fica sempre da mesma cor que o símbolo do Camões,
    # e o símbolo do Camões fica espelhado em relação ao da marca (mesma altura, lado oposto).

    # Mochila — azul-escuro (ambos os logótipos já são brancos)
    rgb, m = cutout(backpack_src, (270, 445, 1250, 1700))
    rgb = recolor(rgb, NAVY, keep_dark=True)
    rgb = apply_logo(rgb, m, 0.76, 0.23, 0.18, dark=False)
    save(place(background(), rgb, m, 0.5, 0.47, 0.8), "mochila-azul-escuro")

    # Camisola térmica — amarelo, branco, azul (sem logótipo da marca)
    rgb0, m = cutout(thermal_src, (50, 340, 680, 1090))
    for name, color, dark in [("termica-amarelo", YELLOW, True), ("termica-branco", WHITE, True), ("termica-azul", BLUE, False)]:
        rgb = recolor(rgb0, color, keep_dark=False)
        rgb = apply_logo(rgb.copy(), m, 0.66, 0.24, 0.15, dark=dark)
        save(place(background(), rgb, m, 0.5, 0.48, 0.74), name)

    # Colete térmico — cor do catálogo; marca e símbolo em azul-escuro
    rgb0, m = cutout(thermal_src, (80, 1135, 640, 2010))
    rgb = brand(rgb0.copy(), rgb0, (0.42, 0.2, 0.58, 0.29), dark=True)
    rgb = apply_logo(rgb, m, 0.5, 0.5, 0.2, dark=True)
    save(place(background(), rgb, m, 0.5, 0.48, 0.76), "colete")

    # Equipamento de treino — t-shirt + calções, amarelo e azul-escuro
    shirt0, ms = cutout(kit_src, (60, 90, 790, 950))
    shorts0, mh = cutout(kit_src, (160, 1090, 690, 1690))
    for name, color, dark in [("treino-amarelo", YELLOW, True), ("treino-azul-escuro", NAVY, False)]:
        shirt = brand(recolor(shirt0, color, keep_dark=False), shirt0, (0.29, 0.21, 0.38, 0.28), dark)
        shirt = apply_logo(shirt, ms, 0.665, 0.245, 0.12, dark=dark)
        shorts = brand(recolor(shorts0, color, keep_dark=False), shorts0, (0.83, 0.84, 0.95, 0.94), dark)
        shorts = apply_logo(shorts, mh, 0.17, 0.88, 0.13, dark=dark)
        c = background()
        c = place(c, shirt, ms, 0.42, 0.37, 0.6)
        c = place(c, shorts, mh, 0.64, 0.75, 0.36)
        save(c, name)

    # Fato de treino de saída — casaco + calças (algodão), azul-escuro e preto; logótipos brancos
    fato = load("771780f5-image.jpg")
    jacket0, mj = cutout(fato, (80, 30, 560, 720))
    pants0, mpn = cutout(fato, (150, 780, 480, 1645))
    for name, color in [("fato-saida-azul-escuro", NAVY), ("fato-saida-preto", BLACK)]:
        jacket = brand(recolor(jacket0, color, keep_dark=False), jacket0, (0.24, 0.25, 0.33, 0.31), dark=False)
        jacket = apply_logo(jacket, mj, 0.715, 0.28, 0.13, dark=False)
        pants = recolor(pants0, color, keep_dark=False, soften=1.0, neutral_fabric=mpn) if color != BLACK else pants0.copy()
        pants = brand(pants, pants0, (0.84, 0.22, 1.0, 0.35), dark=False)
        pants = apply_logo(pants, mpn, 0.11, 0.285, 0.14, dark=False)
        c = background()
        c = place(c, jacket, mj, 0.34, 0.42, 0.56)
        c = place(c, pants, mpn, 0.73, 0.52, 0.82)
        save(c, name)

    # T-shirt de algodão — preto, azul-escuro e amarelo
    tee0, mt = cutout(load("ebaa9f98-image.jpg"), (140, 120, 890, 1035))
    for name, color, dark in [("tshirt-preto", BLACK, False), ("tshirt-azul-escuro", NAVY, False), ("tshirt-amarelo", YELLOW, True)]:
        tee = brand(recolor(tee0, color, keep_dark=False), tee0, (0.30, 0.18, 0.39, 0.24), dark)
        tee = apply_logo(tee, mt, 0.655, 0.21, 0.13, dark=dark)
        save(place(background(), tee, mt, 0.5, 0.48, 0.74), name)

    # Kit saída — polo + calções da mesma cor
    kit2 = load("22a477b8-image.jpg")
    polo0, mp = cutout(kit2, (0, 300, 840, 1300), include_dark=False)
    shorts2, ms2 = cutout(kit2, (90, 1300, 730, 1930), include_dark=False)
    for name, color, dark in [
        ("kit-saida-azul-escuro", NAVY, False),
        ("kit-saida-branco", WHITE, True),
        ("kit-saida-preto", BLACK, False),
        ("kit-saida-amarelo", YELLOW, True),
    ]:
        polo = brand(recolor(polo0, color, keep_dark=False), polo0, (0.30, 0.19, 0.39, 0.26), dark)
        polo = apply_logo(polo, mp, 0.655, 0.235, 0.13, dark=dark)
        light = sum(color) > 300
        sh = recolor(shorts2, color, keep_dark=False, soften=1.0 if light else 0.0)
        sh = brand(sh, shorts2, (0.84, 0.81, 0.95, 0.90), dark)
        sh = apply_logo(sh, ms2, 0.15, 0.855, 0.13, dark=dark)
        c = background()
        c = place(c, polo, mp, 0.42, 0.37, 0.6)
        c = place(c, sh, ms2, 0.65, 0.75, 0.36)
        save(c, name)
