"""
Procedural reclaimed-wood imagery for the ReMade prototype.

The sandbox this prototype was built in had no access to photo libraries, so
every image in public/images is rendered here from noise. They are stand-ins:
replace any file in public/images with real photography of the same name and
aspect ratio and the site picks it up with no code changes.

    pip install numpy pillow
    python3 scripts/generate-textures.py
"""

from __future__ import annotations

import os
import numpy as np
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)


# --------------------------------------------------------------------------
# Noise
# --------------------------------------------------------------------------

def _resize(arr: np.ndarray, w: int, h: int) -> np.ndarray:
    img = Image.fromarray(arr.astype(np.float32), mode="F")
    return np.asarray(img.resize((w, h), Image.BICUBIC), dtype=np.float32)


def fbm(rng, h, w, cells_y, cells_x, octaves=5, gain=0.5):
    """Fractal value noise, roughly in [-1, 1]. cells_* sets the base frequency."""
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    cy, cx = cells_y, cells_x
    for _ in range(octaves):
        grid = rng.standard_normal((max(2, int(cy)) + 1, max(2, int(cx)) + 1))
        out += amp * _resize(grid, w, h)
        total += amp
        amp *= gain
        cy *= 2
        cx *= 2
    return out / total


def lerp(a, b, t):
    return a + (b - a) * t


def hex_rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0


# --------------------------------------------------------------------------
# Wood
# --------------------------------------------------------------------------

