#!/usr/bin/env python3
"""
Coalition.ttf: el ¿ (questiondown) debe ser «?» espejado en Y y en X.
Este script aplica esa transformación y añade exclamdown (¡) si falta.

Requisito: pip install fonttools (o venv local).

Uso:
  python3 scripts/fix-coalition-puntuacion-es.py
  python3 scripts/fix-coalition-puntuacion-es.py path/a/Coalition.ttf
"""

from __future__ import annotations

import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FONT = ROOT / "assets" / "fonts" / "Coalition.ttf"


def _composite(glyph_name: str, transform: tuple[tuple[float, float], tuple[float, float]], x: int, y: int) -> Glyph:
    g = Glyph()
    g.numberOfContours = -1
    comp = GlyphComponent()
    comp.glyphName = glyph_name
    comp.transform = transform
    comp.x = x
    comp.y = y
    comp.flags = 0x02
    g.components = [comp]
    return g


def fix_coalition(path: Path) -> None:
    font = TTFont(path)
    glyf = font["glyf"]
    hmtx = font["hmtx"]

    # ¿ = espejo en eje Y y eje X (scaleX = scaleY = -1)
    glyf["questiondown"] = _composite("question", ((-1.0, 0.0), (0.0, -1.0)), 741, 703)

    order = font.getGlyphOrder()
    if "exclamdown" not in order:
        font.setGlyphOrder(order + ["exclamdown"])
    glyf["exclamdown"] = _composite("exclam", ((1.0, 0.0), (0.0, -1.0)), 0, 707)
    if "exclamdown" not in hmtx.metrics:
        hmtx["exclamdown"] = hmtx["exclam"]

    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[0xA1] = "exclamdown"

    font.save(path)
    print(f"Parcheado: {path}")


def main() -> None:
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_FONT
    if not target.is_file():
        raise SystemExit(f"No existe el archivo: {target}")
    fix_coalition(target)


if __name__ == "__main__":
    main()
