"""Procedural reclaimed-wood photography for the ReMade prototype.

Renders close-up "photographs" of reclaimed timber (side grain, end grain,
floorboards, laths, painted doors, stacked planks, industrial timber) using
noise-driven ring models, a height map, raking light and a camera pass
(vignette, depth of field, grain, tone curve).
"""
import sys, os, math
import numpy as np
from scipy.ndimage import gaussian_filter, map_coordinates
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else "out"
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- utilities
def noise(shape, sigma, rng):
    sy, sx = (sigma, sigma) if np.isscalar(sigma) else sigma
    fy, fx = max(1, int(sy / 3)), max(1, int(sx / 3))
    if fy > 1 or fx > 1:
        from scipy.ndimage import zoom
        small = (shape[0] // fy + 2, shape[1] // fx + 2)
        n = gaussian_filter(rng.standard_normal(small), (sy / fy, sx / fx), mode="wrap")
        n = zoom(n, (fy, fx), order=3)[: shape[0], : shape[1]]
    else:
        n = gaussian_filter(rng.standard_normal(shape), (sy, sx), mode="wrap")
    n -= n.mean()
    s = n.std()
    return n / s if s > 0 else n


def fbm(shape, base_sigma, rng, octaves=4, gain=0.5, aniso=(1, 1)):
    out = np.zeros(shape)
    amp, total = 1.0, 0.0
    sy, sx = (base_sigma, base_sigma) if np.isscalar(base_sigma) else base_sigma
    for _ in range(octaves):
        out += amp * noise(shape, (max(sy * aniso[0], 0.4), max(sx * aniso[1], 0.4)), rng)
        total += amp
        amp *= gain
        sy /= 2
        sx /= 2
    return out / total


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def col(hexs):
    hexs = hexs.lstrip("#")
    return np.array([int(hexs[i : i + 2], 16) / 255 for i in (0, 2, 4)])


def mix_color(c1, c2, t):
    return c1[None, None, :] * (1 - t[..., None]) + c2[None, None, :] * t[..., None]


# ------------------------------------------------------------- wood models
def side_grain(h, w, rng, ring_freq=18, depth=0.25, taper=0.25, knots=0, straight=False):
    """Returns (latewood mask 0..1, fibre streaks, knot mask). ring_freq ~ ring spacing control."""
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    spacing = rng.uniform(9, 16) * (18.0 / ring_freq) ** 0.5  # px between rings
    # large, grain-aligned warps (long along x)
    warp = fbm((h, w), (30, 260), rng, 3)
    y2 = yy + 22 * warp
    for _ in range(knots):
        kx, ky = rng.uniform(0.1, 0.9) * w, rng.uniform(0.25, 0.75) * h
        rx, ry = rng.uniform(40, 90), rng.uniform(14, 26)
        g = np.exp(-(((xx - kx) / (rx * 2.5)) ** 2 + ((yy - ky) / (ry * 2.5)) ** 2))
        y2 += 26 * g * np.tanh((yy - ky) / ry)
    knot_mask = np.zeros((h, w))
    for _ in range(knots):
        kx, ky = rng.uniform(0.1, 0.9) * w, rng.uniform(0.25, 0.75) * h
        rx, ry = rng.uniform(10, 22), rng.uniform(7, 14)
        knot_mask = np.maximum(knot_mask, np.exp(-(((xx - kx) / rx) ** 2 + ((yy - ky) / ry) ** 2) * 1.5))
    if straight:
        r = y2 + 2.0 * fbm((h, w), (1.5, 60), rng, 2)
    else:
        # flat-sawn cathedrals: cut plane depth varies slowly along the board
        D = rng.uniform(4, 9) * spacing
        d = D * (0.35 + 0.65 * (0.5 + 0.5 * np.sin(xx / rng.uniform(250, 520) + rng.uniform(0, 6)))) + D * 0.25 * fbm((h, w), (60, 300), rng, 2)
        c = rng.uniform(0.3, 0.7) * h
        r = np.sqrt((y2 - c) ** 2 + d ** 2)
        r += 1.2 * fbm((h, w), (1.2, 40), rng, 2)
    rings = (r / spacing) % 1.0
    width = rng.uniform(0.22, 0.34)
    late = smoothstep(1 - width, 1 - width * 0.3, rings) * (1 - smoothstep(0.97, 1.0, rings))
    late = late * (0.55 + 0.45 * smoothstep(-1, 1, fbm((h, w), (40, 200), rng, 2)))
    late = np.clip(late + knot_mask * 1.3, 0, 1.4)
    fibre = noise((h, w), (0.6, 30), rng) * 0.55 + noise((h, w), (0.35, 6), rng) * 0.3 + noise((h, w), (4, 120), rng) * 0.4
    return late, fibre, knot_mask


def end_grain(h, w, rng, cx, cy, ring_px=9.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    dx, dy = xx - cx, yy - cy
    r = np.sqrt(dx ** 2 + dy ** 2)
    ang = np.arctan2(dy, dx)
    r_w = r * (1 + 0.05 * np.sin(ang * 3 + rng.uniform(0, 6))) + 3.0 * fbm((h, w), max(h, w) * 0.08, rng, 3)
    ring_px = ring_px * rng.uniform(0.8, 1.25)
    rings = (r_w / ring_px) % 1.0
    late = smoothstep(0.62, 0.86, rings) * (1 - smoothstep(0.94, 1.0, rings))
    # radial checks (drying cracks)
    cracks = np.zeros((h, w))
    for _ in range(rng.integers(1, 4)):
        a0 = rng.uniform(-math.pi, math.pi)
        da = np.angle(np.exp(1j * (ang - a0)))
        wid = 0.012 + 0.02 * smoothstep(0, max(h, w) * 0.6, r)
        rmax = rng.uniform(0.3, 0.75) * max(h, w)
        crack = (1 - smoothstep(0, wid, np.abs(da + 0.02 * fbm((h, w), 6, rng, 2)))) * (r > ring_px * 1.5) * (r < rmax)
        cracks = np.maximum(cracks, crack)
    saw = 0.5 + 0.5 * np.sin((xx * math.cos(0.3) + yy * math.sin(0.3)) * 0.9 + 2 * fbm((h, w), 20, rng, 2))
    return late, cracks, saw, r


def draw_cracks(h, w, rng, n, length=(0.2, 0.7), maxw=2.5, horizontal=True):
    m = np.zeros((h, w))
    L = w if horizontal else h
    S = h if horizontal else w
    for _ in range(n):
        ln = int(L * rng.uniform(*length))
        x0 = rng.integers(0, max(1, L - ln))
        y = rng.uniform(0.08, 0.92) * S
        drift = np.cumsum(rng.normal(0, 0.25, ln))
        drift = gaussian_filter(drift, 12)
        wmax = rng.uniform(0.8, maxw)
        for i in range(ln):
            t = i / ln
            wd = wmax * math.sin(math.pi * t) ** 0.6
            yc = y + drift[i]
            lo, hi = int(yc - wd - 1), int(yc + wd + 2)
            for yi in range(max(lo, 0), min(hi, S)):
                val = max(0.0, 1 - abs(yi - yc) / (wd + 0.6))
                if horizontal:
                    m[yi, x0 + i] = max(m[yi, x0 + i], val)
                else:
                    m[x0 + i, yi] = max(m[x0 + i, yi], val)
    return gaussian_filter(m, 0.6)


def nail_holes(h, w, rng, n, rmin=3, rmax=7):
    hole = np.zeros((h, w))
    rust = np.zeros((h, w))
    yy, xx = np.mgrid[0:h, 0:w]
    for _ in range(n):
        cx, cy = rng.uniform(0.05, 0.95) * w, rng.uniform(0.15, 0.85) * h
        rr = rng.uniform(rmin, rmax)
        d = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.1) ** 2)
        hole = np.maximum(hole, 1 - smoothstep(rr * 0.6, rr, d))
        rust = np.maximum(rust, np.exp(-(d / (rr * 3.2)) ** 2))
    return hole, rust


