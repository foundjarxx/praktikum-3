/* =========================================================
   EXPENSE TRACKER — logic (client-side only, no backend)
   =========================================================
   Cara kerja singkat:
   1. Semua data pengeluaran disimpan dalam satu array bernama
      `expenses`, isinya object { id, name, amount }.
   2. Setiap kali array berubah (tambah/hapus), kita:
        a. simpan array itu ke localStorage (biar tidak hilang
           saat halaman di-refresh), lalu
        b. panggil render() untuk menggambar ulang tampilan
           berdasarkan isi array yang terbaru.
   3. Tidak ada server / database — localStorage adalah
      "penyimpanan" milik browser masing-masing pengguna.
   ========================================================= */

// Ambil elemen-elemen HTML yang akan kita pakai berulang kali
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const formError = document.getElementById("form-error");

const listEl = document.getElementById("expense-list");
const emptyState = document.getElementById("empty-state");
const countEl = document.getElementById("expense-count");
const totalEl = document.getElementById("expense-total");

const STORAGE_KEY = "expense-tracker-data";

// -----------------------------------------------------------
// 1. Muat data awal dari localStorage (jika sebelumnya pernah
//    diisi). Kalau belum ada / rusak, mulai dengan array kosong.
// -----------------------------------------------------------
let expenses = loadFromStorage();

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Gagal membaca localStorage, mulai dari kosong.", err);
    return [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// -----------------------------------------------------------
// 2. Format angka jadi format Rupiah, mis. 25000 -> "Rp25.000"
// -----------------------------------------------------------
function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

// -----------------------------------------------------------
// 3. Menambahkan pengeluaran baru
//    Dipanggil saat form di-submit.
// -----------------------------------------------------------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // supaya halaman tidak reload

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);

  // Validasi sederhana: nama tidak boleh kosong,
  // nominal harus angka dan lebih besar dari 0.
  if (!name || !amount || amount <= 0) {
    formError.textContent =
      "Isi keterangan dan nominal (harus lebih dari 0) terlebih dahulu.";
    formError.hidden = false;
    return;
  }

  formError.hidden = true;

  // Buat entri baru. id dibuat dari timestamp supaya unik,
  // sehingga tiap item bisa dihapus tanpa tertukar satu sama lain.
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
  };

  expenses.push(newExpense);
  saveToStorage();
  render();

  // Bersihkan form dan fokus kembali ke input nama
  form.reset();
  nameInput.focus();
});

// -----------------------------------------------------------
// 4. Menghapus pengeluaran
//    Kita pakai "event delegation": satu listener di <ul>,
//    lalu cek tombol mana yang benar-benar diklik. Ini lebih
//    efisien daripada memasang listener di tiap tombol hapus.
// -----------------------------------------------------------
listEl.addEventListener("click", function (event) {
  const button = event.target.closest(".item-delete");
  if (!button) return; // yang diklik bukan tombol hapus

  const idToRemove = Number(button.dataset.id);
  expenses = expenses.filter((item) => item.id !== idToRemove);

  saveToStorage();
  render();
});

// -----------------------------------------------------------
// 5. Menggambar ulang tampilan (list, total, jumlah transaksi)
//    berdasarkan isi array `expenses` saat ini.
// -----------------------------------------------------------
function render() {
  // Kosongkan dulu daftar yang lama
  listEl.innerHTML = "";

  // Tampilkan pesan "belum ada data" jika array kosong
  emptyState.hidden = expenses.length !== 0;

  expenses.forEach((item) => {
    const li = document.createElement("li");
    li.className = "receipt__item";
    li.innerHTML = `
      <span class="item-name">${escapeHtml(item.name)}</span>
      <span class="item-amount">${formatRupiah(item.amount)}</span>
      <button class="item-delete" data-id="${item.id}" aria-label="Hapus ${escapeHtml(item.name)}">Hapus</button>
    `;
    listEl.appendChild(li);
  });

  // Hitung total dengan reduce: jumlahkan semua `amount`
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  countEl.textContent = expenses.length;
  totalEl.textContent = formatRupiah(total);
}

// -----------------------------------------------------------
// 6. Kecil tapi penting: cegah nama pengeluaran yang mengandung
//    tag HTML dianggap sebagai HTML sungguhan (mencegah XSS
//    sederhana saat kita pakai innerHTML di atas).
// -----------------------------------------------------------
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// -----------------------------------------------------------
// Render pertama kali saat halaman dibuka
// -----------------------------------------------------------
render();
