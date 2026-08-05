import type { Dish, MenuCategory } from '@/types'

/**
 * The whole menu lives here. To add or change a dish, edit this file only -
 * every page (menu, order, home teaser, JSON-LD) reads from it.
 */
export const dishes: Dish[] = [
  // ---------------------------------------------------------------- Starters
  {
    id: 'goi-cuon',
    nameVi: 'Gỏi Cuốn',
    name: { de: 'Frische Sommerrollen', vi: 'Gỏi cuốn tươi' },
    description: {
      de: 'Leichte, frische Rollen mit Reisnudeln, Kräutern, Tofu und Gemüse. Serviert mit unserer hausgemachten Erdnuss-Sauce.',
      vi: 'Cuốn tươi thanh mát với bún, rau thơm, đậu hũ và rau củ. Dùng kèm nước chấm đậu phộng nhà làm.',
    },
    price: 6.9,
    category: 'starters',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'bestseller'],
    image: '/images/dishes/summer-rolls.jpg',
    ingredients: {
      de: ['Reispapier', 'Reisnudeln', 'Räuchertofu', 'Karotte', 'Gurke', 'Thai-Basilikum', 'Minze', 'Koriander'],
      vi: ['Bánh tráng', 'Bún tươi', 'Đậu hũ hun khói', 'Cà rốt', 'Dưa leo', 'Húng quế', 'Bạc hà', 'Ngò rí'],
    },
    allergens: { de: ['Erdnuss', 'Soja'], vi: ['Đậu phộng', 'Đậu nành'] },
  },
  {
    id: 'cha-gio',
    nameVi: 'Chả Giò Chay',
    name: { de: 'Knusprige Frühlingsrollen', vi: 'Chả giò chay giòn' },
    description: {
      de: 'Goldbraun gebackene Rollen mit Glasnudeln, Taro und Shiitake. Mit Salat, Kräutern und Nước Chấm.',
      vi: 'Chả giò vàng giòn nhân miến, khoai môn và nấm hương. Ăn kèm rau sống và nước chấm chay.',
    },
    price: 7.5,
    category: 'starters',
    spice: 'mild',
    tags: ['vegan'],
    image: '/images/dishes/dipping-sauce.jpg',
    ingredients: {
      de: ['Weizenteigblätter', 'Glasnudeln', 'Taro', 'Shiitake', 'Karotte', 'Holzohrpilze'],
      vi: ['Bánh tráng cuốn', 'Miến', 'Khoai môn', 'Nấm hương', 'Cà rốt', 'Nấm mèo'],
    },
    allergens: { de: ['Gluten', 'Soja'], vi: ['Gluten', 'Đậu nành'] },
  },
  {
    id: 'goi-xoai',
    nameVi: 'Gỏi Xoài',
    name: { de: 'Grüner Mangosalat', vi: 'Gỏi xoài xanh' },
    description: {
      de: 'Knackiger Salat aus grüner Mango, Kräutern und gerösteten Erdnüssen mit Limetten-Chili-Dressing.',
      vi: 'Gỏi xoài xanh giòn với rau thơm, đậu phộng rang và nước trộn chanh ớt.',
    },
    price: 8.5,
    category: 'starters',
    spice: 'medium',
    tags: ['vegan', 'glutenFree', 'spicy'],
    image: '/images/story/story-ingredients.jpg',
    ingredients: {
      de: ['Grüne Mango', 'Karotte', 'Röstzwiebeln', 'Erdnüsse', 'Thai-Basilikum', 'Limette', 'Chili'],
      vi: ['Xoài xanh', 'Cà rốt', 'Hành phi', 'Đậu phộng', 'Húng quế', 'Chanh', 'Ớt'],
    },
    allergens: { de: ['Erdnuss'], vi: ['Đậu phộng'] },
  },
  {
    id: 'dau-hu-chien-sa',
    nameVi: 'Đậu Hũ Chiên Sả',
    name: { de: 'Zitronengras-Tofu', vi: 'Đậu hũ chiên sả' },
    description: {
      de: 'Knusprig gebackener Tofu mit frischem Zitronengras, Chili und Frühlingszwiebeln.',
      vi: 'Đậu hũ chiên giòn với sả tươi, ớt và hành lá.',
    },
    price: 7.9,
    category: 'starters',
    spice: 'medium',
    tags: ['vegan', 'glutenFree', 'spicy'],
    image: '/images/dishes/tofu-asparagus.jpg',
    ingredients: {
      de: ['Tofu', 'Zitronengras', 'Chili', 'Frühlingszwiebel', 'Knoblauch'],
      vi: ['Đậu hũ', 'Sả', 'Ớt', 'Hành lá', 'Tỏi'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },

  // ------------------------------------------------------------------- Soups
  {
    id: 'pho-chay',
    nameVi: 'Phở Chay',
    name: { de: 'Vegane Pho', vi: 'Phở chay' },
    description: {
      de: 'Eine duftende vietnamesische Nudelsuppe mit reicher Kräuterbrühe, Tofu, Pilzen und frischen Kräutern.',
      vi: 'Phở thơm lừng với nước dùng thảo mộc đậm đà, đậu hũ, nấm và rau thơm tươi.',
    },
    price: 12.9,
    category: 'soups',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'bestseller'],
    image: '/images/dishes/vegan-pho.jpg',
    ingredients: {
      de: ['Reisbandnudeln', 'Gemüsebrühe mit Zimt, Sternanis & Ingwer', 'Tofu', 'Kräuterseitling', 'Sojasprossen', 'Thai-Basilikum', 'Limette'],
      vi: ['Bánh phở', 'Nước dùng quế, hồi, gừng', 'Đậu hũ', 'Nấm đùi gà', 'Giá đỗ', 'Húng quế', 'Chanh'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'bun-rieu-chay',
    nameVi: 'Bún Riêu Chay',
    name: { de: 'Vegane Tomaten-Tofu-Suppe', vi: 'Bún riêu chay' },
    description: {
      de: 'Kräftige Tomatenbrühe mit seidigem Tofu, Ananas und Reisnudeln – herzhaft und leicht säuerlich.',
      vi: 'Nước dùng cà chua đậm đà với đậu hũ non, dứa và bún – chua dịu, đậm vị.',
    },
    price: 13.5,
    category: 'soups',
    spice: 'medium',
    tags: ['vegan', 'glutenFree'],
    image: '/images/dishes/hu-tieu-bowl.jpg',
    ingredients: {
      de: ['Reisnudeln', 'Tomate', 'Seidentofu', 'Ananas', 'Tofu-Riebel', 'Perilla'],
      vi: ['Bún', 'Cà chua', 'Đậu hũ non', 'Dứa', 'Riêu chay', 'Tía tô'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'canh-chua-chay',
    nameVi: 'Canh Chua Chay',
    name: { de: 'Süßsaure Gemüsesuppe', vi: 'Canh chua chay' },
    description: {
      de: 'Südvietnamesische süßsaure Suppe mit Tamarinde, Ananas, Okra und viel Reisfeldkraut.',
      vi: 'Canh chua miền Nam với me, dứa, đậu bắp và rau ngổ thơm.',
    },
    price: 11.5,
    category: 'soups',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/story/story-pho-bowl.jpg',
    ingredients: {
      de: ['Tamarinde', 'Ananas', 'Okra', 'Tomate', 'Taro-Stiel', 'Reisfeldkraut', 'Tofu'],
      vi: ['Me', 'Dứa', 'Đậu bắp', 'Cà chua', 'Bạc hà', 'Rau ngổ', 'Đậu hũ'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },

  // ----------------------------------------------------------------- Noodles
  {
    id: 'bun-cha-chay',
    nameVi: 'Bún Chả Chay',
    name: { de: 'Gegrillter Tofu mit Reisnudeln', vi: 'Bún chả chay' },
    description: {
      de: 'Über Holzkohle gegrillter Tofu und Pilze mit Reisnudeln, Kräutersalat und lauwarmem Nước Chấm.',
      vi: 'Đậu hũ và nấm nướng than với bún, rau sống và nước chấm ấm.',
    },
    price: 14.5,
    category: 'noodles',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'bestseller'],
    image: '/images/dishes/glass-noodles.jpg',
    ingredients: {
      de: ['Reisnudeln', 'Gegrillter Tofu', 'Kräuterseitling', 'Salat', 'Kräuter', 'Eingelegte Papaya'],
      vi: ['Bún', 'Đậu hũ nướng', 'Nấm đùi gà', 'Xà lách', 'Rau thơm', 'Đu đủ ngâm'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'mien-xao-chay',
    nameVi: 'Miến Xào Chay',
    name: { de: 'Gebratene Glasnudeln', vi: 'Miến xào chay' },
    description: {
      de: 'Im Wok gebratene Glasnudeln mit Shiitake, Karotte, Sellerie und Sojasprossen.',
      vi: 'Miến xào với nấm hương, cà rốt, cần tây và giá đỗ.',
    },
    price: 13.9,
    category: 'noodles',
    spice: 'mild',
    tags: ['vegan', 'glutenFree'],
    image: '/images/dishes/glass-noodles.jpg',
    ingredients: {
      de: ['Glasnudeln', 'Shiitake', 'Karotte', 'Sellerie', 'Sojasprossen', 'Frühlingszwiebel'],
      vi: ['Miến', 'Nấm hương', 'Cà rốt', 'Cần tây', 'Giá đỗ', 'Hành lá'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'bun-bo-hue-chay',
    nameVi: 'Bún Bò Huế Chay',
    name: { de: 'Scharfe Zitronengras-Nudelsuppe', vi: 'Bún bò Huế chay' },
    description: {
      de: 'Die feurige Suppe aus Huế – rein pflanzlich, mit Zitronengras, Chili-Öl und Seitan.',
      vi: 'Món bún trứ danh xứ Huế phiên bản chay, đậm vị sả và ớt sa tế.',
    },
    price: 14.9,
    category: 'noodles',
    spice: 'hot',
    tags: ['vegan', 'spicy'],
    image: '/images/dishes/hu-tieu-bowl.jpg',
    ingredients: {
      de: ['Dicke Reisnudeln', 'Zitronengrasbrühe', 'Seitan', 'Tofu', 'Chili-Öl', 'Bananenblüte'],
      vi: ['Bún sợi to', 'Nước dùng sả', 'Mì căn', 'Đậu hũ', 'Sa tế', 'Bắp chuối'],
    },
    allergens: { de: ['Gluten', 'Soja'], vi: ['Gluten', 'Đậu nành'] },
  },
  {
    id: 'pho-xao',
    nameVi: 'Phở Xào Chay',
    name: { de: 'Gebratene Pho-Nudeln', vi: 'Phở xào chay' },
    description: {
      de: 'Breite Reisnudeln aus dem Wok mit Tofu, Pak Choi und schwarzer Pfeffersauce.',
      vi: 'Bánh phở xào với đậu hũ, cải thìa và sốt tiêu đen.',
    },
    price: 14.5,
    category: 'noodles',
    spice: 'medium',
    tags: ['vegan'],
    image: '/images/dishes/tofu-asparagus.jpg',
    ingredients: {
      de: ['Reisbandnudeln', 'Tofu', 'Pak Choi', 'Zwiebel', 'Schwarze Pfeffersauce'],
      vi: ['Bánh phở', 'Đậu hũ', 'Cải thìa', 'Hành tây', 'Sốt tiêu đen'],
    },
    allergens: { de: ['Gluten', 'Soja'], vi: ['Gluten', 'Đậu nành'] },
  },

  // -------------------------------------------------------------------- Rice
  {
    id: 'com-tam-chay',
    nameVi: 'Cơm Tấm Chay',
    name: { de: 'Bruchreis mit Zitronengras-Tofu', vi: 'Cơm tấm chay' },
    description: {
      de: 'Duftender Bruchreis mit gegrilltem Zitronengras-Tofu, eingelegtem Gemüse und Frühlingszwiebelöl.',
      vi: 'Cơm tấm thơm với đậu hũ nướng sả, đồ chua và mỡ hành chay.',
    },
    price: 13.9,
    category: 'rice',
    spice: 'mild',
    tags: ['vegan', 'glutenFree'],
    image: '/images/dishes/garden-bowl.jpg',
    ingredients: {
      de: ['Bruchreis', 'Zitronengras-Tofu', 'Eingelegte Karotte & Rettich', 'Gurke', 'Frühlingszwiebelöl'],
      vi: ['Cơm tấm', 'Đậu hũ nướng sả', 'Đồ chua', 'Dưa leo', 'Mỡ hành chay'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'com-chien-hat-sen',
    nameVi: 'Cơm Chiên Hạt Sen',
    name: { de: 'Gebratener Reis mit Lotussamen', vi: 'Cơm chiên hạt sen' },
    description: {
      de: 'Gebratener Jasminreis mit Lotussamen, Edamame, Karotte und Shiitake.',
      vi: 'Cơm chiên hạt sen với đậu edamame, cà rốt và nấm hương.',
    },
    price: 13.5,
    category: 'rice',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/dishes/garden-bowl.jpg',
    ingredients: {
      de: ['Jasminreis', 'Lotussamen', 'Edamame', 'Karotte', 'Shiitake', 'Frühlingszwiebel'],
      vi: ['Gạo jasmine', 'Hạt sen', 'Đậu edamame', 'Cà rốt', 'Nấm hương', 'Hành lá'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'vegan-garden-bowl',
    nameVi: 'Cơm Gạo Lứt Vegan Garden',
    name: { de: 'Vegan Garden Bowl', vi: 'Vegan Garden Bowl' },
    description: {
      de: 'Eine vollwertige Schale mit braunem Reis, Tofu, frischem Gemüse, Kräutern und unserer Erdnuss-Signature-Sauce.',
      vi: 'Tô cơm gạo lứt đầy đặn với đậu hũ, rau củ tươi, rau thơm và sốt đậu phộng đặc trưng.',
    },
    price: 15.5,
    category: 'rice',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'bestseller'],
    image: '/images/dishes/garden-bowl.jpg',
    ingredients: {
      de: ['Brauner Reis', 'Tofu', 'Karotte', 'Gurke', 'Rotkohl', 'Sojasprossen', 'Erdnuss-Sauce', 'Kräuter'],
      vi: ['Gạo lứt', 'Đậu hũ', 'Cà rốt', 'Dưa leo', 'Bắp cải tím', 'Giá đỗ', 'Sốt đậu phộng', 'Rau thơm'],
    },
    allergens: { de: ['Erdnuss', 'Soja'], vi: ['Đậu phộng', 'Đậu nành'] },
  },

  // ------------------------------------------------------------------- Mains
  {
    id: 'dau-hu-mang-tay',
    nameVi: 'Đậu Hũ Sốt Tiêu & Măng Tây',
    name: { de: 'Tofu & Spargel', vi: 'Đậu hũ măng tây sốt tiêu' },
    description: {
      de: 'Im Wok gebratener Tofu mit Spargel, Pilzen und einer würzigen Knoblauch-Pfeffer-Sauce.',
      vi: 'Đậu hũ xào măng tây, nấm và sốt tiêu đen tỏi thơm nồng.',
    },
    price: 16.9,
    category: 'mains',
    spice: 'medium',
    tags: ['vegan', 'bestseller'],
    image: '/images/dishes/tofu-asparagus.jpg',
    ingredients: {
      de: ['Tofu', 'Grüner Spargel', 'Kräuterseitling', 'Knoblauch', 'Schwarzer Pfeffer', 'Chili'],
      vi: ['Đậu hũ', 'Măng tây', 'Nấm đùi gà', 'Tỏi', 'Tiêu đen', 'Ớt'],
    },
    allergens: { de: ['Gluten', 'Soja'], vi: ['Gluten', 'Đậu nành'] },
  },
  {
    id: 'ca-ri-chay',
    nameVi: 'Cà Ri Chay',
    name: { de: 'Vietnamesisches Kokos-Curry', vi: 'Cà ri chay' },
    description: {
      de: 'Mildes Curry mit Kokosmilch, Süßkartoffel, Taro und Tofu. Dazu Baguette oder Reis.',
      vi: 'Cà ri nước cốt dừa dịu nhẹ với khoai lang, khoai môn và đậu hũ. Dùng kèm bánh mì hoặc cơm.',
    },
    price: 15.9,
    category: 'mains',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/dishes/lemongrass-bowl.jpg',
    ingredients: {
      de: ['Kokosmilch', 'Süßkartoffel', 'Taro', 'Tofu', 'Karotte', 'Zitronengras', 'Currypulver'],
      vi: ['Nước cốt dừa', 'Khoai lang', 'Khoai môn', 'Đậu hũ', 'Cà rốt', 'Sả', 'Bột cà ri'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'nam-kho-to',
    nameVi: 'Nấm Kho Tộ',
    name: { de: 'Geschmorte Pilze im Tontopf', vi: 'Nấm kho tộ' },
    description: {
      de: 'Im Tontopf geschmorte Pilze in Karamellsauce mit Kokoswasser und schwarzem Pfeffer.',
      vi: 'Nấm kho trong niêu đất với nước dừa, nước màu và tiêu đen.',
    },
    price: 16.5,
    category: 'mains',
    spice: 'medium',
    tags: ['vegan', 'glutenFree'],
    image: '/images/dishes/lemongrass-bowl.jpg',
    ingredients: {
      de: ['Shiitake', 'Kräuterseitling', 'Kokoswasser', 'Karamellsauce', 'Chili', 'Frühlingszwiebel'],
      vi: ['Nấm hương', 'Nấm đùi gà', 'Nước dừa', 'Nước màu', 'Ớt', 'Hành lá'],
    },
    allergens: { de: ['Soja'], vi: ['Đậu nành'] },
  },
  {
    id: 'bo-luc-lac-chay',
    nameVi: 'Bò Lúc Lắc Chay',
    name: { de: 'Shaking "Beef" aus Seitan', vi: 'Bò lúc lắc chay' },
    description: {
      de: 'Seitan-Würfel scharf angebraten mit Zwiebel und Paprika, dazu Kressesalat und Limettenpfeffer.',
      vi: 'Mì căn áp chảo với hành tây, ớt chuông, ăn kèm xà lách xoong và muối tiêu chanh.',
    },
    price: 17.9,
    category: 'mains',
    spice: 'medium',
    tags: ['vegan'],
    image: '/images/dishes/tofu-asparagus.jpg',
    ingredients: {
      de: ['Seitan', 'Zwiebel', 'Paprika', 'Brunnenkresse', 'Limette', 'Schwarzer Pfeffer'],
      vi: ['Mì căn', 'Hành tây', 'Ớt chuông', 'Xà lách xoong', 'Chanh', 'Tiêu đen'],
    },
    allergens: { de: ['Gluten', 'Soja'], vi: ['Gluten', 'Đậu nành'] },
  },

  // ---------------------------------------------------------------- Desserts
  {
    id: 'che-dau-xanh',
    nameVi: 'Chè Đậu Xanh',
    name: { de: 'Mungbohnen-Dessert', vi: 'Chè đậu xanh' },
    description: {
      de: 'Warmes Mungbohnen-Dessert mit Kokoscreme und einem Hauch Pandan.',
      vi: 'Chè đậu xanh ấm với nước cốt dừa và hương lá dứa.',
    },
    price: 5.5,
    category: 'desserts',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/dishes/dipping-sauce.jpg',
    ingredients: {
      de: ['Mungbohnen', 'Kokosmilch', 'Pandan', 'Rohrzucker'],
      vi: ['Đậu xanh', 'Nước cốt dừa', 'Lá dứa', 'Đường thốt nốt'],
    },
  },
  {
    id: 'chuoi-nuong',
    nameVi: 'Chuối Nướng Nước Cốt Dừa',
    name: { de: 'Gegrillte Banane mit Kokos', vi: 'Chuối nướng nước cốt dừa' },
    description: {
      de: 'Im Bananenblatt gegrillte Banane mit Klebreis, Kokossauce und Sesam.',
      vi: 'Chuối nướng lá chuối với nếp, nước cốt dừa và mè rang.',
    },
    price: 6.5,
    category: 'desserts',
    spice: 'mild',
    tags: ['vegan', 'glutenFree'],
    image: '/images/dishes/dipping-sauce.jpg',
    ingredients: {
      de: ['Banane', 'Klebreis', 'Kokosmilch', 'Sesam'],
      vi: ['Chuối', 'Nếp', 'Nước cốt dừa', 'Mè rang'],
    },
    allergens: { de: ['Sesam'], vi: ['Mè'] },
  },
  {
    id: 'kem-dua',
    nameVi: 'Kem Dừa',
    name: { de: 'Kokoseis in der Nuss', vi: 'Kem dừa' },
    description: {
      de: 'Hausgemachtes Kokoseis, serviert in der jungen Kokosnuss mit gerösteten Erdnüssen.',
      vi: 'Kem dừa nhà làm, phục vụ trong trái dừa non với đậu phộng rang.',
    },
    price: 7.5,
    category: 'desserts',
    spice: 'mild',
    tags: ['vegan', 'glutenFree'],
    image: '/images/misc/vase-greenery.jpg',
    ingredients: {
      de: ['Kokosnuss', 'Kokosmilch', 'Erdnüsse', 'Rohrzucker'],
      vi: ['Dừa non', 'Nước cốt dừa', 'Đậu phộng', 'Đường mía'],
    },
    allergens: { de: ['Erdnuss'], vi: ['Đậu phộng'] },
  },

  // ------------------------------------------------------------------- Drinks
  {
    id: 'tra-sen',
    nameVi: 'Trà Sen Vàng',
    name: { de: 'Goldener Lotustee', vi: 'Trà sen vàng' },
    description: {
      de: 'Grüner Tee mit Lotusblüte – heiß oder auf Eis serviert.',
      vi: 'Trà xanh ướp hoa sen – dùng nóng hoặc đá.',
    },
    price: 4.5,
    category: 'drinks',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/gallery/tea-and-plants.jpg',
    ingredients: {
      de: ['Grüner Tee', 'Lotusblüte'],
      vi: ['Trà xanh', 'Hoa sen'],
    },
  },
  {
    id: 'nuoc-chanh-sa',
    nameVi: 'Nước Chanh Sả',
    name: { de: 'Zitronengras-Limonade', vi: 'Nước chanh sả' },
    description: {
      de: 'Hausgemachte Limonade mit frischem Zitronengras, Limette und Minze.',
      vi: 'Nước chanh sả nhà làm với sả tươi, chanh và bạc hà.',
    },
    price: 4.9,
    category: 'drinks',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/story/story-ingredients.jpg',
    ingredients: {
      de: ['Zitronengras', 'Limette', 'Minze', 'Rohrzucker', 'Soda'],
      vi: ['Sả', 'Chanh', 'Bạc hà', 'Đường mía', 'Soda'],
    },
  },
  {
    id: 'ca-phe-dua',
    nameVi: 'Cà Phê Sữa Dừa',
    name: { de: 'Vietnamesischer Kokos-Kaffee', vi: 'Cà phê sữa dừa' },
    description: {
      de: 'Robusta-Filterkaffee mit cremiger Kokosmilch, heiß oder eiskalt.',
      vi: 'Cà phê phin robusta với nước cốt dừa béo ngậy, nóng hoặc đá.',
    },
    price: 4.9,
    category: 'drinks',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/misc/candle-lantern.jpg',
    ingredients: {
      de: ['Robusta-Kaffee', 'Kokosmilch', 'Rohrzucker'],
      vi: ['Cà phê robusta', 'Nước cốt dừa', 'Đường mía'],
    },
  },
  {
    id: 'sinh-to-bo',
    nameVi: 'Sinh Tố Bơ',
    name: { de: 'Avocado-Smoothie', vi: 'Sinh tố bơ' },
    description: {
      de: 'Cremiger Avocado-Smoothie mit Kokosmilch – süß, sättigend, typisch vietnamesisch.',
      vi: 'Sinh tố bơ béo mịn với nước cốt dừa – ngọt dịu, đậm chất Việt.',
    },
    price: 5.9,
    category: 'drinks',
    spice: 'mild',
    tags: ['vegan', 'glutenFree', 'nutFree'],
    image: '/images/misc/vase-greenery.jpg',
    ingredients: {
      de: ['Avocado', 'Kokosmilch', 'Rohrzucker', 'Eis'],
      vi: ['Bơ', 'Nước cốt dừa', 'Đường mía', 'Đá'],
    },
  },
]

/** Order in which categories appear in the filter bar and on the menu page. */
export const menuCategories: MenuCategory[] = [
  'starters',
  'soups',
  'noodles',
  'rice',
  'mains',
  'desserts',
  'drinks',
]

/** The four dishes shown in the "Signature Dishes" section of the mock-up. */
export const signatureDishIds = ['pho-chay', 'goi-cuon', 'dau-hu-mang-tay', 'vegan-garden-bowl']

export const signatureDishes = signatureDishIds
  .map((id) => dishes.find((dish) => dish.id === id))
  .filter((dish): dish is Dish => Boolean(dish))

export function getDish(id: string) {
  return dishes.find((dish) => dish.id === id)
}
