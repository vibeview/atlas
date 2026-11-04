#!/bin/sh
# Packages the channel into the zip Roku's developer installer sideloads.
# Usage: sh package.sh [out.zip]   (default out/atlas.zip, relative to roku/)
set -e
cd "$(dirname "$0")"
out="${1:-out/atlas.zip}"
mkdir -p "$(dirname "$out")"
rm -f "$out"
zip -qr -X "$out" manifest source components images data fonts
