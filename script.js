const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznQ9b4MRZS8DuGIWiZfM5BqmNWutYvmIxD99JmdvnaqcWZkeNlmbj5_5ofAc6h8UyjWg/exec';

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

function ambilFoto() {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const now = new Date();
  const text = now.toLocaleString('id-ID');

  ctx.fillStyle = 'red';
  ctx.font = '14px Arial';
  ctx.fillText(text, 10, canvas.height - 10);

  preview.src = canvas.toDataURL('image/png');
}

function kirimAbsen() {
  if (!preview.src) {
    alert('Foto belum diambil');
    return;
  }

  const worker = document.getElementById('worker').value;
  const tipe = document.getElementById('tipe').value;
  const koordinator = document.getElementById('koordinator').value;

  const now = new Date();

  const data = {
    worker_id: worker,
    tipe_absen: tipe,
    tanggal: now.toISOString().slice(0,10),
    jam: now.toTimeString().slice(0,8),
    foto_base64: preview.src,
    koordinator: koordinator,
    device: navigator.userAgent
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => alert(res.status))
  .catch(() => alert('Gagal kirim'));
}
