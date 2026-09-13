# Struk Pengeluaran (Expense Tracker)

Website satu halaman untuk mencatat pengeluaran harian, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework, tanpa backend/database).

**Link repository GitHub:** _(isi setelah kamu push ke GitHub)_
**Link website (GitHub Pages):** _(isi setelah deploy)_
**NIM:** _(sudah dicantumkan di tag `<title>` pada `index.html` — ganti placeholder `[NIM]` dengan NIM asli sebelum deploy)_

## Struktur file

```
index.html   -> struktur/isi halaman
style.css    -> semua tampilan visual
script.js    -> semua logika (tambah, hapus, hitung total)
```

## Cara kerja singkat

1. **Menyimpan data**
   Semua pengeluaran disimpan dalam satu array JavaScript bernama `expenses`, di mana tiap elemen berbentuk objek `{ id, name, amount }`. `id` dibuat dari `Date.now()` supaya setiap item punya identitas unik dan bisa dihapus tanpa tertukar.

2. **Menambah data (poin 1 & 2 tugas)**
   Form pada `#expense-form` punya event listener `submit`. Saat disubmit, `event.preventDefault()` dipanggil supaya halaman tidak reload, nilai input divalidasi (keterangan tidak boleh kosong, nominal harus angka > 0), lalu objek baru di-`push()` ke array `expenses`. Setelah itu `render()` dipanggil untuk menggambar ulang tampilan.

3. **Menampilkan data**
   Fungsi `render()` mengosongkan `<ul id="expense-list">` lalu melakukan `forEach` pada array `expenses`, membuat satu `<li>` untuk tiap item (berisi nama, nominal yang sudah diformat ke Rupiah, dan tombol hapus).

4. **Menghitung total & jumlah transaksi (poin 3 & 5 tugas)**
   Masih di dalam `render()`, total dihitung dengan `expenses.reduce((sum, item) => sum + item.amount, 0)`, dan jumlah transaksi diambil langsung dari `expenses.length`. Keduanya ditulis ke elemen `#expense-total` dan `#expense-count`.

5. **Menghapus data (poin 4 tugas)**
   Tombol hapus tidak dipasangi listener satu per satu. Sebagai gantinya, satu listener `click` dipasang di `<ul>` induknya (teknik **event delegation**). Saat ada klik, kita cek apakah target-nya tombol `.item-delete`; jika ya, ambil `data-id` dari tombol tersebut, lalu `filter()` array `expenses` untuk membuang item dengan id tersebut, dan `render()` ulang.

6. **Penyimpanan sementara di browser**
   Setiap kali array `expenses` berubah (tambah/hapus), isinya disimpan ke `localStorage` lewat `JSON.stringify`. Saat halaman dibuka lagi, `localStorage.getItem()` dibaca kembali lewat `JSON.parse`. Ini murni fitur tambahan di sisi client — bukan backend/database — supaya catatan tidak hilang setiap refresh, sesuai ketentuan tugas.

7. **Layout**
   Layout dua kolom (form di kiri, struk di kanan) dibuat dengan CSS Grid (`display: grid; grid-template-columns: 300px 1fr;`), dan otomatis menjadi satu kolom di layar kecil lewat media query.

## Cara menjalankan secara lokal

Cukup buka `index.html` langsung di browser — tidak perlu server maupun instalasi apa pun.

## Cara deploy ke GitHub Pages

1. Buat repository baru di GitHub, lalu push ketiga file di atas (`index.html`, `style.css`, `script.js`).
2. Masuk ke **Settings → Pages** pada repository tersebut.
3. Pada bagian **Branch**, pilih branch `main` (atau `master`) dan folder `/root`, lalu klik **Save**.
4. Tunggu beberapa menit, GitHub akan memberi link berbentuk `https://<username>.github.io/<nama-repo>/` — itulah link website yang di-deploy.
