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


def paint(a, region, target, soften=0.0):
    """Pinta só `region` (0–1) com `target`, mantendo a luz/sombra (para peças com dois tecidos)."""
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    shade = np.minimum(lum / max(float(np.median(lum[region > 0.9])), 1e-3), 1.2)
    if soften:
        shade = 1 + (ndi.gaussian_filter(shade, 2.5) - 1) * (1 - 0.5 * soften)
    t = np.array(target, np.float32) / 255
    base = t[None, None] * np.minimum(shade, 1)[..., None]
    hi = np.clip(shade - 1, 0, 1)[..., None] * (0.55 if t.mean() > 0.4 else 0.25)
    painted = base + (1 - base) * hi
    return np.clip(a * (1 - region[..., None]) + painted * region[..., None], 0, 1)


def apply_logo(a, mask, cx, cy, width, dark=True, opacity=0.95):
    """Aplica o símbolo centrado em (cx, cy) — frações da peça — com `width` em fração da largura."""
    h, w, _ = a.shape
    logo = LOGO_NAVY if dark else LOGO_WHITE
    lw = int(w * width)
    lh = int(logo.height * lw / logo.width)
    lg = np.asarray(logo.resize((lw, lh), Image.LANCZOS), np.float32) / 255
    x0 = min(max(int(w * cx - lw / 2), 0), w - lw)
    y0 = min(max(int(h * cy - lh / 2), 0), h - lh)
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


def brand(a, orig, box, dark, place_mark=True, mask=None):
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
    if mask is not None:  # ignorar o fundo à volta da peça
        diff = diff * ndi.binary_erosion(mask[y0:y1, x0:x1] > 0.5, iterations=4)
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
    if not place_mark:
        return a

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
    # centro do logótipo da marca (frações), para alinhar o símbolo do Camões na mesma linha
    brand.last = (cx / w, cy / h)
    return a


def place_mark(a, cx, cy, width, dark):
    """Coloca o logótipo limpo da marca centrado em (cx, cy), com `width` em fração da largura."""
    h, w, _ = a.shape
    nw = int(w * width)
    nh = int(OFFSIDE.height * nw / OFFSIDE.width)
    mark = np.asarray(OFFSIDE.resize((nw, nh), Image.LANCZOS), np.float32)[..., 3:4] / 255
    x0, y0 = int(w * cx - nw / 2), int(h * cy - nh / 2)
    color = np.array(NAVY if dark else (250, 250, 250), np.float32) / 255
    a[y0 : y0 + nh, x0 : x0 + nw] = a[y0 : y0 + nh, x0 : x0 + nw] * (1 - mark) + color * mark
    return a


