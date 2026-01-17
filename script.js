// Ganti dengan URL Web App dari Google Apps Script kamu
const scriptURL = 'https://script.google.com/macros/s/AKfycbymc3-DjFQrbfY3BcJT1nFVH7KsQwImegio28TOiGQ4IkewduOcoHca9q1v6Ji2i0_GdQ/exec'; 

let selectedUser = '';

async function loadEmployees() {
  const container = document.getElementById('employeeList');
  
  try {
    // Tambahkan parameter unik agar browser tidak mengambil cache lama
    const res = await fetch(scriptURL + '?nocache=' + new Date().getTime());
    
    if (!res.ok) throw new Error('Respon server tidak ok');
    
    const data = await res.json();
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p class="text-center col-span-full">Tidak ada data karyawan.</p>';
      return;
    }

    data.forEach(emp => {
      const card = `
        <div class="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-gray-100">
          <div>
            <h3 class="font-bold text-gray-800">${emp[1]}</h3>
            <p class="text-xs text-gray-400 uppercase tracking-wider">${emp[2]}</p>
            <span class="inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded ${getStatusClass(emp[3])}">
              ${emp[3] || 'BELUM ABSEN'}
            </span>
          </div>
          <button onclick="openModal('${emp[1]}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Update
          </button>
        </div>`;
      container.innerHTML += card;
    });
  } catch (err) {
    console.error("Detail Error:", err);
    container.innerHTML = `
      <div class="col-span-full text-center p-5 bg-red-50 rounded-xl text-red-600">
        <p>Gagal memuat data. Pastikan URL Script benar dan sudah di-deploy sebagai 'Anyone'.</p>
        <button onclick="loadEmployees()" class="mt-2 text-sm underline">Coba Lagi</button>
      </div>`;
  }
}

function getStatusClass(status) {
  if (status === 'Hadir') return 'bg-green-100 text-green-700';
  if (status === 'Sakit' || status === 'Izin') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-500';
}

function openModal(name) {
  selectedUser = name;
  document.getElementById('modalName').innerText = name;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

async function submitAbsen() {
  const btn = document.getElementById('btnSubmit'); // Pastikan id ini ada di button kamu
  const status = document.getElementById('statusSelect').value;
  const file = document.getElementById('photoInput').files[0];
  let foto = '';

  if (!file && status === "Hadir") {
    alert("Harus ambil foto untuk absen Hadir!");
    return;
  }

  // Visual Loading
  btn.disabled = true;
  btn.innerText = "Mengirim...";

  if (file) foto = await toBase64(file);

  try {
    await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify({
        nama: selectedUser,
        status: status,
        foto: foto
      })
    });
    alert("Absensi berhasil dicatat!");
  } catch (err) {
    alert("Terjadi kesalahan sistem.");
  } finally {
    btn.disabled = false;
    btn.innerText = "Kirim";
    closeModal();
    loadEmployees();
  }
}

const toBase64 = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(file);
});

loadEmployees();
