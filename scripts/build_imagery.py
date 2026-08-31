"""Build every image asset the SatQuery site needs, plus derived metadata.

Change masks, bounding boxes and area statistics are measured from the
generated label maps, so the numbers shown in the UI are consistent with
the imagery they describe.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from gen_core import (Scene, WATER, CROP, FOREST, BARE, URBAN_L, URBAN_H, ROAD,
                      SHRUB)
from gen_render import render_optical, render_sar, save

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "imagery"
META = ROOT / "lib" / "data" / "generated.json"
BUILT = (URBAN_L, URBAN_H)
meta = {}


def is_built(lab):
    return np.isin(lab, BUILT)


def regions(mask, min_area, limit, w, h, pad=6, merge=13):
    """Connected components of a change mask -> normalised boxes.

    `merge` closes the mask first so scattered structures resolve into one
    settlement footprint rather than hundreds of individual rooftops.
    """
    m = (mask.astype(np.uint8) * 255)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((merge, merge), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, _, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    out = []
    for i in range(1, n):
        x, y, bw, bh, area = stats[i]
        if area < min_area:
            continue
        out.append({
            "x": round(max(0, x - pad) / w, 4),
            "y": round(max(0, y - pad) / h, 4),
            "w": round(min(w, bw + pad * 2) / w, 4),
            "h": round(min(h, bh + pad * 2) / h, 4),
            "area": int(area),
        })
    out.sort(key=lambda r: -r["area"])
    return out[:limit]


def pct(a, b):
    return round((b - a) / max(a, 1) * 100, 1)


def km2(px, gsd=10.0):
    """Pixel count -> square kilometres at the stated ground sample distance."""
    return round(px * (gsd ** 2) / 1e6, 2)


# --------------------------------------------------------------- 1. hero
def build_hero():
    w, h = 2560, 1440
    sc = Scene(w, h, 20260901)
    sc.base_landscape(forest_bias=0.42, bare_bias=0.16)
    sc.river([(-60, 980), (420, 900), (900, 1010), (1380, 880), (1850, 940),
              (2320, 820), (2620, 860)], 96)
    sc.river([(1180, -40), (1240, 300), (1330, 620), (1380, 880)], 40)
    sc.lake(2050, 340, 300, 170, irregular=44)
    sc.fields((120, 120, 1180, 860), n=20, angle=0.22)
    sc.fields((1500, 980, 2540, 1420), n=16, angle=-0.35)
    sc.road_grid((1380, 300, 2100, 800), spacing=104, angle=0.14, width=2)
    sc.urban((1400, 320, 2080, 780), density=0.5, spacing=104, angle=0.14, high=0.22)
    save(render_optical(sc, haze=0.055, sun=0.62), OUT / "hero-scene.webp", 58,
         size=(1000, 563))
    save(render_sar(sc), OUT / "hero-sar.webp", 40, size=(620, 349))


# ------------------------------------------------- 2. bi-temporal urban pair
def build_urban_pair():
    w, h = 1800, 1350

    def base(seed=771):
        sc = Scene(w, h, seed)
        sc.base_landscape(forest_bias=0.30, bare_bias=0.18)
        sc.river([(-40, 1180), (300, 1080), (700, 1140), (1120, 1010),
                  (1520, 1060), (1860, 980)], 74)
        sc.lake(1520, 300, 210, 128, irregular=34)
        sc.fields((60, 80, 780, 900), n=15, angle=0.18)
        sc.fields((1180, 700, 1780, 1180), n=11, angle=-0.28)
        sc.road_grid((360, 220, 1240, 980), spacing=92, angle=0.09, width=2)
        sc.urban((380, 240, 1220, 960), density=0.58, spacing=92, angle=0.09,
                 high=0.26, seed_shift=1)
        return sc

    t1 = base()
    lab1 = t1.labels.copy()

    t2 = base()
    # eastern built-up expansion
    t2.road_grid((1215, 300, 1620, 940), spacing=92, angle=0.09, width=2)
    t2.urban((1220, 310, 1610, 930), density=0.66, spacing=92, angle=0.09,
             high=0.30, seed_shift=42)
    # infill within the existing core
    t2.urban((640, 640, 980, 900), density=0.55, spacing=64, angle=0.09,
             high=0.2, seed_shift=77)
    # vegetation cleared north-west of the core
    veg = (t2.labels == CROP) | (t2.labels == FOREST)
    box = np.zeros((h, w), bool)
    box[180:520, 120:520] = True
    clear = veg & box & (t2.texture > 0.42)
    t2.labels[clear] = BARE
    # reservoir drawdown
    lakeband = (t2.labels == WATER) & (t2.depth < 0.62)
    t2.labels[lakeband] = BARE
    t2.depth[lakeband] = 0.0

    lab2 = t2.labels
    o1, o2 = render_optical(t1), render_optical(t2)
    save(o1, OUT / "urban-t1.webp", 78, size=(1400, 1050))
    save(o2, OUT / "urban-t2.webp", 78, size=(1400, 1050))

    built_new = is_built(lab2) & ~is_built(lab1)
    veg_loss = ((lab1 == CROP) | (lab1 == FOREST)) & (lab2 == BARE)
    water_loss = (lab1 == WATER) & (lab2 != WATER)

    # change-map overlay: transparent PNG, one hue per transition class
    ov = np.zeros((h, w, 4), np.uint8)
    ov[built_new] = (232, 163, 61, 190)
    ov[veg_loss] = (214, 108, 74, 165)
    ov[water_loss] = (110, 168, 204, 180)
    edge = cv2.dilate(built_new.astype(np.uint8), np.ones((5, 5), np.uint8)) - \
        built_new.astype(np.uint8)
    ov[edge.astype(bool)] = (255, 208, 128, 255)
    save(ov, OUT / "urban-change-mask.png")

    b1, b2 = int(is_built(lab1).sum()), int(is_built(lab2).sum())
    meta["urbanChange"] = {
        "width": w, "height": h, "gsd": 10,
        "builtUpT1Km2": km2(b1), "builtUpT2Km2": km2(b2),
        "builtUpDeltaPct": pct(b1, b2),
        "newBuiltUpKm2": km2(int(built_new.sum())),
        "vegetationLossKm2": km2(int(veg_loss.sum())),
        "waterLossKm2": km2(int(water_loss.sum())),
        "changedFraction": round(float((lab1 != lab2).mean()) * 100, 1),
        "builtRegions": regions(built_new, 2600, 4, w, h, merge=41),
        "vegRegions": regions(veg_loss, 2500, 2, w, h, merge=17),
        "waterRegions": regions(water_loss, 1200, 2, w, h, merge=17),
    }


# ------------------------------------------- 3. co-registered optical/SAR pair
def build_crossmodal():
    w, h = 1500, 1500
    sc = Scene(w, h, 3391)
    sc.base_landscape(forest_bias=0.34, bare_bias=0.2)
    sc.river([(-40, 620), (330, 700), (720, 640), (1080, 760), (1540, 700)], 78)
    sc.lake(340, 1180, 235, 150, irregular=36)
    sc.fields((60, 60, 700, 520), n=13, angle=0.3)
    sc.fields((820, 900, 1460, 1440), n=12, angle=-0.2)
    sc.road_grid((760, 90, 1440, 620), spacing=88, angle=-0.07, width=2)
    sc.urban((770, 100, 1430, 610), density=0.68, spacing=88, angle=-0.07,
             high=0.34, seed_shift=9)
    sc.road_grid((150, 760, 620, 1060), spacing=70, angle=0.12, width=2)
    sc.urban((160, 770, 610, 1050), density=0.45, spacing=70, angle=0.12,
             high=0.16, seed_shift=11)

    save(render_optical(sc), OUT / "cross-optical.webp", 78, size=(1200, 1200))
    save(render_sar(sc), OUT / "cross-sar.webp", 52, size=(980, 980))

    lab = sc.labels
    built, water = is_built(lab), lab == WATER
    # fusion product: SAR structure under an optical-derived class tint
    fuse = np.zeros((h, w, 4), np.uint8)
    fuse[built] = (232, 163, 61, 150)
    fuse[water] = (94, 156, 200, 165)
    fuse[lab == FOREST] = (94, 158, 118, 96)
    save(fuse, OUT / "cross-fusion.png")

    meta["crossModal"] = {
        "width": w, "height": h, "gsd": 10,
        "builtUpKm2": km2(int(built.sum())),
        "waterKm2": km2(int(water.sum())),
        "builtUpPct": round(float(built.mean()) * 100, 1),
        "waterPct": round(float(water.mean()) * 100, 1),
        "builtRegions": regions(built, 6000, 3, w, h, merge=45),
        "waterRegions": regions(water, 9000, 3, w, h, merge=15),
    }


# ------------------------------------------------------- 4. water / flood pair
def build_water_pair():
    w, h = 1600, 1200

    def base(seed=5150):
        sc = Scene(w, h, seed)
        sc.base_landscape(forest_bias=0.4, bare_bias=0.14)
        sc.river([(-40, 300), (360, 380), (760, 330), (1180, 430), (1640, 380)], 62)
        sc.fields((80, 620, 900, 1160), n=14, angle=0.16)
        sc.road_grid((980, 640, 1520, 1120), spacing=76, angle=-0.1, width=2)
        sc.urban((990, 650, 1510, 1110), density=0.5, spacing=76, angle=-0.1,
                 high=0.2, seed_shift=5)
        return sc

    pre = base()
    pre.lake(560, 320, 300, 150, irregular=40)
    post = base()
    post.lake(560, 320, 300, 150, irregular=40)
    # inundation spreading south from the channel
    flood = post.lake(700, 470, 520, 250, irregular=70)

    lab_pre, lab_post = pre.labels.copy(), post.labels
    save(render_optical(pre), OUT / "water-t1.webp", 78, size=(1300, 975))
    save(render_optical(post), OUT / "water-t2.webp", 78, size=(1300, 975))

    new_water = (lab_post == WATER) & (lab_pre != WATER)
    ov = np.zeros((h, w, 4), np.uint8)
    ov[new_water] = (94, 156, 200, 175)
    save(ov, OUT / "water-change-mask.png")

    a, b = int((lab_pre == WATER).sum()), int((lab_post == WATER).sum())
    meta["waterChange"] = {
        "width": w, "height": h, "gsd": 10,
        "waterT1Km2": km2(a), "waterT2Km2": km2(b), "waterDeltaPct": pct(a, b),
        "newWaterKm2": km2(int(new_water.sum())),
        "affectedBuiltUpKm2": km2(int((new_water & is_built(lab_pre)).sum())),
        "regions": regions(new_water, 6000, 3, w, h, merge=15),
    }


# ----------------------------------------------------------- 5. use-case tiles
USE_CASES = [
    ("agriculture", 8801, dict(kind="fields")),
    ("disaster", 8802, dict(kind="flood")),
    ("urban", 8803, dict(kind="city")),
    ("forest", 8804, dict(kind="forest")),
    ("water", 8805, dict(kind="lake")),
    ("infrastructure", 8806, dict(kind="infra")),
    ("environment", 8807, dict(kind="mixed")),
]


def build_use_cases():
    w, h = 1100, 1400
    for name, seed, cfg in USE_CASES:
        sc = Scene(w, h, seed)
        k = cfg["kind"]
        if k == "fields":
            sc.base_landscape(forest_bias=0.18, bare_bias=0.14)
            sc.river([(-30, 420), (340, 500), (740, 430), (1140, 520)], 44)
            sc.fields((0, 0, 1100, 1400), n=13, angle=0.24)
        elif k == "flood":
            sc.base_landscape(forest_bias=0.3, bare_bias=0.16)
            sc.fields((0, 700, 1100, 1400), n=10, angle=-0.2)
            sc.road_grid((120, 120, 900, 640), spacing=74, angle=0.1, width=2)
            sc.urban((130, 130, 890, 630), density=0.5, spacing=74, angle=0.1)
            sc.lake(560, 900, 470, 290, irregular=76)
            sc.river([(-30, 1180), (400, 1100), (800, 1220), (1140, 1140)], 88)
        elif k == "city":
            sc.base_landscape(forest_bias=0.22, bare_bias=0.2)
            sc.river([(-30, 1180), (360, 1080), (760, 1200), (1140, 1090)], 70)
            sc.road_grid((40, 40, 1060, 1040), spacing=84, angle=0.06, width=2)
            sc.urban((50, 50, 1050, 1030), density=0.74, spacing=84, angle=0.06,
                     high=0.38)
        elif k == "forest":
            sc.base_landscape(forest_bias=0.86, bare_bias=0.05)
            sc.labels[:] = 2
            sc.river([(-30, 700), (330, 780), (700, 690), (1140, 800)], 40)
            sc.fields((620, 240, 1080, 700), n=6, angle=0.4)   # clearance
        elif k == "lake":
            sc.base_landscape(forest_bias=0.42, bare_bias=0.1)
            sc.lake(540, 700, 420, 470, irregular=88)
            sc.river([(520, 1150), (600, 1400)], 46)
            sc.fields((0, 0, 1100, 300), n=8, angle=0.1)
        elif k == "infra":
            sc.base_landscape(forest_bias=0.2, bare_bias=0.3)
            sc.road_grid((0, 0, 1100, 1400), spacing=190, angle=0.42, width=7)
            sc.road_grid((0, 0, 1100, 1400), spacing=95, angle=0.42, width=2)
            sc.urban((160, 300, 940, 1100), density=0.3, spacing=95, angle=0.42,
                     high=0.5)
        else:
            sc.base_landscape(forest_bias=0.46, bare_bias=0.24)
            sc.river([(-30, 500), (360, 580), (760, 470), (1140, 600)], 56)
            sc.lake(760, 1080, 260, 190, irregular=48)
            sc.fields((0, 700, 700, 1400), n=9, angle=-0.3)
        save(render_optical(sc), OUT / f"case-{name}.webp", 74, size=(760, 967))


# ------------------------------------------------------- 6. single-image scene
def build_single():
    w, h = 1500, 1125
    sc = Scene(w, h, 6420)
    sc.base_landscape(forest_bias=0.38, bare_bias=0.18)
    sc.river([(-40, 780), (340, 690), (760, 800), (1150, 700), (1540, 760)], 82)
    sc.lake(1180, 260, 220, 132, irregular=32)
    sc.fields((40, 40, 720, 560), n=12, angle=0.26)
    sc.road_grid((760, 480, 1420, 1080), spacing=86, angle=0.1, width=2)
    sc.urban((770, 490, 1410, 1070), density=0.62, spacing=86, angle=0.1, high=0.3)
    save(render_optical(sc), OUT / "single-scene.webp", 78, size=(1200, 900))

    lab = sc.labels
    water = lab == WATER
    ov = np.zeros((h, w, 4), np.uint8)
    ov[water] = (94, 156, 200, 190)
    save(ov, OUT / "single-water-mask.png")
    meta["single"] = {
        "width": w, "height": h, "gsd": 10,
        "classes": [
            {"name": "Cropland", "pct": round(float((lab == CROP).mean()) * 100, 1)},
            {"name": "Built-up", "pct": round(float(is_built(lab).mean()) * 100, 1)},
            {"name": "Water", "pct": round(float(water.mean()) * 100, 1)},
            {"name": "Forest", "pct": round(float((lab == FOREST).mean()) * 100, 1)},
            {"name": "Bare soil", "pct": round(float((lab == BARE).mean()) * 100, 1)},
        ],
        "waterRegions": regions(water, 9000, 3, w, h, merge=15),
        "waterKm2": km2(int(water.sum())),
    }


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for fn in (build_hero, build_urban_pair, build_crossmodal, build_water_pair,
               build_use_cases, build_single):
        print("->", fn.__name__, flush=True)
        fn()
    META.parent.mkdir(parents=True, exist_ok=True)
    META.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print("metadata:", META)
    print(json.dumps(meta, indent=2)[:1800])
