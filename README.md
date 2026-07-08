# Liman Koyu — Tatil Köyü Rezervasyon Panosu

Odaların dolu/boş durumunu, hangi misafirin hangi odada kaldığını ve geçmiş
konaklama kayıtlarını takip etmek için basit bir web uygulaması.

**Özellikler**
- Oda durumu paneli (dolu / boş, o anki misafir, sıradaki rezervasyon)
- Yeni rezervasyon oluşturma (mevcut veya yeni misafir ile), tarih çakışma kontrolü
- 14 günlük doluluk takvimi (oda × gün ızgarası)
- Oda bazlı tam geçmiş (kim, ne zaman kalmış)
- Misafir listesi ve her misafirin konaklama geçmişi
- Şifreli giriş — sadece yetkililer erişebilir
- Terminal / komut satırı gerekmeden, tarayıcıdan ilk kurulum

**Teknolojiler:** Next.js (App Router) · PostgreSQL + Prisma · Tailwind CSS

---

## Kod hiç bilmeyenler için: adım adım kurulum

Bilgisayarınızda hiçbir şey kurmanıza veya çalıştırmanıza gerek yok.
Her şey tarayıcıdan yapılır.

### 1. Adım — Dosyaları GitHub'a yükleyin

1. github.com adresine gidin, ücretsiz bir hesap açın (yoksa).
2. Sağ üstteki **+** işaretine, sonra **New repository**'e tıklayın.
3. Bir isim verin (örn. `resort-booking`) ve **Create repository**'e basın.
4. Açılan sayfada **"uploading an existing file"** yazan mavi linke tıklayın.
5. Bilgisayarınızda indirdiğiniz zip dosyasını **çıkartın** (sağ tık →
   "Extract" / "Ayıkla"). Çıkan `resort-booking` klasörünün **içindeki**
   tüm dosya ve klasörleri seçip GitHub'daki yükleme alanına sürükleyip
   bırakın.
6. Aşağıdaki **Commit changes** butonuna basın.

### 2. Adım — Vercel'e bağlayın

1. vercel.com adresine gidin, **"Continue with GitHub"** ile giriş yapın.
2. **Add New → Project**'e tıklayın.
3. Az önce oluşturduğunuz `resort-booking` reposunu bulup **Import**'a
   basın.
4. Henüz **Deploy**'a basmayın — önce aşağıdaki 3. adımı tamamlayın.

### 3. Adım — Veritabanı ekleyin (zorunlu)

Import ekranındayken veya proje oluştuktan sonra:

1. Üst menüden **Storage** sekmesine gidin.
2. **Create Database → Postgres** seçin (Neon altyapılı, ücretsiz).
3. Oluşturduktan sonra **Connect to Project** ile bu projeye bağlayın.
   Bu işlem `DATABASE_URL` değişkenini otomatik olarak ekler.

### 4. Adım — Gizli anahtar ekleyin (zorunlu)

1. Proje ayarlarında **Settings → Environment Variables**'a gidin.
2. Yeni bir değişken ekleyin:
   - **Key:** `AUTH_SECRET`
   - **Value:** herhangi uzun, rastgele bir metin (örn. klavyeden rastgele
     30-40 karakter yazabilirsiniz: `x7Jk29pQmz...` gibi)
3. **Save**'e basın.

### 5. Adım — Deploy edin

**Deploy** butonuna basın ve birkaç dakika bekleyin. Bittiğinde size bir
adres verilir, örn. `resort-booking-abcd.vercel.app`.

### 6. Adım — Yönetici hesabınızı oluşturun

1. Verilen adresi tarayıcıda açın. Giriş ekranı karşınıza çıkar.
2. Alttaki **"Yönetici hesabı oluştur"** linkine tıklayın.
3. Adınızı, bir kullanıcı adı ve şifre belirleyip **"Hesabı oluştur ve
   giriş yap"** butonuna basın.
4. Otomatik olarak ana sayfaya (Oda Durumu paneline) yönlendirilirsiniz. 🎉

Bundan sonra bu adres + kullanıcı adı/şifre ile her zaman giriş
yapabilirsiniz — telefondan da, bilgisayardan da.

---

## Kullanım

- **Panel (/):** Tüm odaları ve durumlarını gösterir, hızlıca yeni oda veya
  rezervasyon ekleyebilirsiniz.
- **Rezervasyonlar (/reservations):** 14 günlük doluluk takvimi ve tüm
  rezervasyonların listesi; buradan rezervasyon iptal edilebilir.
- **Misafirler (/guests):** Kayıtlı misafirler ve her birinin geçmiş
  konaklamaları.
- **Oda detayı (/rooms/[id]):** Bir odanın o anki misafiri, yaklaşan
  rezervasyonları ve tüm geçmişi.

## Sorun giderme

- **"Veritabanına bağlanılamadı" hatası:** Vercel projenizde bir Postgres
  veritabanı oluşturup bağladığınızdan emin olun (3. Adım).
- **Deploy başarısız oldu:** Vercel'deki proje sayfasında **Deployments**
  sekmesinden hata loguna bakın; genelde `DATABASE_URL` eksikliğinden
  kaynaklanır.
- **"Yönetici hesabı oluştur" linkine tıklayınca "zaten bir hesap var"
  diyor ama şifreyi bilmiyorum:** Vercel → Storage → veritabanınız →
  **Data** sekmesinden `User` tablosundaki kaydı silip `/setup`
  sayfasını tekrar ziyaret edebilirsiniz.

## Geliştiriciler için (opsiyonel)

Kod üzerinde değişiklik yapmak isterseniz, bilgisayarınızda Node.js
kurulu olması gerekir:

```bash
npm install
cp .env.example .env   # DATABASE_URL ve AUTH_SECRET değerlerini girin
npm run db:migrate     # tabloları oluşturur
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açıp `/setup` üzerinden yönetici
hesabı oluşturabilir, ya da `npm run db:seed` ile `.env`'deki
`SEED_ADMIN_*` değerlerini kullanarak terminalden de oluşturabilirsiniz.
