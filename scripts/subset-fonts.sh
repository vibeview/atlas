#!/bin/sh
# Writes the Roku channel's Manrope fonts: three weights cut down to the Latin
# ranges the content uses (accents and Vietnamese included), so they cost
# little of the channel's size budget. Run by hand after changing the ranges;
# the output is committed. Needs tv/ installed (npm --prefix tv ci) and uv.
set -e
cd "$(dirname "$0")/.."
src=tv/node_modules/@expo-google-fonts/manrope
out=roku/fonts
mkdir -p "$out"
ranges="U+0020-007E,U+00A0-024F,U+1E00-1EFF,U+2010-2027,U+2030-203A,U+20AC,U+2190-2193,U+2212"
for pair in 500Medium:Medium 700Bold:Bold 800ExtraBold:ExtraBold; do
  dir=${pair%%:*}
  name=${pair##*:}
  uvx --from fonttools==4.60.1 pyftsubset "$src/$dir/Manrope_$dir.ttf" \
    --unicodes="$ranges" --layout-features='kern,liga,calt' --no-hinting --desubroutinize \
    --output-file="$out/Manrope-$name.ttf"
done
cp "$src/LICENSE_FONT" "$out/OFL.txt"
ls -l "$out"
