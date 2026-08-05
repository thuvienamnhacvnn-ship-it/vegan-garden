# -----------------------------------------------------------------------------
# Builds the cinematic hero loop from the extracted photography: a slow Ken
# Burns push on each frame, cross-faded together. Outputs MP4 (H.264) + WebM.
#
#   powershell -File scripts/make-hero-video.ps1
#
# Replace public/video/hero.* with real footage any time - the player picks up
# whatever is at those paths.
# -----------------------------------------------------------------------------
$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..'
$img = Join-Path $root 'public\images'
$out = Join-Path $root 'public\video'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$frames = @(
  "$img\hero\hero-dining-room.jpg",
  "$img\gallery\dining-hall-green-wall.jpg",
  "$img\hero\hero-signature-bowl.jpg",
  "$img\hero\hero-garden-window.jpg"
)

$clip = 7          # seconds per frame
$fade = 1.2        # crossfade length
$fps  = 25
$dur  = $clip * $fps

# Feed ONE frame per input: zoompan's `d` then generates the whole clip.
# (With `-loop 1 -t N` ffmpeg would hand zoompan N frames and each would be
# expanded to `d` frames, producing a clip N times too long.)
$inputs = @()
foreach ($f in $frames) { $inputs += @('-i', $f) }

# Ken Burns push per clip
$chain = ''
for ($i = 0; $i -lt $frames.Count; $i++) {
  $chain += "[${i}:v]scale=2240:1260:force_original_aspect_ratio=increase," +
            "crop=2240:1260,zoompan=z='min(zoom+0.00035,1.18)':d=${dur}:" +
            "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1600x900:fps=${fps}," +
            "setsar=1[v${i}];"
}

# Cross-fade the clips into one continuous shot
$prev = 'v0'
for ($i = 1; $i -lt $frames.Count; $i++) {
  $offset = ($clip - $fade) * $i
  $label = if ($i -eq $frames.Count - 1) { 'out' } else { "x${i}" }
  $chain += "[$prev][v${i}]xfade=transition=fade:duration=${fade}:offset=${offset}[${label}];"
  $prev = $label
}
$chain = $chain.TrimEnd(';')

$mp4 = Join-Path $out 'hero.mp4'
$webm = Join-Path $out 'hero.webm'
$poster = Join-Path $out 'hero-poster.jpg'

Write-Host 'Rendering hero.mp4 ...'
& ffmpeg -y -hide_banner -loglevel error @inputs -filter_complex $chain `
  -map '[out]' -an -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p `
  -movflags +faststart $mp4

Write-Host 'Rendering poster ...'
& ffmpeg -y -hide_banner -loglevel error -i $mp4 -ss 1 -frames:v 1 -q:v 3 $poster

Get-ChildItem $out | ForEach-Object {
  '{0,-18} {1} KB' -f $_.Name, [math]::Round($_.Length / 1KB)
}