def shade(height, strength=6.0, light=(-0.65, -0.55, 0.55), ambient=0.38):
    gy, gx = np.gradient(height)
    nx, ny, nz = -gx * strength, -gy * strength, np.ones_like(height)
    n = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    L = np.array(light) / np.linalg.norm(light)
    d = (nx * L[0] + ny * L[1] + nz * L[2]) / n
    return ambient + (1 - ambient) * np.clip(d, 0, 1) / (L[2])


def camera(img, rng, vignette=0.45, grain=0.018, dof=None, warm=0.03, contrast=1.08, light_dir=(-0.4, -0.3), falloff=0.35):
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    ny, nx = yy / h - 0.5, xx / w - 0.5
    # directional light falloff (window light)
    lf = 1 - falloff * np.clip((nx * light_dir[0] * -2 + ny * light_dir[1] * -2) * 0.5 + 0.5, 0, 1)
    img = img * lf[..., None]
    if dof is not None:
        blurred = np.stack([gaussian_filter(img[..., c], dof[1]) for c in range(3)], -1)
        m = dof[0]
        img = img * (1 - m[..., None]) + blurred * m[..., None]
    v = 1 - vignette * np.clip((nx ** 2 + ny ** 2) * 2.2, 0, 1) ** 1.3
    img = img * v[..., None]
    # tone: filmic-ish S curve
    img = np.clip(img, 0, None)
    img = img / (1 + img * 0.12)
    img = 0.5 + (img - 0.5) * contrast
    img[..., 0] *= 1 + warm
    img[..., 2] *= 1 - warm
    lum_grain = rng.standard_normal((h, w)) * grain
    img = img + lum_grain[..., None] + rng.standard_normal((h, w, 3)) * grain * 0.3
    img = gaussian_filter(img, (0.45, 0.45, 0))
    return np.clip(img, 0, 1)


