// Ganti dengan URL Web App dari Google Apps Script kamu
const scriptURL = 'https://script.google.com/macros/s/AKfycbw6ffBJN_o789h65Yjd3HkZar_fDWgGyfb3cI27s30C2Fi0sO00NFJ_reMaz10JGZKkSw/exec'; 

let selectedUser = "";

// 1. Ambil Data Karyawan saat halaman dimuat
async function loadEmployees() {
    try {
        const res = await fetch(scriptURL);
        const data = await res.json();
        const container = document.getElementById('employeeList');
        container.innerHTML = '';

        data.forEach(emp => {
            // emp[1] = Nama, emp[2] = Jabatan, emp[3] = Status Terakhir
            const card = `
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">${emp[1]}</h3>
                        <p class="text-gray-500 text-xs mb-2 italic">${emp[2]}</p>
                        <span class="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${getStatusStyle(emp[3])}">
                            ${emp[3] || 'Belum Absen'}
                        </span>
                    </div>
                    <button onclick="openModal('${emp[1]}')" class="bg-blue-100 text-blue-600 p-2 px-4 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition">
                        Update
                    </button>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Gagal memuat data:', error);
        document.getElementById('employeeList').innerHTML = `<p class="text-red-500 text-center col-span-full">Gagal terhubung ke database.</p>`;
    }
}

// Fungsi styling label status
function getStatusStyle(status) {
    if (status === 'Hadir') return 'bg-green-100 text-green-700';
    if (status === 'Sakit' || status === 'Izin') return 'bg-red-100 text-red-700';
    if (status === 'Idle') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-500';
}

function openModal(name) {
    selectedUser = name;
    document.getElementById('modalName').innerText = name;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('photoInput').value = ''; // Reset input foto
}

// 2. Fungsi Kirim Data ke Google Sheets
async function submitAbsen() {
    const status = document.getElementById('statusSelect').value;
    const fileInput = document.getElementById('photoInput');
    const btn = document.getElementById('btnSubmit');
    
    let base64Photo = "";
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        base64Photo = await toBase64(file);
    }

    btn.innerText = "Proses Mengirim...";
    btn.disabled = true;

    const payload = {
        action: "updateStatus",
        nama: selectedUser,
        status: status,
        foto: base64Photo
    };

    try {
        await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        alert('Data Absensi ' + selectedUser + ' Berhasil Dikirim!');
        closeModal();
        loadEmployees(); // Refresh data di dashboard
    } catch (error) {
        alert('Gagal mengirim data. Coba lagi.');
        console.error(error);
    } finally {
        btn.innerText = "Kirim Data";
        btn.disabled = false;
    }
}

// Helper: Ubah file gambar ke string Base64 agar bisa masuk ke Sheet
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Jalankan fungsi saat startup
loadEmployees();