# TASK.md — Sistem Monitoring Pengangkutan Tanah (Dump Truck Fleet Monitoring)

## 1. Ringkasan Proyek
Mockup website untuk sistem monitoring terintegrasi aktivitas pengangkutan tanah menggunakan armada dump truck. Sistem mencatat pengambilan tanah dari banyak sumber, pengiriman ke banyak tujuan, driver yang bertugas, serta pencapaian target harian/periodik.

**Scope teknis:** Mockup statis/interaktif menggunakan **HTML, CSS, JavaScript murni** (tanpa framework/backend). Data dapat berupa dummy/mock data (hardcoded di JS atau JSON lokal) untuk mensimulasikan fungsi sistem.

**Gaya desain:** Clean, minimalist, mendukung **Dark Mode & Light Mode** (toggle).

---

## 2. Struktur Halaman (Pages/Views)

- [ ] **Dashboard (Home)** — halaman utama monitoring
- [ ] **Armada Truck** — data master truck & driver
- [ ] **Data Pengiriman (Rit/Trip)** — log transaksi pengambilan & pengiriman
- [ ] **Sumber Tanah (Source)** — master data lokasi sumber
- [ ] **Tujuan Pengiriman (Destination)** — master data lokasi tujuan
- [ ] **Target & Achievement** — pengaturan dan pemantauan target
- [ ] **Driver Monitoring** — histori & performa per driver
- [ ] (Opsional) **Login/Settings** — profil user & pengaturan tema

---

## 3. Breakdown Task per Modul

### A. Modul Armada Truck
- [ ] Tabel daftar truck: No. Unit, No. Polisi, Kapasitas, Status (Aktif/Idle/Maintenance)
- [ ] Detail truck: histori penggunaan, driver yang pernah/sedang mengoperasikan
- [ ] Form tambah/edit data truck (UI saja, tanpa backend)
- [ ] Badge status truck dengan warna (hijau=aktif, abu=idle, merah=maintenance)
- [ ] Relasi 1 truck → banyak driver (multi-driver per shift)

### B. Modul Driver
- [ ] Tabel daftar driver: Nama, No. Lisensi (opsional), Truck yang ditugaskan, Shift
- [ ] Kartu profil driver + statistik (jumlah rit, volume terkirim)
- [ ] Jadwal/shift driver terhadap truck (kalender atau tabel sederhana)
- [ ] Histori aktivitas driver (rit, sumber, tujuan)

### C. Modul Sumber Tanah (Source)
- [ ] Tabel daftar sumber: Nama sumber, Lokasi, Total rit, Total volume terkirim
- [ ] Detail per sumber: truck yang pernah mengambil, tujuan yang dituju dari sumber ini
- [ ] Chart kontribusi volume per sumber (bar/pie chart sederhana pakai JS/Canvas atau library ringan)

### D. Modul Tujuan Pengiriman (Destination)
- [ ] Tabel daftar tujuan: Nama tujuan/proyek, Lokasi, Total volume diterima
- [ ] Detail per tujuan: dari sumber mana saja, truck mana saja yang mengirim
- [ ] Chart volume masuk per tujuan

### E. Modul Data Pengiriman (Rit/Trip Log)
- [ ] Tabel transaksi dengan kolom: Tanggal & Waktu, No. Rit, Truck, Driver, Sumber, Tujuan, Volume, Status Pengiriman
- [ ] Filter: berdasarkan tanggal, truck, driver, sumber, tujuan, status
- [ ] Search bar
- [ ] Detail transaksi (modal/detail page): termasuk bukti pengiriman (mock foto/dokumen)
- [ ] Form input rit baru (UI simulasi, tanpa backend nyata)
- [ ] Status pengiriman: Dijadwalkan / Dalam Perjalanan / Selesai / Dibatalkan

### F. Modul Target & Achievement
- [ ] Form pengaturan target (per truck / driver / sumber / tujuan / proyek / periode)
- [ ] Tabel monitoring: Target Rit, Target Volume, Realisasi, Achievement %
- [ ] Progress bar visual untuk achievement (dengan warna sesuai capaian: merah <70%, kuning 70–99%, hijau ≥100%)
- [ ] Filter periode (harian/mingguan/bulanan)

### G. Modul Dashboard Monitoring (Halaman Utama)
- [ ] **Summary Cards (Armada):**
  - Total truck, Truck aktif, Truck idle
  - Total driver
  - Total rit (hari ini/periode)
  - Total volume tanah terkirim
  - Target volume vs Achievement %
- [ ] **Tabel Summary per Truck** (Driver, Source, Destination, Rit, Volume, Target, Achievement)
- [ ] **Tabel/Chart Summary per Sumber** (Total Rit, Total Volume)
- [ ] **Tabel/Chart Summary per Tujuan** (Total Rit, Total Volume)
- [ ] Chart tren pengiriman (line/bar chart per hari)
- [ ] Filter periode global di dashboard (hari ini/minggu ini/bulan ini/custom)
- [ ] Real-time indicator (mock — misal label "Updated X menit lalu" + tombol refresh)

### H. Komponen UI Global
- [ ] Sidebar navigasi (collapsible)
- [ ] Topbar (judul halaman, search, notifikasi, toggle dark/light mode, profil user)
- [ ] Toggle Dark Mode / Light Mode (tersimpan di localStorage)
- [ ] Reusable komponen: Card, Table, Badge/Status Pill, Progress Bar, Modal, Dropdown Filter
- [ ] Responsive layout (desktop utama, tablet/mobile minimal supaya rapi)
- [ ] Empty state & loading state (skeleton/spinner sederhana)

---

## 4. Data Dummy yang Perlu Disiapkan (JS mock data)
- [ ] `trucks.js` — daftar unit truck (min. 5–8 unit)
- [ ] `drivers.js` — daftar driver (min. 6–10 orang)
- [ ] `sources.js` — daftar sumber tanah (min. 3–5 lokasi)
- [ ] `destinations.js` — daftar tujuan (min. 3–5 lokasi/proyek)
- [ ] `trips.js` — log transaksi rit (min. 30–50 record untuk simulasi data realistis, mencakup beberapa hari)
- [ ] `targets.js` — target per truck/driver/proyek/hari

---

## 5. Prioritas Pengembangan (Urutan Disarankan)
1. Setup struktur folder & base HTML/CSS (layout, sidebar, topbar, tema dark/light)
2. Buat data dummy (JS)
3. Bangun Dashboard utama (paling penting/representatif)
4. Bangun modul Armada Truck & Driver
5. Bangun modul Sumber & Tujuan
6. Bangun modul Data Pengiriman (tabel + filter + detail)
7. Bangun modul Target & Achievement
8. Polish UI: animasi transisi tema, responsiveness, micro-interaction
9. Review konsistensi desain & aksesibilitas warna (kontras dark/light)

---

## 6. Deliverables
- [ ] File struktur project (`index.html`, `/pages`, `/css`, `/js`, `/assets`, `/data`)
- [ ] Dashboard mockup fungsional dengan data dummy
- [ ] Toggle dark/light mode berfungsi & tersimpan
- [ ] Minimal 1 halaman detail (misal detail truck / detail rit) sebagai contoh drill-down
- [ ] Dokumentasi singkat cara menjalankan (buka `index.html` di browser)
