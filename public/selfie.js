// selfie.js – captures webcam image and uploads to server
(async () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const msg = document.getElementById('msg');

  // Request camera permission and stream
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    msg.textContent = '';
  } catch (e) {
    console.error('Kamera izni reddedildi:', e);
    msg.textContent = 'Kamera izni alınamadı. Lütfen izin verin.';
    return;
  }

  // Wait a short moment for video to be ready
  await new Promise(r => setTimeout(r, 500));

  // Capture a frame
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to Blob
  canvas.toBlob(async (blob) => {
    if (!blob) {
      msg.textContent = 'Fotoğraf alınamadı.';
      return;
    }
    const form = new FormData();
    form.append('photo', blob, 'selfie.png');
    try {
      const resp = await fetch('/selfie', {
        method: 'POST',
        body: form,
      });
      const data = await resp.json();
      msg.textContent = data.status === 'ok' ? `Fotoğraf yüklendi: ${data.url}` : 'Yükleme başarısız.';
    } catch (err) {
      console.error('Upload error:', err);
      msg.textContent = 'Yükleme sırasında hata.';
    }
  }, 'image/png');
})();