def wood_field(rng, h, w, ring_freq, light, dark, knots=0, figure=1.0, fiber=0.18):
    """A single piece of flat-sawn timber, grain running along x. Returns HxWx3."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)

    # Large, slow distortion so rings drift and cathedral like real flat-sawn boards
    warp = fbm(rng, h, w, 2, 3, octaves=4) * 55 * figure
    warp += fbm(rng, h, w, 6, 2, octaves=3) * 14
    # Cathedral arches: rings are ellipses whose centre sits off the board
    cy = h * rng.uniform(-0.6, 1.6)
    cx = w * rng.uniform(-0.2, 1.2)
    stretch = rng.uniform(5.5, 9.0)
    r = np.sqrt((y - cy) ** 2 + ((x - cx) / stretch) ** 2) + warp

    for _ in range(knots):
        kx, ky = rng.uniform(0.1, 0.9) * w, rng.uniform(0.15, 0.85) * h
        ks = rng.uniform(10, 26)
        d = np.sqrt(((x - kx) / 2.6) ** 2 + (y - ky) ** 2)
        r += 38 * np.exp(-(d / (ks * 2.2)) ** 2) * rng.choice([-1, 1])

    phase = (r * ring_freq) % 1.0
    # Latewood: a sharp dark band at the end of each ring
    late = np.clip((phase - 0.62) / 0.38, 0, 1) ** 1.6

    # Latewood strength and ring width vary ring to ring
    late_var = 0.55 + 0.45 * np.clip(fbm(rng, h, w, 3, 1.5, octaves=3) * 1.4 + 0.5, 0, 1)
    rings = 0.3 + 0.7 * late * late_var
    # Fibres: very stretched high-frequency noise along the grain
    fib = fbm(rng, h, w, max(8, h // 3), max(3, w // 90), octaves=3, gain=0.55)
    pores = fbm(rng, h, w, max(8, h // 2), max(4, w // 25), octaves=2, gain=0.5)
    tone = fbm(rng, h, w, 2, 3, octaves=3) * 0.12
    t = np.clip(rings * 0.66 + fib * fiber + pores * 0.08 + tone + 0.1, 0, 1)

    col = lerp(light[None, None, :], dark[None, None, :], t[..., None])
    return col, y, x


def add_knot_cores(rng, img, n, scale=1.0):
    h, w, _ = img.shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    for _ in range(n):
        kx, ky = rng.uniform(0.08, 0.92) * w, rng.uniform(0.2, 0.8) * h
        rx, ry = rng.uniform(9, 20) * scale, rng.uniform(6, 13) * scale
        d = np.sqrt(((x - kx) / rx) ** 2 + ((y - ky) / ry) ** 2)
        core = np.clip(1.2 - d, 0, 1) ** 0.8
        ring = np.exp(-((d - 1.05) / 0.12) ** 2) * 0.5
        img *= (1 - 0.62 * core - 0.25 * ring)[..., None]
    return img


def add_checks(rng, img, n, max_len=0.5, darkness=0.75):
    """Seasoning checks: thin cracks along the grain."""
    h, w, _ = img.shape
    mask = np.zeros((h, w), np.float32)
    for _ in range(n):
        length = int(rng.uniform(0.08, max_len) * w)
        x0 = int(rng.uniform(0, w - length))
        y0 = rng.uniform(0.05, 0.95) * h
        xs = np.arange(x0, x0 + length)
        wob = np.cumsum(rng.normal(0, 0.18, len(xs)))
        ys = y0 + wob
        taper = np.sin(np.linspace(0, np.pi, len(xs))) ** 0.6
        width = rng.uniform(0.8, 2.6)
        for xi, yi, tp in zip(xs, ys, taper):
            yi_int = int(yi)
            wdt = max(1, int(round(width * tp)))
            if 0 <= yi_int < h:
                mask[max(0, yi_int - wdt // 2) : min(h, yi_int + wdt // 2 + 1), xi] = tp
    soft = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255
    img *= (1 - darkness * soft)[..., None]
    # a faint light lip on one side of each crack
    lip = np.roll(soft, 2, axis=0) - soft
    img += np.clip(lip, 0, 1)[..., None] * 0.05
    return img


def add_nail_holes(rng, img, pts, rust=True):
    h, w, _ = img.shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    for (px, py) in pts:
        rr = rng.uniform(3.0, 5.5)
        d = np.sqrt((x - px) ** 2 + (y - py) ** 2)
        hole = np.clip((rr - d) / 1.5, 0, 1)
        img *= (1 - 0.85 * hole)[..., None]
        if rust:
            halo = np.exp(-((d / (rr * 4.5)) ** 2)) * rng.uniform(0.25, 0.5)
            stain = np.array([0.22, 0.12, 0.06], np.float32)
            img[:] = img * (1 - halo[..., None]) + stain * halo[..., None]
    return img


def weather(rng, img, amount, grey=(0.46, 0.44, 0.41)):
    """Silvering + dirt, blotchy."""
    h, w, _ = img.shape
    blot = np.clip(fbm(rng, h, w, 3, 5, octaves=5) * 0.6 + 0.5, 0, 1)
    t = np.clip(amount * (0.55 + 0.6 * blot), 0, 1)[..., None]
    lum = img.mean(axis=2, keepdims=True)
    g = np.array(grey, np.float32) * (0.6 + 0.8 * lum)
    img = lerp(img, g, t)
    dirt = np.clip(fbm(rng, h, w, 8, 10, octaves=4), 0, 1)
    img *= (1 - 0.18 * dirt * amount)[..., None]
    return img


def light(img, angle=0.3, strength=0.35, vignette=0.45, warm=0.03):
    h, w, _ = img.shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    nx, ny = x / w - 0.5, y / h - 0.5
    grad = 1 + strength * (-(nx * np.cos(angle) + ny * np.sin(angle)))
    vig = 1 - vignette * (nx ** 2 + ny ** 2) * 1.6
    img = img * (grad * vig)[..., None]
    img[..., 0] *= 1 + warm
    img[..., 2] *= 1 - warm
    return img


def grain(rng, img, amount=0.018):
    return img + rng.normal(0, amount, img.shape).astype(np.float32)


def save(img, name, q=84):
    arr = (np.clip(img, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)
    Image.fromarray(arr).save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)
    print("wrote", name, arr.shape[1], "x", arr.shape[0])


def board_stack(rng, h, w, widths, palette, ring=(0.035, 0.07), gap=(3, 7), knots=(0, 2),
                bevel=0.12, nails=None, checks=(0, 3), var=0.12):
    """Several boards laid side by side (grain along x), with gaps and edge bevels."""
    img = np.zeros((h, w, 3), np.float32)
    y0 = 0
    edges = []
    i = 0
    while y0 < h:
        bw = int(widths[i % len(widths)] * rng.uniform(0.9, 1.1))
        y1 = min(h, y0 + bw)
        bh = y1 - y0
        light_c, dark_c = palette[rng.integers(len(palette))]
        tone = 1 + rng.uniform(-var, var)
        col, _, _ = wood_field(rng, bh, w, rng.uniform(*ring), hex_rgb(light_c) * tone, hex_rgb(dark_c) * tone,
                               knots=int(rng.integers(knots[0], knots[1] + 1)))
        col = add_knot_cores(rng, col, int(rng.integers(knots[0], knots[1] + 1)))
        col = add_checks(rng, col, int(rng.integers(checks[0], checks[1] + 1)))
        # bevel: lit top edge, shadowed bottom edge
        yy = np.linspace(0, 1, bh, dtype=np.float32)
        prof = 1 + bevel * (np.exp(-yy / 0.03) * 0.8 - np.exp(-(1 - yy) / 0.04))
        col *= prof[:, None, None]
        img[y0:y1] = col
        if nails:
            pts = []
            # nails over joists at a fixed spacing across all boards
            for jx in nails:
                jitter = rng.normal(0, 3)
                pts.append((jx + jitter, y0 + bh * 0.3 + rng.normal(0, 2)))
                pts.append((jx + jitter + rng.normal(0, 2), y0 + bh * 0.72 + rng.normal(0, 2)))
            add_nail_holes(rng, img[y0:y1].view(), [(px, py - y0) for px, py in pts])
        edges.append(y1)
        y0 = y1
        i += 1
    # gaps
    for e in edges[:-1]:
        g = int(rng.uniform(*gap))
        img[max(0, e - g // 2) : min(h, e + (g - g // 2))] *= 0.12
        img[min(h - 1, e + g // 2) : min(h, e + g // 2 + 3)] *= 0.72
    return img


def end_to_end_joints(rng, img, rows_edges, every=(600, 1200)):
    h, w, _ = img.shape
    for (a, b) in rows_edges:
        x = int(rng.uniform(*every) * rng.uniform(0.3, 1))
        while x < w:
            img[a:b, max(0, x - 2) : x + 2] *= 0.2
            x += int(rng.uniform(*every))
    return img


def rotate90(img):
    return np.ascontiguousarray(np.rot90(img))


# --------------------------------------------------------------------------
# Palettes (light, dark)
# --------------------------------------------------------------------------

OAK_OLD = [("#a57e55", "#4a3220"), ("#9a7550", "#3f2b1b"), ("#b08a60", "#553a24")]
PINE_OLD = [("#c9a06a", "#7a4a26"), ("#c29462", "#6d4120"), ("#d0a973", "#81532c")]
PINE_RICH = [("#b27a45", "#5b3014"), ("#a86f3d", "#4e2810"), ("#bb8550", "#62371a")]
DARK_BEAM = [("#6e4d33", "#241810"), ("#77553a", "#2a1c12")]
GREY_BOARD = [("#9c8a72", "#4d3f30"), ("#a39279", "#54463a"), ("#8f7d66", "#40342a")]
CHESTNUT = [("#9b6b44", "#3b2415"), ("#a4744b", "#432a18")]


# --------------------------------------------------------------------------
# Scenes
# --------------------------------------------------------------------------

def beam_closeup(seed, w, h, palette=DARK_BEAM, weathering=0.25, bolt=True, angle=0.5, name="x.jpg"):
    """One massive beam filling the frame, deep checks, bolt holes."""
    rng = np.random.default_rng(seed)
    lc, dc = palette[0]
    col, y, x = wood_field(rng, h, w, 0.034, hex_rgb(lc), hex_rgb(dc), knots=2, figure=1.4, fiber=0.24)
    col = add_knot_cores(rng, col, 2, scale=2.2)
    col = add_checks(rng, col, 7, max_len=0.8, darkness=0.9)
    col = weather(rng, col, weathering)
    # adze / saw marks: faint periodic bands across grain
    marks = 1 + 0.015 * np.sin(x / rng.uniform(40, 60) + fbm(rng, h, w, 3, 3, 3) * 3)
    col *= marks[..., None]
    if bolt:
        pts = [(w * rng.uniform(0.2, 0.35), h * rng.uniform(0.4, 0.6)), (w * rng.uniform(0.7, 0.85), h * rng.uniform(0.35, 0.6))]
        for px, py in pts:
            yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
            d = np.sqrt((xx - px) ** 2 + (yy - py) ** 2)
            rr = h * 0.035
            hole = np.clip((rr - d) / 2, 0, 1)
            halo = np.exp(-((d / (rr * 3.2)) ** 2)) * 0.55
            col = col * (1 - halo[..., None]) + np.array([0.12, 0.07, 0.04], np.float32) * halo[..., None]
            col *= (1 - 0.9 * hole)[..., None]
    col = light(col, angle=angle, strength=0.5, vignette=0.55)
    col = grain(rng, col, 0.015)
    save(col, name)


def floorboards(seed, w, h, palette=PINE_OLD, weathering=0.08, name="x.jpg", vertical=False, joists=True):
    rng = np.random.default_rng(seed)
    W, H = (h, w) if vertical else (w, h)
    nails = list(np.arange(rng.uniform(80, 200), W, rng.uniform(380, 460))) if joists else None
    img = board_stack(rng, H, W, [int(H / 5.2), int(H / 4.6), int(H / 5.6)], palette, ring=(0.04, 0.08),
                      knots=(0, 2), nails=nails, checks=(0, 2))
    img = weather(rng, img, weathering)
    # worn traffic path: lighter, less saturated band
    hh, ww, _ = img.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    wear = np.exp(-(((yy / hh) - 0.55) / 0.28) ** 2) * np.clip(fbm(rng, hh, ww, 2, 4, 3) + 0.6, 0, 1) * 0.12
    img = img * (1 + wear[..., None])
    if vertical:
        img = rotate90(img)
    img = light(img, angle=1.0, strength=0.35, vignette=0.4)
    img = grain(rng, img)
    save(img, name)


def weathered_boards(seed, w, h, name, vertical=True):
    rng = np.random.default_rng(seed)
    W, H = (h, w) if vertical else (w, h)
    img = board_stack(rng, H, W, [int(H / 4.2), int(H / 3.6), int(H / 5.0)], GREY_BOARD, ring=(0.03, 0.06),
                      gap=(5, 11), knots=(1, 2), checks=(2, 5), var=0.16,
                      nails=[W * 0.08, W * 0.5, W * 0.92])
    img = weather(rng, img, 0.55)
    if vertical:
        img = rotate90(img)
    img = light(img, angle=-0.6, strength=0.45, vignette=0.5)
    img = grain(rng, img, 0.022)
    save(img, name)


def timber_stack(seed, w, h, name, palette=OAK_OLD):
    """Ends-on view of stacked sawn sections, seen from the side: layered beams with shadow between."""
    rng = np.random.default_rng(seed)
    img = board_stack(rng, h, w, [int(h / 3.3), int(h / 2.8), int(h / 3.8)], palette, ring=(0.02, 0.04),
                      gap=(14, 26), knots=(1, 3), checks=(3, 6), bevel=0.28, var=0.18)
    img = weather(rng, img, 0.2)
    img = light(img, angle=0.2, strength=0.55, vignette=0.6)
    img = grain(rng, img)
    save(img, name)


def painted_door(seed, w, h, paint="#51604c", under="#d9cdb4", name="x.jpg", chip=0.52):
    """Timber panel door with several layers of old paint, chipped back to the wood."""
    rng = np.random.default_rng(seed)
    # Vertical grain: build horizontally then rotate
    base = board_stack(rng, w, h, [int(w / 3.1)], PINE_RICH, ring=(0.03, 0.06), gap=(2, 4), knots=(0, 1), checks=(1, 3))
    base = rotate90(base)  # now h x w, grain vertical
    hh, ww, _ = base.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)

    # Panel layout (stiles & rails) -> height field for moulding shading
    height = np.ones((hh, ww), np.float32)
    panels = []
    m = ww * 0.16
    cols = [(m, ww / 2 - m * 0.35), (ww / 2 + m * 0.35, ww - m)]
    rows = [(hh * 0.07, hh * 0.40), (hh * 0.47, hh * 0.93)]
    for (x0, x1) in cols:
        for (y0, y1) in rows:
            panels.append((x0, y0, x1, y1))
    shade = np.zeros((hh, ww), np.float32)
    for (x0, y0, x1, y1) in panels:
        inside = (xx > x0) & (xx < x1) & (yy > y0) & (yy < y1)
        height[inside] = 0.0
        # recessed panel: shadow on top/left inner edges, light on bottom/right
        dt = np.minimum.reduce([xx - x0, x1 - xx, yy - y0, y1 - yy])
        edge = inside & (dt < 16)
        tl = inside & (((yy - y0) < 16) | ((xx - x0) < 16))
        br = inside & (((y1 - yy) < 16) | ((x1 - xx) < 16))
        shade[tl & edge] -= 0.35 * (1 - dt[tl & edge] / 16)
        shade[br & edge] += 0.18 * (1 - dt[br & edge] / 16)
        # outer bolection line
        line = (np.abs(dt + 22) < 2.2) & ~inside
        oline = ((xx > x0 - 26) & (xx < x1 + 26) & (yy > y0 - 26) & (yy < y1 + 26)) & ~((xx > x0 - 20) & (xx < x1 + 20) & (yy > y0 - 20) & (yy < y1 + 20))
        shade[oline] -= 0.12
    # paint layers
    n1 = fbm(rng, hh, ww, 7, 5, octaves=6)
    n2 = fbm(rng, hh, ww, 11, 9, octaves=5)
    # paint wears more along the grain -> stretch vertically
    streak = fbm(rng, hh, ww, 3, 60, octaves=3) * 0.35
    top = (n1 + streak) > (chip - 0.9)
    mid = (n2 + streak * 0.5) > (chip - 1.05)
    pcol = hex_rgb(paint)
    ucol = hex_rgb(under)
    ptex = 1 + fbm(rng, hh, ww, 40, 40, octaves=3) * 0.05 + fbm(rng, hh, ww, 4, 120, octaves=2) * 0.04
    img = base.copy()
    img[mid] = (ucol * ptex[..., None])[mid]
    img[top] = (pcol * ptex[..., None])[top]
    # chip edges: dark rim where top paint ends
    topf = top.astype(np.float32)
    blur = np.asarray(Image.fromarray((topf * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6)), np.float32) / 255
    rim = np.clip(np.abs(blur - topf) * 2.2, 0, 1)
    img *= (1 - 0.35 * rim)[..., None]
    # crazing cracks in paint
    craz = fbm(rng, hh, ww, 70, 10, octaves=2)
    img *= (1 - 0.18 * (np.abs(craz) < 0.03) * topf)[..., None]
    img *= (1 + shade)[..., None]
    img = weather(rng, img, 0.12)
    # an old iron key plate
    kx, ky = ww * 0.9, hh * 0.52
    plate = (np.abs(xx - kx) < ww * 0.022) & (np.abs(yy - ky) < hh * 0.06)
    img[plate] = np.array([0.16, 0.14, 0.12]) * (1 + 0.15 * n2[plate][..., None])
    key = ((xx - kx) ** 2 + (yy - ky + hh * 0.015) ** 2 < (ww * 0.009) ** 2) | ((np.abs(xx - kx) < ww * 0.004) & (yy > ky - hh * 0.015) & (yy < ky + hh * 0.02))
    img[key] = 0.03
    img = light(img, angle=0.9, strength=0.4, vignette=0.5)
    img = grain(rng, img)
    save(img, name)


def herringbone(seed, w, h, name):
    """Parquet in a herringbone pattern — classic in Lisbon 'Gaioleiro' era apartments."""
    rng = np.random.default_rng(seed)
    bw, bl = 70, 350  # block width / length in px
    tile = np.zeros((h, w, 3), np.float32)
    # pre-render a pool of blocks
    pool = []
    for i in range(16):
        lc, dc = PINE_RICH[i % len(PINE_RICH)] if i % 3 else CHESTNUT[i % 2]
        tone = 1 + rng.uniform(-0.14, 0.14)
        c, _, _ = wood_field(rng, bw, bl, rng.uniform(0.05, 0.09), hex_rgb(lc) * tone, hex_rgb(dc) * tone, knots=0)
        yy = np.linspace(0, 1, bw, dtype=np.float32)
        c *= (1 + 0.12 * (np.exp(-yy / 0.05) * 0.6 - np.exp(-(1 - yy) / 0.06)))[:, None, None]
        c[:, :3] *= 0.3
        c[:, -3:] *= 0.3
        c[:2] *= 0.25
        c[-2:] *= 0.25
        pool.append(c)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # rotate coordinates by 45 degrees; herringbone in rotated space
    s2 = np.sqrt(2) / 2
    u = (xx + yy) * s2
    v = (yy - xx) * s2 + 3000
    # each herringbone "row" alternates horizontal/vertical blocks
    step = bw
    iu = np.floor(u / step).astype(int)
    iv = np.floor(v / step).astype(int)
    k = (iu + iv) % (2 * (bl // bw))
    horiz = ((iu - iv) // (bl // bw)) % 2 == 0
    # local coords inside block
    lu = np.where(horiz, (u - (np.floor((u - iv * step) / bl) * bl + iv * step)) % bl, (v - (np.floor((v - iu * step) / bl) * bl + iu * step)) % bl)
    lv = np.where(horiz, v % step, u % step)
    bid = np.where(horiz, np.floor((u - iv * step) / bl) + iv * 7, np.floor((v - iu * step) / bl) + iu * 5).astype(int) % len(pool)
    out = np.zeros((h, w, 3), np.float32)
    lu_i = np.clip(lu.astype(int), 0, bl - 1)
    lv_i = np.clip(lv.astype(int), 0, bw - 1)
    for b in range(len(pool)):
        sel = bid == b
        out[sel] = pool[b][lv_i[sel], lu_i[sel]]
    out = weather(rng, out, 0.1)
    out = light(out, angle=0.7, strength=0.4, vignette=0.55)
    out = grain(rng, out)
    save(out, name)


if __name__ == "__main__":
    W, H = 1600, 1100
    # Hero & editorial
    beam_closeup(11, 2400, 1400, DARK_BEAM, 0.18, name="hero-beam.jpg", angle=0.4)
    timber_stack(12, 1600, 2000, "editorial-stack.jpg", OAK_OLD)
    weathered_boards(13, 1600, 1100, "editorial-boards.jpg", vertical=False)

    # RM-LX-001 — beams
    beam_closeup(101, W, H, OAK_OLD, 0.3, name="rm-lx-001-a.jpg")
    beam_closeup(102, W, H, DARK_BEAM, 0.35, name="rm-lx-001-b.jpg", angle=-0.4)
    timber_stack(103, W, H, "rm-lx-001-c.jpg", OAK_OLD)

    # RM-LX-002 — Pombaline floorboards
    floorboards(201, W, H, PINE_OLD, 0.06, name="rm-lx-002-a.jpg")
    floorboards(202, W, H, PINE_RICH, 0.05, name="rm-lx-002-b.jpg", vertical=True)
    herringbone(203, W, H, "rm-lx-002-c.jpg")

    # RM-LX-003 — warehouse boards
    weathered_boards(301, W, H, "rm-lx-003-a.jpg", vertical=False)
    weathered_boards(302, W, H, "rm-lx-003-b.jpg", vertical=True)
    floorboards(303, W, H, GREY_BOARD, 0.4, name="rm-lx-003-c.jpg", joists=False)

    # RM-LX-004 — structural timber, Alcântara factory
    timber_stack(401, W, H, "rm-lx-004-a.jpg", PINE_RICH)
    beam_closeup(402, W, H, PINE_RICH, 0.28, name="rm-lx-004-b.jpg", bolt=False)
    timber_stack(403, W, H, "rm-lx-004-c.jpg", DARK_BEAM)

    # RM-LX-005 — doors, Doca de Alcântara
    painted_door(501, 1100, 1600, paint="#4e5d50", under="#cfc2a6", name="rm-lx-005-a.jpg")
    painted_door(502, 1100, 1600, paint="#8a4a33", under="#d8ccb2", name="rm-lx-005-b.jpg", chip=0.6)
    painted_door(503, 1100, 1600, paint="#d6ccb8", under="#58644f", name="rm-lx-005-c.jpg", chip=0.45)

    # RM-LX-006 — joinery / shelving, Fábrica de Pão
    floorboards(601, W, H, CHESTNUT, 0.1, name="rm-lx-006-a.jpg", joists=False)
    timber_stack(602, W, H, "rm-lx-006-b.jpg", CHESTNUT)
    weathered_boards(603, W, H, "rm-lx-006-c.jpg", vertical=True)