def save(img, name, q=84):
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)
    print("saved", name)


# ------------------------------------------------------------------- scenes
PALETTES = {
    # early, late, patina
    "oak": ("#b98a5a", "#6e4a2c", "#3a2a1c"),
    "pine": ("#c99a64", "#8a5328", "#4b301b"),
    "pitch": ("#b07a45", "#5a3015", "#2e1a0e"),
    "chestnut": ("#a8774a", "#5b3a22", "#2f2016"),
    "grey": ("#a39a8b", "#6b6255", "#4a443b"),
    "dark": ("#7a5638", "#3a2416", "#1d130c"),
}


def board_texture(h, w, rng, pal="oak", ring_freq=16, knots=1, weather=0.0, straight=False, cracks=2, nails=0, patina=0.3):
    e, l, p = (col(c) for c in PALETTES[pal])
    late, fibre, knot = side_grain(h, w, rng, ring_freq=ring_freq, knots=knots, straight=straight)
    base = mix_color(e, l, np.clip(late * 0.7, 0, 1))
    broad = fbm((h, w), max(h, w) * 0.2, rng, 3)
    base *= (1 + 0.1 * fibre + 0.09 * broad)[..., None]
    pat = np.clip(patina * (0.6 + 0.5 * fbm((h, w), max(h, w) * 0.12, rng, 3)), 0, 1)
    base = base * (1 - pat[..., None] * 0.55) + p[None, None, :] * pat[..., None] * 0.55
    if weather > 0:
        lum = base.mean(-1, keepdims=True)
        grey = lum * np.array([1.02, 1.0, 0.95]) * 1.08
        wm = np.clip(weather * (0.8 + 0.4 * fbm((h, w), h * 0.3, rng, 2)), 0, 1)[..., None]
        base = base * (1 - wm) + grey * wm
    height = -0.35 * late * (0.4 + weather) + 0.25 * fibre * 0.3
    cr = draw_cracks(h, w, rng, cracks) if cracks else np.zeros((h, w))
    height -= cr * 2.2
    base *= (1 - 0.85 * cr)[..., None]
    if nails:
        hole, rust = nail_holes(h, w, rng, nails)
        rust_c = col("#6b3a1c")
        base = base * (1 - 0.45 * rust[..., None]) + rust_c * 0.45 * rust[..., None]
        base *= (1 - 0.8 * hole)[..., None]
        height -= hole * 1.5
    return base, height


def compose_boards(H, W, rng, rows, pal="oak", gap=4, vertical=False, **kw):
    """Stack of boards side by side; rows = list of pixel widths."""
    img = np.zeros((H, W, 3)) + col("#120c08")
    height = np.zeros((H, W)) - 1.5
    pos = 0
    for rw in rows:
        if pos >= (W if vertical else H):
            break
        bh = min(rw, (W if vertical else H) - pos)
        L = H if vertical else W
        tex, ht = board_texture(bh, L, rng, pal=pal, **kw) if not vertical else board_texture(bh, L, rng, pal=pal, **kw)
        # edge bevel / ambient occlusion
        prof = np.linspace(0, 1, bh)
        edge = smoothstep(0, 0.07, prof) * smoothstep(0, 0.07, 1 - prof)
        ht = ht + 1.2 * edge[:, None]
        tex = tex * (0.55 + 0.45 * edge[:, None, None])
        tex *= rng.uniform(0.85, 1.08)
        if vertical:
            img[:, pos : pos + bh] = np.transpose(tex, (1, 0, 2))
            height[:, pos : pos + bh] = ht.T
        else:
            img[pos : pos + bh] = tex
            height[pos : pos + bh] = ht
        pos += bh + gap + int(rng.integers(0, 3))
    return img, height


