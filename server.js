const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.static('public'));

// Render.com gibi servisler için dinamik port ayarı, lokalde ise 3000 portu
const PORT = process.env.PORT || 3000;

// ÖNEMLİ: Render.com vb. servislerde sunucular genellikle bir proxy arkasında çalışır.
// Ziyaretçinin gerçek IP adresini alabilmek için proxy'e güvenmemiz gerekir.
app.set('trust proxy', true);

// 1x1 boyutunda şeffaf (görünmez) bir PNG görselinin Base64 kodlanmış hali
const transparentPixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

// Pixel endpoint'i
app.get('/pixel.png', (req, res) => {
  // 1. IP Adresini al
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // 2. User-Agent bilgisini al (Kullanıcının tarayıcı, işletim sistemi ve cihaz bilgisi)
  const userAgent = req.get('user-agent') || 'Bilinmiyor';
  
  // 3. Referer bilgisini al (Bu pixelin hangi web sayfasında yüklendiğini gösterir)
  const referer = req.get('referer') || req.get('referrer') || 'Doğrudan erişim';
  
  // 4. İstek yapılan zamanı al
  const timestamp = new Date().toISOString();

  // Loglama İşlemi (Gerçek projede DB'ye kaydedilir)
  console.log('--- YENİ PIXEL İSTEĞİ (Ziyaretçi) ---');
  console.log(`Tarih..: ${timestamp}`);
  console.log(`IP.....: ${ip}`);
  console.log(`Tarayıcı: ${userAgent}`);
  console.log(`Kaynak.: ${referer}`);
  console.log('-------------------------------------\n');

  // Tarayıcılara bu görseli önbelleğe almamalarını (cache kullanmamalarını) söylüyoruz.
  // Eğer önbelleğe alırlarsa, aynı kişi siteye tekrar girdiğinde istek sunucuya gelmez.
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  // Yanıtın tipi olarak PNG belirtiyor ve görselimizi gönderiyoruz
  res.type('image/png');
  res.send(transparentPixel);
});

// Selfie upload endpoint
app.post('/selfie', upload.single('photo'), (req, res) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.get('user-agent') || 'Bilinmiyor';
  const referer = req.get('referer') || req.get('referrer') || 'Doğrudan erişim';
  const filePath = req.file ? req.file.path : 'none';
  console.log('--- SELFIE YÜKLEME (Ziyaretçi) ---');
  console.log(`Tarih..: ${timestamp}`);
  console.log(`IP.....: ${ip}`);
  console.log(`Tarayıcı: ${userAgent}`);
  console.log(`Kaynak.: ${referer}`);
  console.log(`Foto URL: ${filePath}`);
  console.log('-------------------------------------\n');
  res.json({ status: 'ok', url: filePath });
});

app.listen(PORT, () => {
  console.log(`Tracking pixel sunucusu başlatıldı.`);
  console.log(`Çalıştığı adres: http://localhost:${PORT}`);
});
