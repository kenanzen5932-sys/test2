const multer = require('multer');
const path = require('path');

// Vercel serverless ortamında /tmp klasörü yazılabilir
const upload = multer({ dest: '/tmp' });

module.exports = (req, res) => {
  // Multer middleware expects multipart/form-data; we manually invoke it
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }

    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';
    const referer = req.headers['referer'] || req.headers['referrer'] || 'Doğrudan erişim';
    const filePath = req.file ? req.file.path : 'none';

    console.log('--- SELFIE YÜKLEME (Ziyaretçi) ---');
    console.log(`Tarih..: ${timestamp}`);
    console.log(`IP.....: ${ip}`);
    console.log(`Tarayıcı: ${userAgent}`);
    console.log(`Kaynak.: ${referer}`);
    console.log(`Foto URL: ${filePath}`);
    console.log('-------------------------------------\n');

    // Vercel'de kalıcı URL yok; sadece geçici dosya yolu döndürülür
    res.json({ status: 'ok', url: filePath });
  });
};
