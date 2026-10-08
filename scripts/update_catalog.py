"""Regenera o catálogo estático a partir das ROMs existentes, sem depender de servidor especial."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ROM_DIR = ROOT / 'roms' / 'snes'
metadata = {}
xml = ROM_DIR / 'gamelist.xml'
if xml.exists():
    for game in ET.parse(xml).getroot().findall('game'):
        metadata[Path(game.findtext('path', '')).name] = game

games = []
for rom in sorted(ROM_DIR.iterdir(), key=lambda p: p.name.casefold()):
    if not rom.is_file() or rom.suffix.lower() not in {'.zip', '.sfc', '.smc', '.bin'}:
        continue
    meta = metadata.get(rom.name)
    def field(name, default=''):
        return (meta.findtext(name, default) if meta is not None else default) or default
    title = field('name', re.sub(r'\s*[\(\[].*', '', rom.stem).strip())
    image = ROM_DIR / field('image', 'missing').removeprefix('./')
    if not image.is_file() or not image.resolve().is_relative_to(ROM_DIR.resolve()):
        image = ROM_DIR / 'downloaded_images' / (rom.stem + '.png')
    cover = image.relative_to(ROOT).as_posix() if image.is_file() else 'assets/covers/snes-placeholder.svg'
    featured = rom.name == 'Super Metroid (Japan, USA) (En,Ja).zip'
    games.append(dict(id='snes-' + hashlib.sha256(rom.name.encode()).hexdigest()[:16],
        title=title, rom=rom.relative_to(ROOT).as_posix(), cover=cover,
        genre=field('genre', 'SNES').replace('-', ' / '),
        year=field('releasedate')[:4] or '—', featured=featured,
        tag='⭐ DESTAQUE' if featured else '', accentColor='rgba(139, 92, 246, 0.45)',
        description=field('desc'), filename=rom.name))
games.sort(key=lambda game: (not game['featured'], game['title'].casefold(), game['filename'].casefold()))
output = '// Gerado por scripts/update_catalog.py.\nconst GAMES_CATALOG = ' + json.dumps(games, ensure_ascii=False, indent=2) + ';\n'
(ROOT / 'catalog.js').write_text(output, encoding='utf-8')
print(f'{len(games)} ROMs incluídas; {sum(g["cover"].endswith(".svg") for g in games)} com capa padrão.')
