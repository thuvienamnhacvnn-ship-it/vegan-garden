# -----------------------------------------------------------------------------
# Extracts the photography used by the site out of the design mock-ups in
# E:\Works\PTC\Vegan (v1..v5.png, 1672x941 each) into public/images/.
#
# Rendered with ffmpeg: Lanczos resampling to at least 2K on the long edge,
# an unsharp pass to restore micro-contrast, and a mild levels/saturation lift
# so the food reads bright and punchy rather than muddy.
#
#   powershell -File scripts/extract-images.ps1
#
# Each entry is Source, X, Y, Width, Height (in mock-up pixels) and Output.
# Crops are chosen so no baked-in mock-up typography ends up in the photo.
# -----------------------------------------------------------------------------
$ErrorActionPreference = 'Stop'

$src = 'E:\Works\PTC\Vegan'
$out = Join-Path $PSScriptRoot '..\public\images'
$null = New-Item -ItemType Directory -Force -Path $out

# Long edge of every exported image, in pixels.
$targetLong = 2200

$crops = @(
  # --- Hero ------------------------------------------------------------------
  # The home banner. This is the largest clean single-photo region in any
  # mock-up (996 px wide), so it needs the least upscaling and stays the
  # sharpest image on the site. Height stops short of the quote card in v2.
  @{ src = 'v2'; x = 676;  y = 86;  w = 996; h = 369; f = 'hero/hero-banner'; long = 2600 }

  @{ src = 'v1'; x = 745;  y = 79;  w = 540; h = 862; f = 'hero/hero-signature-bowl' }
  @{ src = 'v4'; x = 578;  y = 113; w = 528; h = 542; f = 'hero/hero-dining-room' }
  @{ src = 'v2'; x = 676;  y = 86;  w = 524; h = 514; f = 'hero/hero-garden-window' }
  @{ src = 'v5'; x = 918;  y = 499; w = 754; h = 196; f = 'hero/hero-evening-tables' }

  # --- Our story -------------------------------------------------------------
  @{ src = 'v2'; x = 676;  y = 86;  w = 996; h = 368; f = 'story/story-interior-wide' }
  @{ src = 'v2'; x = 0;    y = 612; w = 388; h = 329; f = 'story/story-ingredients' }
  @{ src = 'v2'; x = 1352; y = 640; w = 320; h = 301; f = 'story/story-pho-bowl' }

  # --- Dishes ----------------------------------------------------------------
  @{ src = 'v3'; x = 472;  y = 232; w = 283; h = 265; f = 'dishes/vegan-pho' }
  @{ src = 'v3'; x = 769;  y = 134; w = 279; h = 363; f = 'dishes/summer-rolls' }
  @{ src = 'v3'; x = 1060; y = 134; w = 279; h = 363; f = 'dishes/tofu-asparagus' }
  @{ src = 'v3'; x = 1353; y = 134; w = 279; h = 363; f = 'dishes/garden-bowl' }
  @{ src = 'v3'; x = 832;  y = 706; w = 528; h = 235; f = 'dishes/glass-noodles' }
  @{ src = 'v5'; x = 1178; y = 700; w = 380; h = 200; f = 'dishes/hu-tieu-bowl' }
  @{ src = 'v4'; x = 1301; y = 399; w = 349; h = 256; f = 'dishes/lemongrass-bowl' }
  @{ src = 'v1'; x = 716;  y = 570; w = 170; h = 130; f = 'dishes/dipping-sauce' }

  # --- Gallery ---------------------------------------------------------------
  @{ src = 'v4'; x = 578;  y = 113; w = 528; h = 542; f = 'gallery/dining-hall-green-wall' }
  @{ src = 'v4'; x = 1113; y = 113; w = 281; h = 280; f = 'gallery/corner-booth' }
  @{ src = 'v4'; x = 1401; y = 113; w = 249; h = 280; f = 'gallery/table-detail-candle' }
  @{ src = 'v4'; x = 1113; y = 399; w = 181; h = 256; f = 'gallery/buddha-alcove' }
  @{ src = 'v5'; x = 918;  y = 499; w = 380; h = 196; f = 'gallery/evening-atmosphere' }
  @{ src = 'v5'; x = 1300; y = 499; w = 372; h = 196; f = 'gallery/tea-and-plants' }
  @{ src = 'v2'; x = 676;  y = 86;  w = 330; h = 514; f = 'gallery/window-greenery' }
  @{ src = 'v2'; x = 1006; y = 86;  w = 330; h = 370; f = 'gallery/logo-wall' }

  # --- Contact / misc --------------------------------------------------------
  @{ src = 'v5'; x = 918;  y = 499; w = 754; h = 196; f = 'contact/restaurant-evening' }
  @{ src = 'v1'; x = 1030; y = 100; w = 300; h = 300; f = 'misc/vase-greenery' }
  @{ src = 'v1'; x = 1352; y = 296; w = 200; h = 290; f = 'misc/candle-lantern' }
)

foreach ($c in $crops) {
  $long = if ($c.ContainsKey('long')) { $c.long } else { $targetLong }
  $ratio = if ($c.w -ge $c.h) { $long / $c.w } else { $long / $c.h }
  $tw = [int][math]::Round($c.w * $ratio / 2) * 2
  $th = [int][math]::Round($c.h * $ratio / 2) * 2

  $path = Join-Path $out "$($c.f).jpg"
  $null = New-Item -ItemType Directory -Force -Path (Split-Path $path)

  # crop -> Lanczos upscale -> unsharp -> brighten/contrast/saturate
  $vf = "crop=$($c.w):$($c.h):$($c.x):$($c.y)," +
        "scale=${tw}:${th}:flags=lanczos+accurate_rnd," +
        "unsharp=luma_msize_x=5:luma_msize_y=5:luma_amount=1.1," +
        "eq=brightness=0.045:contrast=1.14:saturation=1.16:gamma=1.03"

  & ffmpeg -y -hide_banner -loglevel error -i (Join-Path $src "$($c.src).png") `
    -vf $vf -q:v 2 -pix_fmt yuvj420p $path

  $kb = [math]::Round((Get-Item $path).Length / 1KB)
  "{0,-42} {1}x{2}  {3} KB" -f "$($c.f).jpg", $tw, $th, $kb
}

"`nDone - $($crops.Count) images written to public/images/"
