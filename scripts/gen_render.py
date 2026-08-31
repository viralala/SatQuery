"""Optical and SAR renderers for the synthetic scenes."""
import cv2
import numpy as np
from PIL import Image

from gen_core import (WATER, CROP, FOREST, BARE, URBAN_L, URBAN_H, ROAD, SHRUB,
                      fbm, blur)

GAMMA = 1.9

# Sentinel-2 TCI-like endpoints, given as 8-bit sRGB (dark -> bright) so the
# palette can be reasoned about in the values it will actually display at.
OPTICAL_SRGB = {
    WATER:   ((16, 27, 38), (44, 63, 78)),
    CROP:    ((44, 56, 32), (116, 134, 70)),
    FOREST:  ((22, 36, 25), (50, 68, 43)),
    BARE:    ((88, 79, 63), (162, 143, 114)),
    SHRUB:   ((58, 63, 44), (106, 106, 75)),
    ROAD:    ((66, 65, 63), (112, 109, 105)),
    URBAN_L: ((74, 73, 70), (152, 147, 140)),
    URBAN_H: ((104, 103, 100), (208, 204, 197)),
}
# de-gamma into the working space the renderer composites in
OPTICAL = {k: (tuple((c / 255.0) ** GAMMA for c in lo),
               tuple((c / 255.0) ** GAMMA for c in hi))
           for k, (lo, hi) in OPTICAL_SRGB.items()}

# Sentinel-1-ish VV backscatter, sigma-nought in dB
SIGMA0 = {
    WATER: -22.0, ROAD: -17.0, BARE: -13.5, CROP: -10.5,
    SHRUB: -9.5, FOREST: -7.5, URBAN_L: -4.5, URBAN_H: -1.0,
}


def _mix(lo, hi, t):
    t = t[..., None]
    return np.array(lo) * (1 - t) + np.array(hi) * t


def render_optical(sc, haze=0.020, grain=0.010, sun=0.5, vignette=0.14):
    """Composite each land-cover class between its dark and bright endpoint."""
    h, w = sc.h, sc.w
    rgb = np.zeros((h, w, 3), np.float32)
    tex = sc.texture
    # broad tonal drift so no class ever renders as one flat colour
    drift = fbm(h, w, sc.rng, octaves=5, base=5)
    for cls, (lo, hi) in OPTICAL.items():
        m = sc.labels == cls
        if not m.any():
            continue
        if cls == CROP:
            t = np.clip(sc.vigor * 0.82 + drift * 0.22, 0, 1)
        elif cls in (URBAN_L, URBAN_H):
            t = np.clip(sc.bright * 0.88 + tex * 0.14, 0, 1)
        elif cls == WATER:
            t = np.clip(0.22 + (1.0 - sc.depth) * 0.48 + tex * 0.16, 0, 1)
        else:
            t = np.clip(0.18 + 0.62 * tex + 0.28 * drift, 0, 1)
        rgb[m] = _mix(lo, hi, t)[m]

    # two octaves of micro-texture: field/canopy grain plus sensor-scale detail
    natural = (~np.isin(sc.labels, [WATER])).astype(np.float32)
    fine = (fbm(h, w, sc.rng, octaves=8, base=max(24, w // 44)) - 0.5) * 0.20
    ultra = (fbm(h, w, sc.rng, octaves=4, base=max(90, w // 7)) - 0.5) * 0.15
    rgb *= (1.0 + ((fine + ultra) * natural + fine * 0.18)[..., None])

    # terrain shading, illuminated from the upper left
    gy, gx = np.gradient(blur(sc.elev, 3) * 40.0)
    shade = np.clip(1.0 + (-gx - gy) * 0.6 * sun, 0.66, 1.34)
    rgb *= shade[..., None]

    # thin atmospheric scatter, blue-weighted
    rgb = rgb * (1 - haze) + np.array([0.05, 0.075, 0.11]) * haze

    # slight lens falloff keeps large scenes from reading as flat texture
    yy, xx = np.mgrid[0:h, 0:w]
    rad = np.hypot((xx / w - 0.5) * 2, (yy / h - 0.5) * 2) / 1.414
    rgb *= (1.0 - vignette * rad ** 1.8)[..., None]

    # sensor point-spread: softens polygon edges into resolved ground detail
    rgb = cv2.GaussianBlur(rgb, (0, 0), max(0.7, w / 2200.0))
    rgb += sc.rng.normal(0, grain, (h, w, 3)).astype(np.float32)
    rgb = np.clip(rgb, 0, 1) ** (1 / GAMMA)            # display gamma
    rgb = np.clip((rgb - 0.46) * 1.13 + 0.44, 0, 1)    # contrast, slight lift down
    # pull a little chroma out so it reads as sensor data, not illustration
    lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
    rgb = np.clip(lum[..., None] * 0.20 + rgb * 0.80, 0, 1)
    return (rgb * 255).astype(np.uint8)


def render_sar(sc, looks=4.2, tint=(0.94, 0.97, 1.0)):
    """Per-class sigma0 with structure enhancement, then Gamma speckle."""
    h, w = sc.h, sc.w
    db = np.zeros((h, w), np.float32)
    for cls, s in SIGMA0.items():
        db[sc.labels == cls] = s

    # double-bounce from tall structures, and volume scatter varying with vigour
    urban = np.isin(sc.labels, [URBAN_L, URBAN_H])
    db[urban] += sc.height[urban] * 6.5
    crop = sc.labels == CROP
    db[crop] += (sc.vigor[crop] - 0.5) * 3.6
    db += (sc.texture - 0.5) * 1.5
    db -= blur(np.gradient(sc.elev * 30.0)[1], 2) * 0.6  # slope-driven modulation

    power = 10 ** (db / 10.0)
    speckle = sc.rng.gamma(looks, 1.0 / looks, (h, w)).astype(np.float32)
    power *= speckle

    amp = np.sqrt(np.clip(power, 1e-6, None))
    amp = np.clip((np.log10(amp) + 1.15) / 1.15, 0, 1) ** (1 / 1.15)
    amp = cv2.GaussianBlur(amp, (0, 0), 0.45)  # sensor MTF
    amp = np.clip((amp - 0.5) * 1.22 + 0.49, 0, 1)

    out = np.clip(amp[..., None] * np.array(tint), 0, 1)
    return (out * 255).astype(np.uint8)


def save(arr, path, quality=86, size=None):
    img = Image.fromarray(arr)
    if size:
        img = img.resize(size, Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, quality=quality, method=6)
    return path