def light(img, height, strength=5, light_dir=(-0.65, -0.55, 0.55), ambient=0.4):
    s = shade(gaussian_filter(height, 0.8), strength, light_dir, ambient)
    return img * s[..., None]


# ---- 1. end-grain stack (hero)
def scene_endgrain(W, H, seed, pal="pine", name="endgrain.jpg", cols_=(4, 7)):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3)) + col("#0e0907")
    height = np.zeros((H, W)) - 2
    e, l, p = (col(c) for c in PALETTES[pal])
    y = -int(H * 0.05)
    while y < H:
        rh = int(H * rng.uniform(0.2, 0.3))
        x = -int(rng.uniform(0, 0.12) * W)
        while x < W:
            bw = int(rh * rng.uniform(0.75, 1.35))
            gap = int(rng.uniform(4, 12))
            bh = rh - gap
            x0, y0 = max(x, 0), max(y, 0)
            x1, y1 = min(x + bw - gap, W), min(y + bh, H)
            if x1 - x0 > 8 and y1 - y0 > 8:
                hh, ww = bh, bw - gap
                cx = ww * rng.uniform(0.1, 0.9) + rng.choice([0, 0, rng.uniform(-1.2, 1.2) * ww])
                cy = hh * rng.uniform(0.1, 0.9) + rng.choice([0, 0, rng.uniform(-1.2, 1.2) * hh])
                late, cracks, saw, r = end_grain(hh, ww, rng, cx, cy, ring_px=max(hh, ww) / rng.uniform(14, 28))
                tone = rng.uniform(0.7, 1.12)
                ee = e * rng.uniform(0.85, 1.05) * np.array([1, rng.uniform(0.95, 1.02), rng.uniform(0.9, 1.05)])
                blk = mix_color(ee, l, late * 0.9) * tone
                blk *= (1 + 0.06 * (saw - 0.5))[..., None]
                blk *= (1 + 0.12 * fbm((hh, ww), hh * 0.25, rng, 3))[..., None]
                # weathered/dirty rim
                yy, xx = np.mgrid[0:hh, 0:ww]
                dist_edge = np.minimum.reduce([xx, yy, ww - 1 - xx, hh - 1 - yy]).astype(float)
                rim = 1 - smoothstep(0, max(hh, ww) * rng.uniform(0.03, 0.09), dist_edge + 3 * fbm((hh, ww), 4, rng, 2))
                pc = p * 0.9
                blk = blk * (1 - 0.7 * rim[..., None]) + pc * 0.7 * rim[..., None]
                blk *= (1 - 0.9 * cracks)[..., None]
                ht = -0.3 * late - 2.5 * cracks + 0.15 * saw + 1.5 * smoothstep(0, 6, dist_edge)
                ht += rng.uniform(-0.3, 0.3)
                sy0, sx0 = y0 - y, x0 - x
                img[y0:y1, x0:x1] = blk[sy0 : sy0 + (y1 - y0), sx0 : sx0 + (x1 - x0)]
                height[y0:y1, x0:x1] = ht[sy0 : sy0 + (y1 - y0), sx0 : sx0 + (x1 - x0)]
            x += bw
        y += rh
    img = light(img, height, strength=3.5, light_dir=(-0.5, -0.6, 0.62), ambient=0.45)
    # cast shadow into gaps
    shadow = gaussian_filter((height > -1.5).astype(float), 6)
    shadow = np.roll(np.roll(shadow, 5, 0), 5, 1)
    img *= (0.35 + 0.65 * np.maximum(shadow, (height > -1.5)))[..., None]
    yy, _ = np.mgrid[0:H, 0:W]
    img = camera(img * 1.12, rng, vignette=0.55, grain=0.02, warm=0.04, contrast=1.12, falloff=0.45)
    save(img, name)


