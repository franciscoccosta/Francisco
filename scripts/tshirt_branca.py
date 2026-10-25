"""
T-shirt de algodão branca, feita a partir da amarela já gerada (public/fotos/tshirt-amarelo.jpg):
o tecido amarelo passa a branco mantendo as sombras; o logótipo e o símbolo já são azul-escuro,
que é a cor certa numa peça clara.

Uso:  python3 scripts/tshirt_branca.py
"""

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

a = np.asarray(Image.open("public/fotos/tshirt-amarelo.jpg").convert("RGB"), np.float32) / 255
h, w, _ = a.shape
mx, mn = a.max(2), a.min(2)
sat = (mx - mn) / (mx + 1e-6)
yel = (sat > 0.35) & (a[..., 0] > 0.3) & (a[..., 2] < a[..., 0] * 0.8)
yel[int(h * 0.95) :] = False  # faixa amarela do fundo
lab, n = ndi.label(yel)
garment = lab == (np.argmax(ndi.sum(yel, lab, range(1, n + 1))) + 1)
garment = ndi.binary_dilation(ndi.binary_fill_holes(ndi.binary_closing(garment, iterations=3)), iterations=2)

lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
ref = np.median(lum[garment & yel])
white = np.array((244, 245, 247), np.float32) / 255
shade = np.minimum(lum / ref, 1.03) ** 1.6  # realçar um pouco as sombras (o branco achata-as)
painted = white * shade[..., None]
# pixels de tom amarelo dentro da peça (tecido e orlas dos logótipos) passam a neutro
yellowish = garment & (a[..., 0] - a[..., 2] > 0.06)
wgt = ndi.gaussian_filter(yellowish.astype(np.float32), 0.8) * garment
out = a * (1 - wgt[..., None]) + painted * wgt[..., None]
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save("public/fotos/tshirt-branco.jpg", quality=86, optimize=True, progressive=True)
print("criado tshirt-branco")
