"""Procedural remote-sensing scene generator.

Builds a land-cover label map plus auxiliary continuous fields, then renders
(a) a Sentinel-2-like true-colour optical composite and
(b) a Sentinel-1-like SAR amplitude image using per-class backscatter
    coefficients with multiplicative speckle.

Synthetic imagery, for interface demonstration only.
"""
import cv2
import numpy as np
from PIL import Image, ImageDraw

# ---------------------------------------------------------------- land cover
WATER, CROP, FOREST, BARE, URBAN_L, URBAN_H, ROAD, SHRUB = range(8)


def fbm(h, w, rng, octaves=6, base=3, persistence=0.55):
    total = np.zeros((h, w), np.float32)
    amp, norm, freq = 1.0, 0.0, base
    for _ in range(octaves):
        g = rng.random((freq + 1, freq + 1)).astype(np.float32)
        layer = np.asarray(Image.fromarray(g, mode="F").resize((w, h), Image.BICUBIC))
        total += layer * amp
        norm += amp
        amp *= persistence
        freq = min(freq * 2, 512)
    out = total / norm
    lo, hi = out.min(), out.max()
    return (out - lo) / (hi - lo + 1e-6)


def warp(field, rng, amount=18):
    """Domain-warp a field so shapes stop looking machine made."""
    h, w = field.shape
    dx = (fbm(h, w, rng, octaves=4, base=3) - 0.5) * 2 * amount
    dy = (fbm(h, w, rng, octaves=4, base=3) - 0.5) * 2 * amount
    yy, xx = np.mgrid[0:h, 0:w]
    sx = np.clip((xx + dx).astype(np.int32), 0, w - 1)
    sy = np.clip((yy + dy).astype(np.int32), 0, h - 1)
    return field[sy, sx]


def blur(a, r):
    return cv2.GaussianBlur(a.astype(np.float32), (0, 0), max(float(r), 0.1))


def mask_from_draw(h, w, fn):
    img = Image.new("L", (w, h), 0)
    fn(ImageDraw.Draw(img))
    return np.asarray(img).astype(np.float32) / 255.0