def backpack_details(a, m):
    """Desenha o fecho à volta do topo (paralelo ao contorno), puxadores e a costura do compartimento."""
    h, w, _ = a.shape
    inside = m > 0.5
    dist = ndi.distance_transform_edt(inside)
    d0 = w * 0.045  # o fecho corre a esta distância do contorno
    yy, xx = np.mgrid[0:h, 0:w]
    top = yy < h * 0.62
    track = (np.abs(dist - d0) < w * 0.006) & top
    shadow = (np.abs(dist - d0 - w * 0.008) < w * 0.004) & top
    a[shadow] *= 0.7
    a[track] = a[track] * 0.45
    hl = (np.abs(dist - d0 + w * 0.007) < w * 0.0025) & top
    a[hl] = np.minimum(a[hl] * 1.5, 1)
    # puxadores (perto dos cantos de cima)
    img = to_img(a)
    dr = ImageDraw.Draw(img)
    for side in (1, -1):
        ys = np.where(track[:, w // 2 + side * int(w * 0.3)])[0]
        if len(ys):
            px, py = w // 2 + side * int(w * 0.3), int(ys.min())
            dr.rounded_rectangle((px - w * 0.018, py, px + w * 0.018, py + h * 0.07), radius=w * 0.01, fill=(12, 26, 52))
            dr.rounded_rectangle((px - w * 0.01, py + h * 0.012, px + w * 0.01, py + h * 0.05), radius=w * 0.005, fill=(40, 60, 100))
    # puxador do compartimento de baixo
    seam_y = int(h * 0.705)
    dr.rounded_rectangle((w * 0.78, seam_y - h * 0.008, w * 0.81, seam_y + h * 0.05), radius=w * 0.008, fill=(12, 26, 52))
    a = np.asarray(img, np.float32) / 255
    return a


def symbol_alpha(width):
    """Só a figura do símbolo do Camões (sem texto), desenhada em vetor — a mesma do cabeçalho do site."""
    vx, vy, vw, vh = 250, 0, 830, 620
    f = 4 * width / vw
    img = Image.new("L", (int(vw * f), int(vh * f)), 0)
    d = ImageDraw.Draw(img)
    T = lambda x, y: ((x - vx) * f, (y - vy) * f)
    for cx, cy, rx, ry in [(548, 78, 92, 76), (808, 298, 117, 107)]:
        d.ellipse([*T(cx - rx, cy - ry), *T(cx + rx, cy + ry)], fill=255)
    d.polygon([T(x, y) for x, y in [(484, 156), (528, 184), (466, 316), (1068, 566), (1064, 612), (262, 360)]], fill=255)
    img = img.resize((int(width), int(width * vh / vw)), Image.LANCZOS)
    return np.asarray(img, np.float32) / 255


def apply_symbol(a, mask, cx, cy, width, color):
    h, w, _ = a.shape
    al = symbol_alpha(w * width)
    lh, lw = al.shape
    x0, y0 = int(w * cx - lw / 2), int(h * cy - lh / 2)
    al = al[..., None] * mask[y0 : y0 + lh, x0 : x0 + lw, None]
    col = np.array(color, np.float32) / 255
    a[y0 : y0 + lh, x0 : x0 + lw] = a[y0 : y0 + lh, x0 : x0 + lw] * (1 - al) + col * al
    return a


def make_sock(color, dark_logo, S=4):
    """Desenha uma meia desportiva (cano, calcanhar e biqueira reforçados, punho canelado)
    com o símbolo do Camões no cano. Devolve (rgb, máscara)."""
    W, H = 900 * S // 4, 1100 * S // 4
    k = S / 4
    pts = [(170, 40), (470, 40), (470, 610), (520, 660), (700, 720), (790, 760), (830, 820), (800, 880),
           (720, 905), (330, 905), (220, 880), (170, 800)]
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).polygon([(x * k, y * k) for x, y in pts], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(28 * k)).point(lambda v: 255 if v > 128 else 0).filter(ImageFilter.GaussianBlur(1.2))
    mask = np.asarray(m, np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32) / k
    base = np.array(color, np.float32) / 255
    # volume: o cano é um cilindro (mais escuro nas margens), o pé é mais escuro em baixo
    leg_shade = 1 - 0.35 * ((xx - 320) / 160) ** 2
    foot_shade = 1 - 0.25 * np.clip((yy - 760) / 150, 0, 1)
    shade = np.where(yy < 620, leg_shade, foot_shade)
    shade = np.clip(shade, 0.55, 1.08)
    # malha: riscas finas verticais no punho canelado, textura suave no resto
    rib = (yy < 170) * (0.9 + 0.1 * np.sin(xx / 6))
    shade = shade * np.where(yy < 170, rib, 1.0)
    shade *= 1 + (np.random.default_rng(1).standard_normal((H, W)).astype(np.float32) * 0.012)
    rgb = base[None, None] * shade[..., None]
    # calcanhar e biqueira reforçados (um tom mais escuro)
    heel = ((xx - 210) ** 2 / 90 ** 2 + (yy - 830) ** 2 / 110 ** 2) < 1
    toe = ((xx - 790) ** 2 / 90 ** 2 + (yy - 830) ** 2 / 100 ** 2) < 1
    rgb[heel | toe] *= 0.82
    # linha do punho
    rgb[(np.abs(yy - 175) < 4)] *= 0.8
    rgb = np.clip(rgb, 0, 1)
    rgb = apply_symbol(rgb, mask, 320 / 900, 330 / 1100, 0.24, YELLOW)  # só a figura, em amarelo
    ys, xs = np.where(mask > 0.02)  # cortar o espaço vazio à volta (para a sombra ficar junto à meia)
    sl = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
    return rgb[sl], mask[sl]


def warp_to(flat, quad, size):
    """Projeta uma imagem "de frente" (`flat`) sobre a zona `quad` (4 cantos) de uma imagem de tamanho `size`."""
    W, H = flat.size
    src = [(0, 0), (W, 0), (W, H), (0, H)]
    A, B = [], []
    for (x, y), (X, Y) in zip(quad, src):
        A += [[x, y, 1, 0, 0, 0, -X * x, -X * y], [0, 0, 0, x, y, 1, -Y * x, -Y * y]]
        B += [X, Y]
    c = np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()
    return flat.transform(size, Image.PERSPECTIVE, c, Image.BICUBIC)


def perspective(img, src_quad, size):
    """Endireita a zona `src_quad` (4 cantos: sup-esq, sup-dir, inf-dir, inf-esq) para um retângulo."""
    W, H = size
    dst = [(0, 0), (W, 0), (W, H), (0, H)]
    A, B = [], []
    for (x, y), (X, Y) in zip(dst, src_quad):
        A += [[x, y, 1, 0, 0, 0, -X * x, -X * y], [0, 0, 0, x, y, 1, -Y * x, -Y * y]]
        B += [X, Y]
    c = np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()
    return img.transform(size, Image.PERSPECTIVE, c, Image.BICUBIC, fillcolor=(255, 255, 255))


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

    # Mochila — azul-escuro. O símbolo do Camões é desenhado "de frente" e depois projetado com a
    # perspetiva do painel da frente da mochila, para parecer estampado no tecido.
    bp_img = Image.open(f"{SRC}/bae1f97b-image.png").convert("RGB")
    panel = [(750, 455), (1240, 455), (1245, 1500), (750, 1665)]  # cantos do painel da frente na foto
    PW, PH = 700, 1100
    flat = Image.new("RGBA", (PW, PH), (255, 255, 255, 0))
    lw = int(PW * 0.4)
    lg = LOGO_WHITE.resize((lw, int(LOGO_WHITE.height * lw / LOGO_WHITE.width)), Image.LANCZOS)
    flat.alpha_composite(lg, (int(PW * 0.585 - lw / 2), int(PH * 0.13)))
    warped = warp_to(flat, panel, bp_img.size)
    al = np.asarray(warped, np.float32)[..., 3:4] / 255 * 0.96
    full = np.asarray(bp_img, np.float32) / 255
    full = full * (1 - al) + 1.0 * al
    rgb, m = cutout(full, (270, 445, 1250, 1700))
    rgb = recolor(rgb, NAVY, keep_dark=True)  # o branco do símbolo e da marca não tem cor: mantém-se
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
        shorts = apply_logo(shorts, mh, 0.17, 0.875, 0.17, dark=dark)
        c = background()
        c = place(c, shirt, ms, 0.42, 0.37, 0.6)
        c = place(c, shorts, mh, 0.64, 0.75, 0.36)
        save(c, name)
        # peças vendidas em separado
        slug = name.removeprefix("treino-")
        save(place(background(), shirt, ms, 0.5, 0.48, 0.72), f"treino-tshirt-{slug}")
        save(place(background(), shorts, mh, 0.5, 0.5, 0.62), f"treino-calcoes-{slug}")

    # Fato de treino de saída — casaco + calças (algodão), azul-escuro e preto; logótipos brancos
    fato = load("771780f5-image.jpg")
    jacket0, mj = cutout(fato, (80, 30, 560, 720))
    pants0, mpn = cutout(fato, (150, 780, 480, 1645))
    for name, color in [("fato-saida-azul-escuro", NAVY), ("fato-saida-preto", BLACK)]:
        jacket = brand(recolor(jacket0, color, keep_dark=False), jacket0, (0.24, 0.25, 0.33, 0.31), dark=False)
        bx, by = brand.last
        jacket = apply_logo(jacket, mj, 1 - bx, by, 0.13, dark=False)
        pants = recolor(pants0, color, keep_dark=False, soften=1.0, neutral_fabric=mpn) if color != BLACK else pants0.copy()
        pants = brand(pants, pants0, (0.84, 0.22, 1.0, 0.35), dark=False, mask=mpn)
        bx, by = brand.last  # símbolo do Camões na mesma linha do logótipo da marca, na outra perna
        pants = apply_logo(pants, mpn, 1 - bx, by, 0.14, dark=False)
        c = background()
        c = place(c, jacket, mj, 0.34, 0.42, 0.56)
        c = place(c, pants, mpn, 0.73, 0.52, 0.82)
        save(c, name)
        if color == BLACK:  # calças vendidas em separado (só em preto)
            save(place(background(), pants, mpn, 0.5, 0.5, 0.84), "calcas-fato-treino-preto")

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

    # ---------------- Agasalhos ----------------
    SWEAT_COLORS = [("amarelo", YELLOW, True), ("azul-escuro", NAVY, False), ("preto", BLACK, False), ("branco", WHITE, True)]

    # Casaco softshell — preto e azul-escuro (tecido original cinzento-escuro)
    soft0, msf = cutout(load("d55f8db3-image.jpg"), (150, 20, 1080, 1120))
    for slug, color in [("preto", BLACK), ("azul-escuro", NAVY)]:
        jk = recolor(soft0, color, keep_dark=False, soften=0.6, neutral_fabric=msf)
        jk = brand(jk, soft0, (0.30, 0.28, 0.38, 0.34), dark=False)
        jk = apply_logo(jk, msf, 0.665, 0.31, 0.12, dark=False)
        save(place(background(), jk, msf, 0.5, 0.48, 0.8), f"softshell-{slug}")

    # Sweatshirt com capuz
    hood0, mhd = cutout(load("68dca8a8-image.jpg"), (60, 60, 720, 860))
    for slug, color, dark in SWEAT_COLORS:
        hd = recolor(hood0, color, keep_dark=False)  # o forro e os cordões são pretos (sem cor), por isso mantêm-se
        hd = brand(hd, hood0, (0.27, 0.23, 0.37, 0.30), dark)
        hd = apply_logo(hd, mhd, 0.68, 0.265, 0.13, dark=dark)
        save(place(background(), hd, mhd, 0.5, 0.48, 0.8), f"sweat-capuz-{slug}")

    # Sweatshirt sem capuz
    crew0, mcw = cutout(load("1e2c773d-image.jpg"), (60, 25, 660, 780))
    for slug, color, dark in SWEAT_COLORS:
        cw = recolor(crew0, color, keep_dark=False)
        cw = brand(cw, crew0, (0.28, 0.18, 0.39, 0.26), dark)
        cw = apply_logo(cw, mcw, 0.665, 0.22, 0.13, dark=dark)
        save(place(background(), cw, mcw, 0.5, 0.48, 0.78), f"sweat-{slug}")

    # Quarter zip — azul-escuro (original) e preto
    qz0, mqz = cutout(load("5fce76fb-image.jpg"), (150, 20, 800, 880))
    for slug, color in [("azul-escuro", NAVY), ("preto", BLACK)]:
        qz = recolor(qz0, color, keep_dark=False)
        qz = brand(qz, qz0, (0.30, 0.20, 0.40, 0.27), dark=False)
        qz = apply_logo(qz, mqz, 0.65, 0.235, 0.12, dark=False)
        save(place(background(), qz, mqz, 0.5, 0.48, 0.8), f"quarter-zip-{slug}")

    # Casaco combinado — frente acolchoada + mangas/capuz: azul-escuro/azul (original) e preto/cinzento
    hy0, mhy = cutout(load("25f48ae0-image.png"), (1060, 360, 1920, 1370))
    # mangas e capuz = azul vivo (bem mais azul do que vermelho, mesmo na sombra); a frente é azul-escuro
    sleeves = (hy0[..., 2] - hy0[..., 0] > 0.22) & (mhy > 0.5)
    sleeves = ndi.binary_closing(ndi.binary_opening(sleeves, iterations=3), iterations=8) & (mhy > 0.5)
    sleeves = ndi.gaussian_filter(sleeves.astype(np.float32), 1.5)
    for slug in ["azul-escuro-azul", "preto-cinzento"]:
        hy = hy0.copy()
        if slug == "preto-cinzento":
            hy = paint(paint(hy, (mhy > 0.5) * (1 - sleeves), BLACK), sleeves, (112, 114, 118), soften=0.5)
        hy = brand(hy, hy0, (0.32, 0.22, 0.40, 0.28), dark=False, mask=mhy)
        bx, by = brand.last
        hy = apply_logo(hy, mhy, 1 - bx, by, 0.12, dark=False)
        save(place(background(), hy, mhy, 0.5, 0.48, 0.8), f"casaco-combinado-{slug}")

    # Blusão acolchoado com capuz — só azul-escuro (tecido original verde)
    pk0, mpk = cutout(load("b7e14515-image.png"), (160, 390, 920, 1480))
    for slug, color in [("azul-escuro", NAVY)]:
        pk = recolor(pk0, color, keep_dark=False, soften=0.4)
        pk = brand(pk, pk0, (0.30, 0.20, 0.39, 0.27), dark=False, mask=mpk)
        bx, by = brand.last
        pk = apply_logo(pk, mpk, 1 - bx, by, 0.12, dark=False)
        save(place(background(), pk, mpk, 0.5, 0.48, 0.82), f"blusao-{slug}")

    # Calças de fato de treino — ver bloco do fato de treino (só preto)

    # Pack de 3 meias — preto e azul-escuro (desenhadas: não há fotografia do fornecedor)
    for slug, color, dark in [("preto", BLACK, False), ("azul-escuro", NAVY, False)]:
        sock, msk = make_sock(color, dark)
        c = background()
        for cx, cy, ang in [(0.3, 0.47, 10), (0.5, 0.45, 0), (0.7, 0.47, -10)]:
            r = to_img(sock).rotate(ang, resample=Image.BICUBIC, expand=True, fillcolor=(0, 0, 0))
            rm = to_img(msk).rotate(ang, resample=Image.BICUBIC, expand=True)
            bb = rm.point(lambda v: 255 if v > 8 else 0).getbbox()
            r, rm = r.crop(bb), rm.crop(bb)
            c = place(c, np.asarray(r, np.float32) / 255, np.asarray(rm, np.float32) / 255, cx, cy, 0.6)
        save(c, f"meias-{slug}")
