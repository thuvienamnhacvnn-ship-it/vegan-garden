import type { Review } from '@/types'

/** Sample guest voices - replace with real, permission-cleared reviews. */
export const reviews: Review[] = [
  {
    id: 'lena',
    author: 'Lena M.',
    origin: { de: 'Berlin-Friedrichshain', vi: 'Berlin-Friedrichshain' },
    rating: 5,
    source: 'google',
    text: {
      de: 'Die beste vegane Pho, die ich in Berlin gegessen habe. Die Brühe schmeckt nach Stunden Arbeit – und der Raum ist so ruhig, dass man das Handy einfach liegen lässt.',
      vi: 'Tô phở chay ngon nhất tôi từng ăn ở Berlin. Nước dùng đậm đà thấy rõ công sức – và không gian yên đến mức tôi để quên cả điện thoại.',
    },
  },
  {
    id: 'tuan',
    author: 'Tuấn N.',
    origin: { de: 'Hamburg', vi: 'Hamburg' },
    rating: 5,
    source: 'tripadvisor',
    text: {
      de: 'Als Vietnamese war ich skeptisch, ob rein pflanzlich funktioniert. Das Bún Chả Chay hat mich sofort überzeugt – es schmeckt nach zu Hause.',
      vi: 'Là người Việt, tôi khá dè dặt với đồ chay. Nhưng bún chả chay ở đây làm tôi thuyết phục ngay – vị đúng như ở nhà.',
    },
  },
  {
    id: 'sophie',
    author: 'Sophie K.',
    origin: { de: 'Berlin-Kreuzberg', vi: 'Berlin-Kreuzberg' },
    rating: 5,
    source: 'google',
    text: {
      de: 'Wunderschöner Ort mit viel Grün. Das Team hat meine Glutenunverträglichkeit ernst genommen und mir jedes Gericht erklärt. Sehr aufmerksam.',
      vi: 'Không gian rất đẹp, nhiều cây xanh. Nhân viên rất chú ý đến việc tôi không ăn được gluten và giải thích từng món. Rất chu đáo.',
    },
  },
  {
    id: 'marco',
    author: 'Marco B.',
    origin: { de: 'Berlin-Mitte', vi: 'Berlin-Mitte' },
    rating: 4,
    source: 'guest',
    text: {
      de: 'Ich esse sonst Fleisch und war zum Geschäftsessen hier. Der Tofu mit Spargel war so gut, dass ich das Fleisch nicht vermisst habe.',
      vi: 'Tôi vốn ăn mặn và tới đây trong một bữa tiếp khách. Món đậu hũ măng tây ngon đến mức tôi chẳng nhớ tới thịt.',
    },
  },
  {
    id: 'anh',
    author: 'Anh T.',
    origin: { de: 'Berlin-Lichtenberg', vi: 'Berlin-Lichtenberg' },
    rating: 5,
    source: 'guest',
    text: {
      de: 'Wir feiern hier jedes Jahr den Geburtstag meiner Mutter. Das Team stellt die Tische zusammen, bringt Tee und lässt uns einfach Zeit haben.',
      vi: 'Năm nào gia đình tôi cũng mừng sinh nhật mẹ ở đây. Nhân viên ghép bàn, mang trà ra và để chúng tôi thong thả bên nhau.',
    },
  },
  {
    id: 'jonas',
    author: 'Jonas W.',
    origin: { de: 'Potsdam', vi: 'Potsdam' },
    rating: 5,
    source: 'tripadvisor',
    text: {
      de: 'Preis-Leistung stimmt, die Portionen sind ehrlich und der Kokos-Kaffee zum Abschluss ist Pflicht. Wir kommen jetzt regelmäßig aus Potsdam her.',
      vi: 'Giá hợp lý, phần ăn đầy đặn, và ly cà phê dừa cuối bữa thì nhất định phải thử. Giờ chúng tôi từ Potsdam sang đây thường xuyên.',
    },
  },
]

export const averageRating =
  Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