class Scene:
    """A synthetic geographic scene: labels plus continuous auxiliary fields."""

    def __init__(self, w, h, seed):
        self.w, self.h = w, h
        self.rng = np.random.default_rng(seed)
        r = self.rng
        self.elev = fbm(h, w, r, octaves=6, base=3)
        self.moist = fbm(h, w, r, octaves=5, base=4)
        self.texture = fbm(h, w, r, octaves=7, base=8)
        self.labels = np.full((h, w), CROP, np.uint8)
        self.vigor = 0.35 + 0.5 * fbm(h, w, r, octaves=4, base=6)
        self.bright = np.zeros((h, w), np.float32)
        self.depth = np.zeros((h, w), np.float32)
        self.height = np.zeros((h, w), np.float32)

    # ------------------------------------------------------------- features
    def base_landscape(self, forest_bias=0.35, bare_bias=0.2):
        e = self.elev
        m = warp(self.moist, self.rng, 24)
        self.labels[:] = CROP
        self.labels[m < bare_bias] = BARE
        self.labels[(m > 1 - forest_bias) & (e > 0.42)] = FOREST
        self.labels[(m > 0.5) & (m < 0.62) & (e < 0.45)] = SHRUB
        # break up the untended background so it never reads as one flat class
        patch = warp(fbm(self.h, self.w, self.rng, octaves=5, base=5), self.rng, 20)
        wild = self.labels == CROP
        self.labels[wild & (patch > 0.66)] = SHRUB
        self.labels[wild & (patch < 0.22)] = BARE
        self.vigor = np.clip(self.vigor * 0.7 + patch * 0.45, 0.05, 1.0)

    def river(self, pts, width, wobble=True):
        m = mask_from_draw(self.h, self.w,
                           lambda d: d.line(pts, fill=255, width=width, joint="curve"))
        if wobble:
            m = warp(m, self.rng, max(6, width // 3))
        m = blur(m, width * 0.16)
        wet = m > 0.42
        bank = (m > 0.18) & (m <= 0.42)
        self.labels[bank] = SHRUB
        self.labels[wet] = WATER
        self.depth[wet] = np.clip(m[wet] * 1.25, 0, 1)
        return wet

    def lake(self, cx, cy, rx, ry, irregular=28):
        m = mask_from_draw(self.h, self.w,
                           lambda d: d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255))
        m = warp(m, self.rng, irregular)
        m = blur(m, 4)
        wet = m > 0.5
        self.labels[wet] = WATER
        self.depth[wet] = np.clip(m[wet], 0, 1)
        return wet

    def fields(self, box, n=26, angle=None):
        """Agricultural parcels: rotated quads, each with its own crop vigour."""
        x0, y0, x1, y1 = box
        rng = self.rng
        ang = rng.uniform(-0.5, 0.5) if angle is None else angle
        ca, sa = np.cos(ang), np.sin(ang)
        step = max(26, int((x1 - x0) / max(n, 1)))
        img = Image.new("I", (self.w, self.h), 0)
        d = ImageDraw.Draw(img)
        idx = 1
        span = int(np.hypot(x1 - x0, y1 - y0))
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        for u in range(-span // 2, span // 2, step):
            for v in range(-span // 2, span // 2, int(step * rng.uniform(0.7, 1.6))):
                w2 = step * rng.uniform(0.42, 0.5)
                h2 = step * rng.uniform(0.4, 0.9)
                corners = []
                for ox, oy in ((-w2, -h2), (w2, -h2), (w2, h2), (-w2, h2)):
                    px = u + ox + rng.uniform(-3, 3)
                    py = v + oy + rng.uniform(-3, 3)
                    corners.append((cx + px * ca - py * sa, cy + px * sa + py * ca))
                d.polygon(corners, fill=idx)
                idx += 1
        parcels = np.asarray(img)
        inside = np.zeros((self.h, self.w), bool)
        inside[y0:y1, x0:x1] = True
        sel = (parcels > 0) & inside & (self.labels != WATER)
        vals = self.rng.random(idx + 1).astype(np.float32)
        pv = vals[np.clip(parcels, 0, idx)]
        self.vigor[sel] = (0.15 + 0.85 * pv[sel]) * (0.85 + 0.3 * self.texture[sel])
        self.labels[sel] = np.where(pv[sel] < 0.16, BARE, CROP)

    def road_grid(self, box, spacing=78, angle=0.0, width=3):
        x0, y0, x1, y1 = box
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        ca, sa = np.cos(angle), np.sin(angle)
        span = int(np.hypot(x1 - x0, y1 - y0))

        def draw(d):
            for u in range(-span, span, spacing):
                for (ax, ay, bx, by) in ((u, -span, u, span), (-span, u, span, u)):
                    p = [(cx + x * ca - y * sa, cy + x * sa + y * ca)
                         for x, y in ((ax, ay), (bx, by))]
                    d.line(p, fill=255, width=width)

        m = mask_from_draw(self.h, self.w, draw)
        inside = np.zeros((self.h, self.w), bool)
        inside[y0:y1, x0:x1] = True
        sel = (m > 0.4) & inside & (self.labels != WATER)
        self.labels[sel] = ROAD
        return sel

    def urban(self, box, density=0.62, spacing=78, angle=0.0, high=0.3, seed_shift=0):
        """Built-up blocks between roads, each structure with albedo and height."""
        x0, y0, x1, y1 = box
        rng = np.random.default_rng(int(self.rng.integers(10 ** 9)) + seed_shift)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        ca, sa = np.cos(angle), np.sin(angle)
        span = int(np.hypot(x1 - x0, y1 - y0))
        bimg = Image.new("F", (self.w, self.h), 0.0)
        himg = Image.new("F", (self.w, self.h), 0.0)
        bd, hd = ImageDraw.Draw(bimg), ImageDraw.Draw(himg)
        pad = 7
        for u in range(-span, span, spacing):
            for v in range(-span, span, spacing):
                if rng.random() > density:
                    continue
                inner = spacing - pad * 2
                nb = int(rng.integers(3, 6))
                cell = max(4, inner // nb)
                for i in range(nb):
                    for j in range(nb):
                        if rng.random() > 0.72:
                            continue
                        bx = u + pad + i * cell + rng.uniform(0, 3)
                        by = v + pad + j * cell + rng.uniform(0, 3)
                        bw = cell * rng.uniform(0.55, 0.94)
                        bh = cell * rng.uniform(0.55, 0.94)
                        pts = []
                        for ox, oy in ((0, 0), (bw, 0), (bw, bh), (0, bh)):
                            px, py = bx + ox, by + oy
                            pts.append((cx + px * ca - py * sa, cy + px * sa + py * ca))
                        bd.polygon(pts, fill=float(rng.uniform(0.35, 1.0)))
                        hd.polygon(pts, fill=float(rng.uniform(0.2, 1.0)))
        b = np.asarray(bimg)
        hh = np.asarray(himg)
        inside = np.zeros((self.h, self.w), bool)
        inside[y0:y1, x0:x1] = True
        sel = (b > 0.01) & inside & (self.labels != WATER) & (self.labels != ROAD)
        self.bright[sel] = b[sel]
        self.height[sel] = hh[sel]
        self.labels[sel] = np.where(hh[sel] > 1 - high, URBAN_H, URBAN_L)
        return sel
