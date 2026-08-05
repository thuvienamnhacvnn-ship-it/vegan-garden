import type { Localized } from '@/types'

/**
 * Long-form legal copy. Blocks marked with [PLATZHALTER] must be completed by
 * the operator with their real company data before the site goes live.
 */
export interface LegalSection {
  heading: Localized
  paragraphs: Localized<string[]>
}

export interface LegalPage {
  title: Localized
  intro: Localized
  updated: string
  sections: LegalSection[]
}

export const impressum: LegalPage = {
  title: { de: 'Impressum', vi: 'Thông tin pháp lý (Impressum)' },
  intro: {
    de: 'Angaben gemäß § 5 TMG.',
    vi: 'Thông tin theo § 5 Luật Truyền thông điện tử Đức (TMG).',
  },
  updated: '2026-08-01',
  sections: [
    {
      heading: { de: 'Anbieter', vi: 'Đơn vị vận hành' },
      paragraphs: {
        de: [
          'Vegan Garden Berlin [PLATZHALTER: vollständige Firmierung, z. B. Vegan Garden Berlin GmbH]',
          'Frankfurter Allee 21, 10247 Berlin, Deutschland',
          'Vertreten durch: [PLATZHALTER: Name der Geschäftsführung]',
        ],
        vi: [
          'Vegan Garden Berlin [CHỖ TRỐNG: tên pháp lý đầy đủ, ví dụ Vegan Garden Berlin GmbH]',
          'Frankfurter Allee 21, 10247 Berlin, Đức',
          'Người đại diện: [CHỖ TRỐNG: tên người đại diện]',
        ],
      },
    },
    {
      heading: { de: 'Kontakt', vi: 'Liên hệ' },
      paragraphs: {
        de: [
          'Telefon: +49 30 120 88 89 2 [aus dem Entwurf – vor Livegang bestätigen]',
          'E-Mail: info@vegangarden-berlin.de [aus dem Entwurf – vor Livegang bestätigen]',
        ],
        vi: [
          'Điện thoại: +49 30 120 88 89 2 [lấy từ bản thiết kế – cần xác nhận]',
          'Email: info@vegangarden-berlin.de [lấy từ bản thiết kế – cần xác nhận]',
        ],
      },
    },
    {
      heading: { de: 'Registereintrag & Umsatzsteuer', vi: 'Đăng ký doanh nghiệp & thuế' },
      paragraphs: {
        de: [
          'Registergericht: [PLATZHALTER] · Registernummer: [PLATZHALTER]',
          'Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: [PLATZHALTER]',
        ],
        vi: [
          'Toà án đăng ký: [CHỖ TRỐNG] · Số đăng ký: [CHỖ TRỐNG]',
          'Mã số thuế GTGT theo § 27 a UStG: [CHỖ TRỐNG]',
        ],
      },
    },
    {
      heading: {
        de: 'Verantwortlich für den Inhalt',
        vi: 'Chịu trách nhiệm nội dung',
      },
      paragraphs: {
        de: ['Nach § 18 Abs. 2 MStV: [PLATZHALTER: Name], Frankfurter Allee 21, 10247 Berlin.'],
        vi: ['Theo § 18 khoản 2 MStV: [CHỖ TRỐNG: họ tên], Frankfurter Allee 21, 10247 Berlin.'],
      },
    },
    {
      heading: { de: 'EU-Streitschlichtung', vi: 'Giải quyết tranh chấp EU' },
      paragraphs: {
        de: [
          'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/',
          'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        ],
        vi: [
          'Uỷ ban châu Âu cung cấp nền tảng giải quyết tranh chấp trực tuyến: https://ec.europa.eu/consumers/odr/',
          'Chúng tôi không có nghĩa vụ và không tham gia thủ tục hoà giải trước cơ quan hoà giải tiêu dùng.',
        ],
      },
    },
    {
      heading: { de: 'Bildnachweis', vi: 'Bản quyền hình ảnh' },
      paragraphs: {
        de: ['Alle Fotos und das Logo: Vegan Garden Berlin, sofern nicht anders angegeben.'],
        vi: ['Toàn bộ hình ảnh và logo thuộc Vegan Garden Berlin, trừ khi có ghi chú khác.'],
      },
    },
  ],
}

export const privacy: LegalPage = {
  title: { de: 'Datenschutzerklärung', vi: 'Chính sách bảo mật' },
  intro: {
    de: 'Wir behandeln Ihre personenbezogenen Daten vertraulich und nach der Datenschutz-Grundverordnung (DSGVO) sowie dieser Datenschutzerklärung.',
    vi: 'Chúng tôi xử lý dữ liệu cá nhân của bạn một cách bảo mật, tuân theo Quy định chung về bảo vệ dữ liệu (GDPR) và chính sách này.',
  },
  updated: '2026-08-01',
  sections: [
    {
      heading: { de: 'Verantwortliche Stelle', vi: 'Đơn vị chịu trách nhiệm' },
      paragraphs: {
        de: [
          'Verantwortlich im Sinne der DSGVO ist der im Impressum genannte Anbieter, Frankfurter Allee 21, 10247 Berlin.',
          'Für Fragen zum Datenschutz erreichen Sie uns unter info@vegangarden-berlin.de.',
        ],
        vi: [
          'Đơn vị chịu trách nhiệm theo GDPR là bên vận hành nêu trong Impressum, Frankfurter Allee 21, 10247 Berlin.',
          'Mọi câu hỏi về bảo vệ dữ liệu, vui lòng liên hệ info@vegangarden-berlin.de.',
        ],
      },
    },
    {
      heading: { de: 'Reservierungen', vi: 'Dữ liệu đặt bàn' },
      paragraphs: {
        de: [
          'Bei einer Tischreservierung verarbeiten wir Name, E-Mail-Adresse, Telefonnummer, Datum, Uhrzeit, Gästezahl sowie freiwillige Angaben zu Allergien und Wünschen.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen). Die Daten werden ausschließlich zur Bearbeitung Ihrer Reservierung genutzt und nach spätestens 6 Monaten gelöscht, soweit keine gesetzlichen Aufbewahrungsfristen entgegenstehen.',
        ],
        vi: [
          'Khi bạn đặt bàn, chúng tôi xử lý họ tên, email, số điện thoại, ngày, giờ, số khách và các thông tin tự nguyện về dị ứng hoặc yêu cầu riêng.',
          'Cơ sở pháp lý là Điều 6 khoản 1 điểm b GDPR. Dữ liệu chỉ dùng để xử lý yêu cầu đặt bàn và được xoá chậm nhất sau 6 tháng, trừ khi có nghĩa vụ lưu trữ theo luật.',
        ],
      },
    },
    {
      heading: { de: 'Online-Bestellungen', vi: 'Dữ liệu đặt món online' },
      paragraphs: {
        de: [
          'Für Abholung und Lieferung verarbeiten wir zusätzlich die Bestellpositionen sowie – bei Lieferung – Ihre Lieferadresse.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Handels- und steuerrechtliche Aufbewahrungsfristen bleiben unberührt.',
        ],
        vi: [
          'Với đơn đến lấy hoặc giao hàng, chúng tôi xử lý thêm danh sách món và – nếu giao hàng – địa chỉ nhận.',
          'Cơ sở pháp lý là Điều 6 khoản 1 điểm b GDPR. Các thời hạn lưu trữ theo luật thương mại và thuế vẫn được áp dụng.',
        ],
      },
    },
    {
      heading: { de: 'Lokale Speicherung im Browser', vi: 'Lưu trữ cục bộ trên trình duyệt' },
      paragraphs: {
        de: [
          'Diese Website setzt keine Tracking-Cookies. Wir speichern ausschließlich technisch notwendige Angaben in Ihrem Browser (localStorage): Ihre gewählte Sprache und den Inhalt Ihres Warenkorbs.',
          'Diese Daten verlassen Ihr Gerät nicht und können jederzeit über die Einstellungen Ihres Browsers gelöscht werden.',
        ],
        vi: [
          'Trang web không dùng cookie theo dõi. Chúng tôi chỉ lưu các thông tin kỹ thuật cần thiết trong trình duyệt của bạn (localStorage): ngôn ngữ bạn chọn và nội dung giỏ hàng.',
          'Dữ liệu này không rời khỏi thiết bị của bạn và có thể xoá bất cứ lúc nào trong phần cài đặt trình duyệt.',
        ],
      },
    },
    {
      heading: { de: 'Google Maps', vi: 'Google Maps' },
      paragraphs: {
        de: [
          'Auf der Kontaktseite binden wir eine Karte von Google Maps ein (Anbieter: Google Ireland Limited). Beim Laden der Karte wird Ihre IP-Adresse an Google übertragen.',
          'Rechtsgrundlage ist unser berechtigtes Interesse an einer einfachen Anfahrtsbeschreibung, Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: https://policies.google.com/privacy',
        ],
        vi: [
          'Trên trang liên hệ, chúng tôi nhúng bản đồ Google Maps (nhà cung cấp: Google Ireland Limited). Khi bản đồ tải, địa chỉ IP của bạn được gửi tới Google.',
          'Cơ sở pháp lý là lợi ích hợp pháp của chúng tôi trong việc chỉ đường, Điều 6 khoản 1 điểm f GDPR. Xem thêm: https://policies.google.com/privacy',
        ],
      },
    },
    {
      heading: { de: 'Newsletter', vi: 'Bản tin' },
      paragraphs: {
        de: [
          'Für den Newsletter verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer Einwilligung, Art. 6 Abs. 1 lit. a DSGVO.',
          'Sie können die Einwilligung jederzeit widerrufen, etwa über den Abmeldelink in jeder E-Mail.',
        ],
        vi: [
          'Với bản tin, chúng tôi xử lý địa chỉ email của bạn dựa trên sự đồng ý, Điều 6 khoản 1 điểm a GDPR.',
          'Bạn có thể rút lại sự đồng ý bất cứ lúc nào, ví dụ qua liên kết huỷ đăng ký trong mỗi email.',
        ],
      },
    },
    {
      heading: { de: 'Ihre Rechte', vi: 'Quyền của bạn' },
      paragraphs: {
        de: [
          'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Recht, einer Verarbeitung zu widersprechen.',
          'Zudem steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu, in Berlin bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.',
        ],
        vi: [
          'Bạn có quyền yêu cầu cung cấp thông tin, chỉnh sửa, xoá, hạn chế xử lý, chuyển dữ liệu và quyền phản đối việc xử lý.',
          'Bạn cũng có quyền khiếu nại với cơ quan giám sát, tại Berlin là Uỷ viên Bảo vệ dữ liệu và Tự do thông tin Berlin.',
        ],
      },
    },
    {
      heading: { de: 'Hosting und Serverlogs', vi: 'Hosting và nhật ký máy chủ' },
      paragraphs: {
        de: [
          'Beim Abruf der Website erhebt der Hosting-Anbieter automatisch Server-Logfiles (IP-Adresse, Zeitpunkt, abgerufene Seite, Browsertyp). Diese Daten dienen dem sicheren Betrieb und werden nach kurzer Zeit gelöscht.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.',
        ],
        vi: [
          'Khi bạn truy cập trang, nhà cung cấp hosting tự động ghi nhật ký máy chủ (địa chỉ IP, thời điểm, trang truy cập, loại trình duyệt). Dữ liệu này phục vụ vận hành an toàn và được xoá sau thời gian ngắn.',
          'Cơ sở pháp lý là Điều 6 khoản 1 điểm f GDPR.',
        ],
      },
    },
  ],
}

export const terms: LegalPage = {
  title: { de: 'Allgemeine Geschäftsbedingungen', vi: 'Điều khoản chung' },
  intro: {
    de: 'Diese Bedingungen gelten für Tischreservierungen sowie für Bestellungen zur Abholung und Lieferung über diese Website.',
    vi: 'Các điều khoản sau áp dụng cho việc đặt bàn cũng như đặt món để đến lấy hoặc giao hàng qua website này.',
  },
  updated: '2026-08-01',
  sections: [
    {
      heading: { de: 'Geltungsbereich', vi: 'Phạm vi áp dụng' },
      paragraphs: {
        de: [
          'Vertragspartner ist der im Impressum genannte Anbieter. Abweichende Bedingungen des Gastes gelten nur, wenn wir ihnen ausdrücklich schriftlich zustimmen.',
        ],
        vi: [
          'Bên ký kết là đơn vị nêu trong Impressum. Các điều khoản khác của khách chỉ có hiệu lực nếu chúng tôi đồng ý rõ ràng bằng văn bản.',
        ],
      },
    },
    {
      heading: { de: 'Reservierungen', vi: 'Đặt bàn' },
      paragraphs: {
        de: [
          'Eine Reservierungsanfrage über diese Website ist unverbindlich, bis wir sie bestätigen. Reservierte Tische halten wir 15 Minuten über die vereinbarte Zeit hinaus frei.',
          'Bitte sagen Sie uns rechtzeitig ab, wenn Sie nicht kommen können – so können wir den Tisch anderen Gästen anbieten.',
        ],
        vi: [
          'Yêu cầu đặt bàn qua website chưa ràng buộc cho đến khi chúng tôi xác nhận. Bàn đã đặt được giữ thêm 15 phút so với giờ hẹn.',
          'Vui lòng báo huỷ sớm nếu bạn không thể đến – để chúng tôi sắp xếp bàn cho khách khác.',
        ],
      },
    },
    {
      heading: { de: 'Bestellungen und Preise', vi: 'Đơn hàng và giá' },
      paragraphs: {
        de: [
          'Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. Der Vertrag kommt mit unserer Bestätigung der Bestellung zustande.',
          'Für Lieferungen gilt ein Mindestbestellwert; die Liefergebühr wird vor dem Absenden der Bestellung angezeigt.',
        ],
        vi: [
          'Mọi mức giá tính bằng Euro, đã bao gồm thuế GTGT theo luật. Hợp đồng hình thành khi chúng tôi xác nhận đơn hàng.',
          'Đơn giao hàng có giá trị tối thiểu; phí giao hàng được hiển thị trước khi bạn gửi đơn.',
        ],
      },
    },
    {
      heading: { de: 'Zahlung', vi: 'Thanh toán' },
      paragraphs: {
        de: [
          'In der aktuellen Version dieser Website wird bei Abholung bzw. bei Lieferung bezahlt. Eine Online-Zahlung ist vorbereitet, aber noch nicht aktiv.',
        ],
        vi: [
          'Ở phiên bản hiện tại của website, khách thanh toán khi đến lấy hoặc khi nhận hàng. Thanh toán online đã được chuẩn bị nhưng chưa kích hoạt.',
        ],
      },
    },
    {
      heading: { de: 'Widerrufsrecht', vi: 'Quyền huỷ đơn' },
      paragraphs: {
        de: [
          'Bei Lieferung von Speisen und Getränken, die schnell verderben können, besteht gemäß § 312 g Abs. 2 Nr. 2 und Nr. 4 BGB kein Widerrufsrecht.',
          'Bitte melden Sie sich umgehend telefonisch, wenn mit Ihrer Bestellung etwas nicht stimmt – wir finden eine Lösung.',
        ],
        vi: [
          'Với thực phẩm và đồ uống dễ hỏng, theo § 312 g khoản 2 mục 2 và 4 BGB, quyền huỷ đơn không được áp dụng.',
          'Nếu đơn hàng có vấn đề, vui lòng gọi ngay cho chúng tôi – chúng tôi sẽ cùng bạn tìm cách giải quyết.',
        ],
      },
    },
    {
      heading: { de: 'Allergene und Unverträglichkeiten', vi: 'Dị ứng và không dung nạp' },
      paragraphs: {
        de: [
          'Alle Gerichte sind rein pflanzlich. Wir arbeiten in einer offenen Küche; Spuren von Gluten, Soja, Sesam und Nüssen lassen sich nicht vollständig ausschließen.',
          'Bitte teilen Sie uns Allergien vor der Bestellung mit, damit wir Sie richtig beraten können.',
        ],
        vi: [
          'Tất cả món ăn đều thuần thực vật. Chúng tôi nấu trong bếp mở, nên không thể loại trừ hoàn toàn dấu vết gluten, đậu nành, mè và các loại hạt.',
          'Vui lòng thông báo tình trạng dị ứng trước khi đặt món để chúng tôi tư vấn chính xác.',
        ],
      },
    },
    {
      heading: { de: 'Anwendbares Recht', vi: 'Luật áp dụng' },
      paragraphs: {
        de: ['Es gilt deutsches Recht. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.'],
        vi: ['Áp dụng luật pháp Đức. Nơi giải quyết tranh chấp là Berlin, trong phạm vi luật cho phép.'],
      },
    },
  ],
}
