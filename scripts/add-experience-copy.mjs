/**
 * Adds the copy for the 3D / QR experience tile to both message files.
 *
 *   node scripts/add-experience-copy.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const copy = {
  'src/messages/de.json': {
    eyebrow: '3D-Erlebnis',
    title: 'Sieh dein Gericht, bevor du bestellst',
    text: 'Scanne den Code und sieh unsere Signature Dishes in 3D auf deinem Tisch – Portionsgröße, Zutaten und Schärfe auf einen Blick.',
    scan: 'Mit der Kamera scannen',
    hint: 'Funktioniert direkt im Browser, keine App nötig.',
    qrAlt: 'QR-Code zur Speisekarte von Vegan Garden',
  },
  'src/messages/vi.json': {
    eyebrow: 'Trải nghiệm 3D',
    title: 'Xem món trước khi gọi',
    text: 'Quét mã để xem các món đặc trưng ở dạng 3D ngay trên bàn – khẩu phần, nguyên liệu và độ cay rõ ràng.',
    scan: 'Quét bằng camera',
    hint: 'Chạy thẳng trên trình duyệt, không cần cài app.',
    qrAlt: 'Mã QR dẫn tới thực đơn Vegan Garden',
  },
}

for (const [file, experience] of Object.entries(copy)) {
  const json = JSON.parse(readFileSync(file, 'utf8'))
  json.experience = experience
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
  console.log('added experience copy to', file)
}