# ---- 2. beams side view (stacked horizontally)
def scene_beams(W, H, seed, pal="oak", name="beams.jpg", weather=0.1, nails=3, rows=None, patina=0.35, adze=True):
    rng = np.random.default_rng(seed)
    rows = rows or [int(H * rng.uniform(0.26, 0.36)) for _ in range(6)]
    img = np.zeros((H, W, 3)) + col("#0e0907")
    height = np.zeros((H, W)) - 2
    pos = -int(rng.uniform(0.05, 0.15) * H)
    for bh in rows:
        if pos >= H:
            break
        tex, ht = board_texture(bh, W, rng, pal=pal, ring_freq=rng.uniform(9, 16), knots=int(rng.integers(0, 3)), weather=weather, cracks=int(rng.integers(1, 4)), nails=nails, patina=patina)
        if False and adze:
            u = np.linspace(0, W / 140, W) + 0.3 * fbm((1, W), 60, rng, 2)[0]
            sc = (0.5 + 0.5 * np.sin(u * 2 * math.pi + 0.8 * fbm((1, W), 30, rng, 2)[0])) ** 3
            ht += 0.25 * sc[None, :] * (0.6 + 0.4 * fbm((bh, W), bh * 0.3, rng, 2))
        prof = np.linspace(0, 1, bh)
        edge = smoothstep(0, 0.06, prof) * smoothstep(0, 0.05, 1 - prof)
        ht += 2.0 * edge[:, None]
        tex = tex * (0.35 + 0.65 * edge[:, None, None]) * rng.uniform(0.85, 1.1)
        y0, y1 = max(pos, 0), min(pos + bh, H)
        if y1 > y0:
            img[y0:y1] = tex[y0 - pos : y1 - pos]
            height[y0:y1] = ht[y0 - pos : y1 - pos]
        pos += bh + int(rng.uniform(5, 14))
    img = light(img, height, strength=4, light_dir=(-0.7, -0.45, 0.5), ambient=0.42)
    img = camera(img * 1.15, rng, vignette=0.5, grain=0.018, warm=0.035, contrast=1.1, falloff=0.4)
    save(img, name)


# ---- 3. floorboards in perspective
def scene_floor(W, H, seed, pal="pine", name="floor.jpg", patina=0.4, weather=0.0):
    rng = np.random.default_rng(seed)
    FW, FH = int(W * 1.6), int(H * 1.9)
    rows = [int(rng.uniform(0.085, 0.11) * FW) for _ in range(20)]
    img, height = compose_boards(FH, FW, rng, rows, pal=pal, gap=3, vertical=True, ring_freq=14, knots=1, weather=weather, cracks=1, nails=0, patina=patina)
    # board butt joints
    for x in range(0, FW, 1):
        pass
    img = light(img, height, strength=3, light_dir=(-0.2, -0.8, 0.55), ambient=0.5)
    # worn polish sheen along traffic path
    sheen = np.exp(-((np.linspace(-1, 1, FW) - 0.1) / 0.45) ** 2)[None, :] * np.linspace(0.3, 1, FH)[:, None]
    img = img * (1 + 0.18 * sheen[..., None])
    pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    # perspective: top narrow
    def coeffs(pa, pb):
        A = []
        for p1, p2 in zip(pa, pb):
            A.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
            A.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])
        A = np.array(A, float)
        B = np.array(pb).reshape(8)
        return np.linalg.solve(A, B)
    dst = [(0, 0), (W, 0), (W, H), (0, H)]
    src = [(FW * 0.22, 0), (FW * 0.78, 0), (FW * 1.0, FH), (FW * 0.0, FH)]
    c = coeffs(dst, src)
    out = pil.transform((W, H), Image.PERSPECTIVE, c, Image.BICUBIC)
    arr = np.asarray(out).astype(float) / 255
    yy = np.linspace(1, 0, H)[:, None] * np.ones((1, W))
    dof = smoothstep(0.55, 1.0, yy)
    arr = camera(arr * 1.08, rng, vignette=0.5, grain=0.016, dof=(dof, 5), warm=0.04, contrast=1.08, light_dir=(0, -0.6), falloff=0.3)
    save(arr, name)


