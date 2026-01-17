// Ganti dengan URL Web App dari Google Apps Script kamu
const scriptURL = 'https://script.google.com/macros/s/AKfycbyhKNnQux6RNucvkFFsrR1j0GGRQ19WDUThydaieWd90t6OLBvMHIUY-A06I-aRW6sgbg/exechttps://script.google.com/macros/s/AKfycbymc3-DjFQrbfY3BcJT1nFVH7KsQwImegio28TOiGQ4IkewduOcoHca9q1v6Ji2i0_GdQ/exec'; 

let selectedUser = '';

async function loadEmployees() {
  const res = await fetch(scriptURL);
  const data = await res.json();
  const container = document.getElementById('employeeList');
  container.innerHTML = '';

  data.forEach(emp => {
    const card = `
      <div class="bg-white p-4 rounded-xl shadow flex justify-between">
        <div>
          <h3 class="font-bold">${emp[1]}</h3>
          <p class="text-sm text-gray-500">${emp[2]}</p>
          <span class="text-xs">${emp[3] || 'Belum Absen'}</span>
        </div>
        <button onclick="openModal('${emp[1]}')" class="bg-blue-500 text-white px-4 py-1 rounded">
          Update
        </button>
      </div>`;
    container.innerHTML += card;
  });
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
  const status = document.getElementById('statusSelect').value;
  const file = document.getElementById('photoInput').files[0];
  let foto = '';

  if (file) foto = await toBase64(file);

  await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({
      nama: selectedUser,
      status: status,
      foto: foto
    })
  });

  closeModal();
  loadEmployees();
}

const toBase64 = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(file);
});

loadEmployees();
