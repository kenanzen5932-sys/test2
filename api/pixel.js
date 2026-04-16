module.exports = (req, res) => {
  // IP (Vercel adds X-Forwarded-For header)
  const ip = (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ||
             req.headers['x-real-ip'] ||
             req.socket?.remoteAddress ||
             'Bilinmiyor';

  // User-Agent
  const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

  // Referer
  const referer = req.headers['referer'] || req.headers['referrer'] || 'Doğrudan erişim';

  // Timestamp
  const timestamp = new Date().toISOString();

  // Log – appears in Vercel Functions → Logs
  console.log('--- VERCEL PIXEL İSTEĞİ ---');
  console.log(`Tarih..: ${timestamp}`);
  console.log(`IP.....: ${ip}`);
  console.log(`Tarayıcı: ${userAgent}`);
  console.log(`Kaynak.: ${referer}`);
  console.log('----------------------------');

  // 1×1 transparent PNG (Base64)
  const transparentPixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );

  // Disable caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Send PNG
  res.setHeader('Content-Type', 'image/png');
  res.end(transparentPixel);
}