# ---- 4. tabique laths with lime mortar
def scene_laths(W, H, seed, name="laths.jpg"):
    rng = np.random.default_rng(seed)
    mortar = col("#d9d0bf")
    img = np.zeros((H, W, 3)) + mortar
    m = fbm((H, W), 18, rng, 4)
    img *= (0.82 + 0.1 * m)[..., None]
    img *= (1 - 0.25 * (noise((H, W), 1.2, rng) > 1.6))[..., None]
    height = 0.6 * m + 0.5 * noise((H, W), 1.5, rng)
    x = -10
    while x < W:
        lw = int(rng.uniform(0.035, 0.06) * W)
        tex, ht = board_texture(lw, H, rng, pal=rng.choice(["pine", "chestnut"]), ring_freq=rng.uniform(20, 40), knots=0, weather=0.25, cracks=1, straight=rng.random() < 0.5, patina=0.5)
        tex = np.transpose(tex, (1, 0, 2))
        ht = ht.T
        # irregular edges
        edge_noise = fbm((H, 1), 20, rng, 2)[:, 0] * 3
        xs = np.arange(lw)[None, :]
        mask = (xs > 1 + edge_noise[:, None]) & (xs < lw - 2 + edge_noise[:, None] * 0.7)
        x0, x1 = max(x, 0), min(x + lw, W)
        if x1 > x0:
            sl = slice(x0 - x, x1 - x)
            mk = mask[:, sl]
            # mortar residue on wood
            res = (fbm((H, x1 - x0), 5, rng, 3) > 1.1)
            t = tex[:, sl] * (1 - 0.0)
            t = np.where(res[..., None], mortar * 0.9, t)
            img[:, x0:x1] = np.where(mk[..., None], t, img[:, x0:x1] * 0.55)
            height[:, x0:x1] = np.where(mk, ht[:, sl] + 2.5, height[:, x0:x1] - 1)
        x += lw + int(rng.uniform(0.01, 0.025) * W)
    img = light(img, height, strength=3, light_dir=(-0.75, -0.3, 0.55), ambient=0.45)
    img = camera(img * 1.05, rng, vignette=0.5, grain=0.018, warm=0.03, contrast=1.1, falloff=0.35)
    save(img, name)


# ---- 5. painted panel door with peeling paint
def scene_door(W, H, seed, paint="#4f5f52", name="door.jpg", zoom=1.0):
    rng = np.random.default_rng(seed)
    wood, wh = board_texture(W, H, rng, pal="pine", ring_freq=18, knots=1, weather=0.3, cracks=3, patina=0.3)
    wood = np.transpose(wood, (1, 0, 2))
    wh = wh.T
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    # panel geometry (in image units, zoom crops into the door)
    u, v = xx / W, yy / H
    panels = [(0.12, 0.08, 0.46, 0.44), (0.54, 0.08, 0.88, 0.44), (0.12, 0.52, 0.46, 0.92), (0.54, 0.52, 0.88, 0.92)]
    if zoom != 1.0:
        u = 0.1 + u / zoom
        v = 0.05 + v / zoom
    geo = np.zeros((H, W))
    for (a, b, c, d) in panels:
        du = np.minimum(u - a, c - u)
        dv = np.minimum(v - b, d - v)
        dd = np.minimum(du, dv * H / W)
        inside = dd > 0
        bevel = smoothstep(0, 0.04, dd)
        geo = np.where(inside, -1.5 + 0.9 * (1 - bevel) * 0 - 1.5 * bevel, geo)
        geo += inside * 0  # placeholder for clarity
    moulding = np.zeros((H, W))
    for (a, b, c, d) in panels:
        du = np.minimum(u - a, c - u)
        dv = np.minimum(v - b, d - v)
        dd = np.minimum(du, dv * H / W)
        moulding += np.exp(-((dd + 0.004) / 0.004) ** 2)
    geo = gaussian_filter(geo, 2) * 6 + moulding * 3
    pc = col(paint)
    pn = fbm((H, W), 22, rng, 5) + 0.5 * fbm((H, W), 90, rng, 2)
    peel = pn > rng.uniform(0.75, 0.95)
    peel_edge = gaussian_filter(peel.astype(float), 1.2)
    paint_layer = pc[None, None, :] * (1 + 0.08 * fbm((H, W), 8, rng, 3))[..., None]
    # older paint layer under (ox-blood / cream) visible at some edges
    under = col(rng.choice(["#8a3b2a", "#d8cdb4", "#6b7a8a"]))
    under_mask = (pn > rng.uniform(0.55, 0.65)) & ~peel
    img = np.where(peel[..., None], wood * 0.72, np.where(under_mask[..., None], under * 0.9, paint_layer))
    # crackle
    crack = (np.abs(noise((H, W), 2.5, rng)) < 0.05) & ~peel
    img *= (1 - 0.35 * crack)[..., None]
    img *= (1 - 0.35 * (peel_edge * (1 - peel_edge) * 4))[..., None]
    height = geo + np.where(peel, wh - 0.4, 0.2) + 0.3 * peel_edge
    img = light(img, height, strength=2.5, light_dir=(-0.7, -0.5, 0.5), ambient=0.42)
    img = camera(img * 1.1, rng, vignette=0.45, grain=0.018, warm=0.03, contrast=1.08, falloff=0.35)
    save(img, name)


