"""Extrai o símbolo do Camões Andebol de uma fotografia da camisola branca (nº 16)
e gera versões com fundo transparente. Provisório até haver o logótipo oficial."""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB").crop((1248, 905, 1440, 1088))
a = np.asarray(im, np.float32)
lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
blueish = a[..., 2] - a[..., 0]  # tinta azul-escura: B > R
ink = np.clip((175 - lum) / 45, 0, 1) * np.clip((blueish + 5) / 25, 0, 1)

SCALE = 6
m = Image.fromarray((ink * 255).astype(np.uint8)).resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
m = m.filter(ImageFilter.GaussianBlur(SCALE * 0.55))
arr = np.asarray(m, np.float32) / 255
arr = np.clip((arr - 0.42) / 0.16, 0, 1)  # contorno nítido, com antialiasing

# remover pontos soltos fora do logótipo
alpha = Image.fromarray((arr * 255).astype(np.uint8))
bbox = alpha.point(lambda v: 255 if v > 128 else 0).getbbox()
alpha = alpha.crop(bbox)
arr = np.asarray(alpha, np.float32) / 255
rows = arr.max(axis=1)

# separar símbolo (figura + bola) do texto: maior intervalo vazio na metade superior
h = arr.shape[0]
empty = np.where(rows[: int(h * 0.65)] < 0.05)[0]
cut = int(empty[len(empty) // 2]) if len(empty) else int(h * 0.55)

def save(alpha_arr, name, rgb):
    img = Image.new("RGBA", (alpha_arr.shape[1], alpha_arr.shape[0]), rgb + (0,))
    img.putalpha(Image.fromarray((alpha_arr * 255).astype(np.uint8)))
    img = img.crop(img.getbbox())
    img.save(f"{out}/{name}.png", optimize=True)
    print(name, img.size)

NAVY, WHITE = (19, 41, 79), (255, 255, 255)
save(arr, "camoes-navy", NAVY)
save(arr, "camoes-white", WHITE)
save(arr[:cut], "simbolo-navy", NAVY)
save(arr[:cut], "simbolo-white", WHITE)
