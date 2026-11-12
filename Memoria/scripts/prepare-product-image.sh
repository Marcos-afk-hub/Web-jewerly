#!/usr/bin/env bash
#
# Normaliza una fotografía de producto para el catálogo.
#
# Las fotos de referencia traen fondo blanco o muy claro. En vez de
# reemplazar el blanco de forma global (que se come los reflejos de la plata),
# se aplica un tinte cálido suave y uniforme: el papel de la marca (#f8f4ee)
# se mezcla sobre la imagen al 88 %, lo que desplaza el blanco hacia crema
# sin alterar el metal ni los tonos de la pieza.
#
# - Recorta a proporción cuadrada desde el centro.
# - Tiñe hacia el papel cálido de la marca.
# - Ajusta el tamaño a 1400 × 1400 px y guarda como JPEG de calidad alta.
#
# Uso:  scripts/prepare-product-image.sh entrada.jpg salida.jpg
set -euo pipefail

IN="${1:?falta la imagen de entrada}"
OUT="${2:?falta la imagen de salida}"
PAPER="#f8f4ee"

convert "$IN" \
  -auto-orient \
  -colorspace sRGB \
  -resize "1400x1400^" \
  -gravity center \
  -extent 1400x1400 \
  \( -size 1400x1400 "xc:$PAPER" \) \
  -compose blend -define compose:args=12,88 -composite \
  -modulate 101,106,100 \
  -quality 86 \
  -interlace Plane \
  -strip \
  "$OUT"

echo "✓ $(basename "$OUT")"