# ---- 6. stacked planks, side on
def scene_stack(W, H, seed, pal="pine", name="stack.jpg", weather=0.2):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3)) + col("#0f0a07")
    height = np.zeros((H, W)) - 2
    y = -5
    while y < H:
        th = int(rng.uniform(0.045, 0.1) * H)
        xoff = int(rng.uniform(-0.08, 0.1) * W)
        tex, ht = board_texture(th, W, rng, pal=pal, ring_freq=rng.uniform(25, 45), knots=0, weather=weather * rng.uniform(0.3, 1.5), cracks=int(rng.integers(0, 2)), straight=True, patina=rng.uniform(0.2, 0.6))
        prof = np.linspace(0, 1, th)
        edge = smoothstep(0, 0.12, prof) * smoothstep(0, 0.12, 1 - prof)
        ht += 1.5 * edge[:, None]
        tex = tex * (0.45 + 0.55 * edge[:, None, None]) * rng.uniform(0.8, 1.12)
        # plank end (left edge) visible when offset
        xs = np.arange(W)
        present = xs >= 0
        y0, y1 = max(y, 0), min(y + th, H)
        if y1 > y0:
            seg = slice(y0 - y, y1 - y)
            m = present[None, :] & np.ones((y1 - y0, 1), bool)
            img[y0:y1] = np.where(m[..., None], tex[seg], img[y0:y1])
            height[y0:y1] = np.where(m, ht[seg], height[y0:y1])
        y += th + int(rng.uniform(2, 9))
    img = light(img, height, strength=3.5, light_dir=(-0.6, -0.6, 0.52), ambient=0.42)
    xx = np.linspace(0, 1, W)[None, :] * np.ones((H, 1))
    dof = smoothstep(0.6, 1.0, xx)
    img = camera(img * 1.15, rng, vignette=0.5, grain=0.018, dof=(dof, 4), warm=0.035, contrast=1.1, falloff=0.4)
    save(img, name)


# ---- 7. industrial timber with bolts and rust streaks
def scene_industrial(W, H, seed, name="industrial.jpg"):
    rng = np.random.default_rng(seed)
    rows = [int(H * rng.uniform(0.38, 0.48)) for _ in range(4)]
    img = np.zeros((H, W, 3)) + col("#0c0806")
    height = np.zeros((H, W)) - 2
    pos = -int(H * 0.12)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    for bh in rows:
        if pos >= H:
            break
        tex, ht = board_texture(bh, W, rng, pal="dark", ring_freq=10, knots=1, weather=0.35, cracks=4, nails=0, patina=0.6)
        prof = np.linspace(0, 1, bh)
        edge = smoothstep(0, 0.05, prof) * smoothstep(0, 0.05, 1 - prof)
        ht += 2 * edge[:, None]
        tex *= (0.35 + 0.65 * edge[:, None, None])
        y0, y1 = max(pos, 0), min(pos + bh, H)
        if y1 > y0:
            img[y0:y1] = tex[y0 - pos : y1 - pos]
            height[y0:y1] = ht[y0 - pos : y1 - pos]
            # bolts
            for bx in np.arange(rng.uniform(0.08, 0.2), 1, rng.uniform(0.25, 0.4)):
                cx, cy = bx * W, pos + bh * 0.5
                d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
                R = H * 0.035
                washer = (d < R * 1.6)
                head = d < R
                streak = np.exp(-((xx - cx) / (R * 0.9)) ** 2) * (yy > cy) * np.exp(-(yy - cy) / (bh * 0.8)) * (0.6 + 0.4 * noise((H, W), (8, 1.5), rng))
                rust = col("#7a3d18")
                img = img * (1 - 0.5 * np.clip(streak, 0, 1)[..., None]) + rust * 0.5 * np.clip(streak, 0, 1)[..., None]
                metal = col("#4a3a30") * (1 + 0.3 * fbm((H, W), 3, rng, 2))[..., None]
                img = np.where(washer[..., None], metal * 0.8, img)
                img = np.where(head[..., None], metal * 1.1, img)
                height = np.where(washer, height + 1.5 + np.where(head, 1.5 * np.sqrt(np.clip(1 - (d / R) ** 2, 0, 1)), 0), height)
        pos += bh + int(rng.uniform(6, 12))
    img = light(img, height, strength=3.5, light_dir=(-0.6, -0.55, 0.55), ambient=0.4)
    img = camera(img * 1.3, rng, vignette=0.5, grain=0.02, warm=0.03, contrast=1.1, falloff=0.4)
    save(img, name)


