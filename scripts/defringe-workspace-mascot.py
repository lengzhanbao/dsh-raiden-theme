"""Rebuild workspace Q mascot assets: solid interior, soft alpha only on edges."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "assets" / "raiden" / "icons"
REFS = Path(r"E:\taffy\.cache\downloads\raiden-refs")
DURS = [308, 392, 280, 364, 280, 448]
FRAME_PATHS = [
    REFS / "q-archive-source.png",
    REFS / "q-act-windup.png",
    REFS / "q-act-punch.png",
    REFS / "q-act-hop.png",
    REFS / "q-act-punch.png",
    REFS / "q-archive-source.png",
]
THEMES = {
    "light": (232, 220, 250),
    "dark": (58, 40, 92),
}


def luma(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


def key_white(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    w, h = image.size
    px = image.load()
    out = Image.new("RGBA", image.size, (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if min(r, g, b) > 248 and abs(r - g) < 12 and abs(g - b) < 12:
                continue
            m = min(r, g, b)
            if m > 225 and abs(r - g) < 16 and abs(g - b) < 16:
                fade = int(a * (248 - m) / 23)
                op[x, y] = (r, g, b, max(0, fade))
            else:
                op[x, y] = (r, g, b, a)
    box = out.getbbox()
    cropped = out.crop(box) if box else out
    px = cropped.load()
    w, h = cropped.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if 0 < a < 40:
                px[x, y] = (0, 0, 0, 0)
    return cropped


def neighbor_color(px, x: int, y: int, w: int, h: int, min_luma: float = 70) -> tuple[int, int, int] | None:
    best = None
    best_score = -1.0
    for ny in range(max(0, y - 4), min(h, y + 5)):
        for nx in range(max(0, x - 4), min(w, x + 5)):
            if nx == x and ny == y:
                continue
            nr, ng, nb, na = px[nx, ny]
            if na < 220:
                continue
            nl = luma(nr, ng, nb)
            if nl < min_luma:
                continue
            score = na + nl
            if score > best_score:
                best_score = score
                best = (nr, ng, nb)
    return best


def tint_edges(image: Image.Image, tint: tuple[int, int, int]) -> Image.Image:
    image = image.convert("RGBA")
    w, h = image.size
    px = image.load()
    tr, tg, tb = tint
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 24:
                continue
            on_edge = (
                x == 0 or y == 0 or x == w - 1 or y == h - 1
                or px[x - 1, y][3] < 24
                or px[x + 1, y][3] < 24
                or px[x, y - 1][3] < 24
                or px[x, y + 1][3] < 24
            )
            if not on_edge:
                continue
            fill = neighbor_color(px, x, y, w, h)
            if fill is None:
                continue
            fr, fg, fb = fill
            px[x, y] = (
                int(fr * 0.72 + tr * 0.28),
                int(fg * 0.72 + tg * 0.28),
                int(fb * 0.72 + tb * 0.28),
                a,
            )
    return image


def solidify_alpha(image: Image.Image, visible_threshold: int = 56, edge_band: int = 2) -> Image.Image:
    """Keep anti-aliased alpha only on the outer silhouette; interior is fully opaque."""
    image = image.convert("RGBA")
    w, h = image.size
    px = image.load()

    visible = [[px[x, y][3] > visible_threshold for x in range(w)] for y in range(h)]
    exterior = [[False] * w for _ in range(h)]
    q: list[tuple[int, int]] = []

    for x in range(w):
        for y in (0, h - 1):
            if not visible[y][x]:
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not visible[y][x]:
                q.append((x, y))

    while q:
        x, y = q.pop()
        if exterior[y][x]:
            continue
        if visible[y][x]:
            continue
        exterior[y][x] = True
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not exterior[ny][nx]:
                q.append((nx, ny))

    edge = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not visible[y][x]:
                continue
            on_outer = False
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if nx < 0 or ny < 0 or nx >= w or ny >= h or exterior[ny][nx] or not visible[ny][nx]:
                    on_outer = True
                    break
            if on_outer:
                edge[y][x] = True

    if edge_band > 0:
        grown = [[False] * w for _ in range(h)]
        for y in range(h):
            for x in range(w):
                if not edge[y][x]:
                    continue
                for ny in range(max(0, y - edge_band), min(h, y + edge_band + 1)):
                    for nx in range(max(0, x - edge_band), min(w, x + edge_band + 1)):
                        if visible[ny][nx]:
                            grown[ny][nx] = True
        edge = grown

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                px[x, y] = (0, 0, 0, 0)
                continue
            if not edge[y][x]:
                px[x, y] = (r, g, b, 255)
            elif a >= 196:
                px[x, y] = (r, g, b, 255)
            else:
                px[x, y] = (r, g, b, min(255, max(a, 184)))

    for y in range(h):
        for x in range(w):
            if 0 < px[x, y][3] < 48:
                px[x, y] = (0, 0, 0, 0)

    return image


def fit_frame(sprite: Image.Image, side: int = 256) -> Image.Image:
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    s = sprite.copy()
    s.thumbnail((230, 230), Image.Resampling.LANCZOS)
    ox = (side - s.size[0]) // 2
    oy = (side - s.size[1]) // 2 + 6
    canvas.alpha_composite(s, (ox, oy))
    return canvas


def build_frames(theme: str) -> list[Image.Image]:
    tint = THEMES[theme]
    frames: list[Image.Image] = []
    for i, path in enumerate(FRAME_PATHS):
        raw = key_white(Image.open(path))
        cut = tint_edges(raw, tint)
        cut = solidify_alpha(cut)
        frame = fit_frame(cut)
        frame = solidify_alpha(frame, visible_threshold=48, edge_band=1)
        if i in (2, 4):
            frame = ImageEnhance.Contrast(frame).enhance(1.05)
        frames.append(frame)
    return frames


def alpha_stats(image: Image.Image) -> tuple[float, int]:
    px = image.load()
    w, h = image.size
    alphas = []
    semi = 0
    for y in range(h):
        for x in range(w):
            a = px[x, y][3]
            if a <= 0:
                continue
            alphas.append(a)
            if a < 250:
                semi += 1
    avg = sum(alphas) / len(alphas) if alphas else 0
    return avg, semi


def main() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)
    for theme in THEMES:
        frames = build_frames(theme)
        anim = ICONS / f"archive-q-{theme}.webp"
        still = ICONS / f"archive-q-{theme}-still.webp"
        frames[0].save(still, "WEBP", quality=92, method=6)
        frames[0].save(
            anim,
            "WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=DURS,
            loop=0,
            quality=92,
            method=6,
            lossless=True,
        )
        avg, semi = alpha_stats(frames[0])
        print(f"{theme}: {anim.name} {anim.stat().st_size} bytes, avg_alpha={avg:.1f}, semi={semi}")

    frames = build_frames("light")
    frames[0].save(ICONS / "archive-q.webp", "WEBP", quality=92, method=6)


if __name__ == "__main__":
    main()
