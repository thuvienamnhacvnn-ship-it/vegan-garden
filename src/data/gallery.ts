import type { GalleryCategory, GalleryImage } from '@/types'

/**
 * Intrinsic sizes are stored alongside each image so next/image can reserve the
 * exact box before the file loads - that keeps the masonry grid at CLS 0.
 */
export const galleryImages: GalleryImage[] = [
  {
    id: 'dining-hall',
    src: '/images/gallery/dining-hall-green-wall.jpg',
    width: 2144,
    height: 2200,
    category: 'space',
    alt: {
      de: 'Gastraum mit begrünter Wand, goldenem Lotus-Logo und Holztischen',
      vi: 'Không gian ăn với tường cây xanh, logo hoa sen vàng và bàn gỗ',
    },
    caption: {
      de: 'Unsere grüne Wand mit dem goldenen Lotus',
      vi: 'Bức tường xanh với hoa sen vàng',
    },
  },
  {
    id: 'window-greenery',
    src: '/images/gallery/window-greenery.jpg',
    width: 1412,
    height: 2200,
    category: 'space',
    alt: {
      de: 'Bodentiefe Fenster mit Pflanzen und Rattanlampen',
      vi: 'Cửa kính cao với cây xanh và đèn mây tre',
    },
    caption: {
      de: 'Tageslicht und Pflanzen an der Fensterfront',
      vi: 'Ánh sáng tự nhiên bên ô cửa xanh',
    },
  },
  {
    id: 'corner-booth',
    src: '/images/gallery/corner-booth.jpg',
    width: 2200,
    height: 2192,
    category: 'space',
    alt: {
      de: 'Gemütliche Sitzecke mit grünen Polstern und Zimmerpflanzen',
      vi: 'Góc ngồi ấm cúng với ghế nệm xanh và cây cảnh',
    },
    caption: { de: 'Die ruhige Ecke für zwei', vi: 'Góc yên tĩnh dành cho hai người' },
  },
  {
    id: 'evening-atmosphere',
    src: '/images/gallery/evening-atmosphere.jpg',
    width: 2200,
    height: 1134,
    category: 'space',
    alt: {
      de: 'Abendlich gedeckte Tische mit Kerzenlicht',
      vi: 'Bàn ăn buổi tối với ánh nến',
    },
    caption: { de: 'Abends bei Kerzenlicht', vi: 'Buổi tối bên ánh nến' },
  },
  {
    id: 'interior-wide',
    src: '/images/story/story-interior-wide.jpg',
    width: 2200,
    height: 812,
    category: 'space',
    alt: {
      de: 'Panoramablick in den Gastraum von Vegan Garden',
      vi: 'Toàn cảnh không gian nhà hàng Vegan Garden',
    },
    caption: { de: 'Der Gastraum am Nachmittag', vi: 'Không gian nhà hàng buổi chiều' },
  },
  {
    id: 'logo-wall',
    src: '/images/gallery/logo-wall.jpg',
    width: 1962,
    height: 2200,
    category: 'details',
    alt: {
      de: 'Goldenes Vegan-Garden-Logo auf der Holzwand',
      vi: 'Logo Vegan Garden vàng trên tường gỗ',
    },
    caption: { de: 'Der goldene Lotus auf Holz', vi: 'Hoa sen vàng trên nền gỗ' },
  },
  {
    id: 'buddha-alcove',
    src: '/images/gallery/buddha-alcove.jpg',
    width: 1556,
    height: 2200,
    category: 'details',
    alt: {
      de: 'Buddha-Figur in einer Nische mit Kerzen und Pflanzen',
      vi: 'Tượng Phật trong hốc tường với nến và cây xanh',
    },
    caption: { de: 'Ein Moment der Stille', vi: 'Một khoảng lặng' },
  },
  {
    id: 'table-detail',
    src: '/images/gallery/table-detail-candle.jpg',
    width: 1956,
    height: 2200,
    category: 'details',
    alt: {
      de: 'Gedeckter Tisch mit Kerze, Keramikvase und Kräutern',
      vi: 'Bàn ăn với nến, bình gốm và rau thơm',
    },
    caption: { de: 'Keramik, Kerze, Kräuter', vi: 'Gốm, nến và rau thơm' },
  },
  {
    id: 'tea-and-plants',
    src: '/images/gallery/tea-and-plants.jpg',
    width: 2200,
    height: 1160,
    category: 'details',
    alt: {
      de: 'Teeschalen und Zimmerpflanzen auf einem Holztisch',
      vi: 'Chén trà và cây xanh trên bàn gỗ',
    },
    caption: { de: 'Tee zwischen Grünpflanzen', vi: 'Trà giữa những tán cây' },
  },
  {
    id: 'candle-lantern',
    src: '/images/misc/candle-lantern.jpg',
    width: 1518,
    height: 2200,
    category: 'details',
    alt: { de: 'Goldene Kerzenlaterne auf dem Tisch', vi: 'Đèn nến vàng trên bàn' },
    caption: { de: 'Warmes Licht am Abend', vi: 'Ánh sáng ấm buổi tối' },
  },
  {
    id: 'pho-chay',
    src: '/images/dishes/vegan-pho.jpg',
    width: 2200,
    height: 2060,
    category: 'food',
    alt: {
      de: 'Schale vegane Pho mit Tofu, Pilzen und frischen Kräutern',
      vi: 'Tô phở chay với đậu hũ, nấm và rau thơm',
    },
    caption: { de: 'Phở Chay – unsere vegane Pho', vi: 'Phở chay – món ruột của quán' },
  },
  {
    id: 'summer-rolls',
    src: '/images/dishes/summer-rolls.jpg',
    width: 1690,
    height: 2200,
    category: 'food',
    alt: {
      de: 'Frische Sommerrollen mit Kräutern und Erdnuss-Dip',
      vi: 'Gỏi cuốn tươi với rau thơm và nước chấm đậu phộng',
    },
    caption: { de: 'Gỏi Cuốn mit Erdnuss-Sauce', vi: 'Gỏi cuốn chấm sốt đậu phộng' },
  },
  {
    id: 'tofu-asparagus',
    src: '/images/dishes/tofu-asparagus.jpg',
    width: 1690,
    height: 2200,
    category: 'food',
    alt: {
      de: 'Gebratener Tofu mit grünem Spargel und Chili',
      vi: 'Đậu hũ xào măng tây và ớt',
    },
    caption: { de: 'Tofu & Spargel aus dem Wok', vi: 'Đậu hũ măng tây xào' },
  },
  {
    id: 'garden-bowl',
    src: '/images/dishes/garden-bowl.jpg',
    width: 1690,
    height: 2200,
    category: 'food',
    alt: {
      de: 'Vegan Garden Bowl mit braunem Reis, Tofu und Gemüse',
      vi: 'Vegan Garden Bowl với gạo lứt, đậu hũ và rau củ',
    },
    caption: { de: 'Die Vegan Garden Bowl', vi: 'Tô Vegan Garden' },
  },
  {
    id: 'glass-noodles',
    src: '/images/dishes/glass-noodles.jpg',
    width: 2200,
    height: 980,
    category: 'food',
    alt: {
      de: 'Gebratene Glasnudeln mit Tofu und Kräutern auf Bananenblatt',
      vi: 'Miến xào với đậu hũ và rau thơm trên lá chuối',
    },
    caption: { de: 'Miến Xào auf Bananenblatt', vi: 'Miến xào trên lá chuối' },
  },
  {
    id: 'lemongrass-bowl',
    src: '/images/dishes/lemongrass-bowl.jpg',
    width: 2200,
    height: 1614,
    category: 'food',
    alt: {
      de: 'Schale mit Zitronengras-Tofu, Chili und Limette',
      vi: 'Tô đậu hũ sả ớt và chanh',
    },
    caption: { de: 'Zitronengras, Chili, Limette', vi: 'Sả, ớt và chanh' },
  },
  {
    id: 'hu-tieu',
    src: '/images/dishes/hu-tieu-bowl.jpg',
    width: 2200,
    height: 1158,
    category: 'food',
    alt: {
      de: 'Dampfende Nudelsuppe mit Tofu und Kräutern',
      vi: 'Tô bún nóng với đậu hũ và rau thơm',
    },
    caption: { de: 'Suppe, wie sie sein soll', vi: 'Tô nước dùng đúng điệu' },
  },
  {
    id: 'canh-chua',
    src: '/images/story/story-pho-bowl.jpg',
    width: 2200,
    height: 2070,
    category: 'food',
    alt: {
      de: 'Süßsaure Suppe mit Kräutern in einer Keramikschale',
      vi: 'Canh chua trong tô gốm với rau thơm',
    },
    caption: { de: 'Canh Chua in Handkeramik', vi: 'Canh chua trong tô gốm thủ công' },
  },
  {
    id: 'ingredients-limes',
    src: '/images/story/story-ingredients.jpg',
    width: 2200,
    height: 1866,
    category: 'ingredients',
    alt: {
      de: 'Limetten und Zitronengras in einer Keramikschale',
      vi: 'Chanh và sả trong tô gốm',
    },
    caption: { de: 'Limette und Zitronengras', vi: 'Chanh và sả tươi' },
  },
  {
    id: 'ingredients-herbs',
    src: '/images/misc/vase-greenery.jpg',
    width: 2200,
    height: 2200,
    category: 'ingredients',
    alt: {
      de: 'Frische Kräuter in einer grünen Keramikvase',
      vi: 'Rau thơm tươi trong bình gốm xanh',
    },
    caption: { de: 'Kräuter, jeden Morgen frisch', vi: 'Rau thơm tươi mỗi sáng' },
  },
  {
    id: 'ingredients-sauce',
    src: '/images/dishes/dipping-sauce.jpg',
    width: 2200,
    height: 1682,
    category: 'ingredients',
    alt: {
      de: 'Schälchen mit hausgemachter Chili-Dip-Sauce',
      vi: 'Chén nước chấm ớt nhà làm',
    },
    caption: { de: 'Nước Chấm, täglich frisch angesetzt', vi: 'Nước chấm pha mới mỗi ngày' },
  },
]

export const galleryCategories: GalleryCategory[] = ['space', 'food', 'details', 'ingredients']

/** The five images used in the editorial preview grid on the home page. */
export const galleryPreviewIds = [
  'dining-hall',
  'corner-booth',
  'table-detail',
  'buddha-alcove',
  'lemongrass-bowl',
]