if __name__ == "__main__":
    which = sys.argv[2] if len(sys.argv) > 2 else "all"
    W, H = 1500, 1100
    jobs = {
        "hero": lambda: scene_endgrain(2400, 1400, 11, pal="pine", name="hero-endgrain.jpg"),
        "pombaline": lambda: (
            scene_beams(W, H, 21, pal="pitch", name="pombaline-beams.jpg", weather=0.1, nails=4, patina=0.45),
            scene_beams(W, H, 22, pal="pitch", name="pombaline-detail.jpg", weather=0.05, nails=2, rows=[int(H * 1.2)], patina=0.35),
            scene_endgrain(W, H, 23, pal="pitch", name="pombaline-end.jpg"),
        ),
        "alfama": lambda: (
            scene_floor(W, H, 31, pal="pine", name="alfama-floor.jpg", patina=0.45),
            scene_laths(W, H, 32, name="alfama-laths.jpg"),
            scene_beams(W, H, 33, pal="chestnut", name="alfama-detail.jpg", weather=0.05, nails=3, rows=[int(H * 0.55), int(H * 0.55)], patina=0.4, adze=False),
        ),
        "beato": lambda: (
            scene_beams(W, H, 41, pal="pine", name="beato-beams.jpg", weather=0.25, nails=2, patina=0.25),
            scene_endgrain(W, H, 42, pal="pine", name="beato-end.jpg"),
            scene_beams(W, H, 43, pal="pine", name="beato-detail.jpg", weather=0.3, nails=1, rows=[int(H * 1.2)], patina=0.2, adze=False),
        ),
        "bombarda": lambda: (
            scene_door(W, H, 51, paint="#55665a", name="bombarda-door.jpg"),
            scene_door(W, H, 52, paint="#d9d2c0", name="bombarda-door-detail.jpg", zoom=2.4),
            scene_floor(W, H, 53, pal="oak", name="bombarda-boards.jpg", patina=0.3),
        ),
        "margueira": lambda: (
            scene_industrial(W, H, 61, name="margueira-timber.jpg"),
            scene_beams(W, H, 62, pal="dark", name="margueira-detail.jpg", weather=0.4, nails=5, rows=[int(H * 1.2)], patina=0.5, adze=False),
            scene_endgrain(W, H, 63, pal="chestnut", name="margueira-end.jpg"),
        ),
        "barreiro": lambda: (
            scene_stack(W, H, 71, pal="pine", name="barreiro-stack.jpg", weather=0.4),
            scene_beams(W, H, 72, pal="grey", name="barreiro-boards.jpg", weather=0.7, nails=3, rows=[int(H * 0.2)] * 7, patina=0.15, adze=False),
            scene_stack(W, H, 73, pal="oak", name="barreiro-detail.jpg", weather=0.2),
        ),
        "graca": lambda: (
            scene_beams(W, H, 81, pal="grey", name="graca-rafters.jpg", weather=0.55, nails=3, rows=[int(H * 0.22)] * 6, patina=0.3),
            scene_endgrain(W, H, 82, pal="chestnut", name="graca-end.jpg"),
            scene_beams(W, H, 83, pal="chestnut", name="graca-detail.jpg", weather=0.3, nails=2, rows=[int(H * 1.2)], patina=0.4),
        ),
    }
    for k, fn in jobs.items():
        if which in ("all", k):
            fn()
