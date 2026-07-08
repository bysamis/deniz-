import Link from "next/link";

export const metadata = {
  title: "KVKK Aydınlatma Metni | Liman Koyu",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-sand px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg border border-teal-900/10 p-6 md:p-10">
        <p className="text-xs tracking-[0.25em] uppercase text-teal-800/60 mb-1">
          Liman Koyu
        </p>
        <h1 className="font-display text-2xl md:text-3xl text-teal-950 mb-1">
          Kişisel Verilerin Korunması Aydınlatma Metni
        </h1>
        <p className="text-xs text-teal-900/40 mb-8">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca
        </p>

        <div className="prose-sm text-sm leading-relaxed text-ink/85 flex flex-col gap-5">
          <section>
            <h2 className="font-semibold text-teal-950 mb-1">1. Veri Sorumlusu</h2>
            <p>
              İşbu aydınlatma metni, <strong>[TESİS TİCARİ UNVANI / İŞLETME ADI]</strong>{" "}
              (“İşletme”) tarafından, 6698 sayılı Kişisel Verilerin Korunması
              Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla, misafirlerimize
              ait kişisel verilerin işlenmesine ilişkin usul ve esaslar hakkında
              sizleri bilgilendirmek amacıyla hazırlanmıştır.
            </p>
            <p className="mt-2 text-xs text-teal-900/50">
              İşletme adresi, vergi kimlik no ve iletişim bilgileri: [BURAYA EKLEYİN]
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-teal-950 mb-1">
              2. İşlenen Kişisel Veriler
            </h2>
            <p>Rezervasyon ve konaklama süreçleri kapsamında aşağıdaki kişisel verileriniz işlenmektedir:</p>
            <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-0.5">
              <li>Kimlik bilgileri (ad, soyad, T.C. kimlik numarası)</li>
              <li>İletişim bilgileri (telefon numarası, e-posta adresi)</li>
              <li>Konaklama bilgileri (giriş/çıkış tarihleri, oda bilgisi, kişi sayısı)</li>
              <li>Birlikte konaklayan aile üyelerine ait kimlik bilgileri</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-teal-950 mb-1">
              3. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <p>Kişisel verileriniz;</p>
            <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-0.5">
              <li>Rezervasyon işlemlerinin gerçekleştirilmesi ve konaklama hizmetinin sunulması,</li>
              <li>
                1774 sayılı Kimlik Bildirme Kanunu ve ilgili mevzuat kapsamında
                misafir kimlik bilgilerinin yetkili kamu kurumlarına
                bildirilmesi de dahil olmak üzere yasal yükümlülüklerin
                yerine getirilmesi,
              </li>
              <li>Talep ve şikayetlerin takibi ve misafir memnuniyetinin sağlanması,</li>
              <li>İşletme kayıtlarının ve konaklama geçmişinin tutulması,</li>
            </ul>
            <p className="mt-1.5">amaçlarıyla, KVKK’nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde işlenmektedir.</p>
          </section>

          <section>
            <h2 className="font-semibold text-teal-950 mb-1">
              4. Kişisel Verilerin Aktarılması
            </h2>
            <p>
              Kişisel verileriniz, yasal yükümlülüklerimiz gereği yetkili kamu
              kurum ve kuruluşları ile (talep halinde) mevzuatın izin verdiği
              ölçüde paylaşılabilir. Verileriniz, açık rızanız ya da yasal
              zorunluluk olmaksızın üçüncü kişilerle ticari amaçla
              paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-teal-950 mb-1">
              5. Kişisel Verilerin Saklanma Süresi
            </h2>
            <p>
              Kişisel verileriniz, ilgili mevzuatta öngörülen süreler ve/veya
              işleme amacının gerektirdiği süre boyunca saklanır; bu sürelerin
              sonunda silinir, yok edilir veya anonim hale getirilir. Saklama
              süresi İşletme tarafından belirlenir ve mevzuatta öngörülen asgari
              sürelerden (örn. genel zamanaşımı süreleri) az olamaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-teal-950 mb-1">
              6. KVKK Madde 11 Kapsamındaki Haklarınız
            </h2>
            <p>KVKK’nın 11. maddesi uyarınca İşletmemize başvurarak;</p>
            <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-0.5">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>KVKK’da öngörülen şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
              <li>Yukarıdaki işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
              <li>İşlenen verinin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>
            <p className="mt-1.5">
              haklarına sahipsiniz. Talepleriniz için [İLETİŞİM E-POSTASI /
              TELEFONU] üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          <p className="text-xs text-teal-900/40 pt-2 border-t border-teal-900/10">
            Bu metin genel bir şablondur; işletmenize özgü bilgilerle
            (unvan, adres, iletişim, saklama süreleri) güncellenmeli ve
            yürürlükteki mevzuata uygunluğu bir hukuk danışmanına teyit
            ettirilmelidir.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-sm text-teal-800 hover:text-teal-900 underline"
        >
          ← Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
