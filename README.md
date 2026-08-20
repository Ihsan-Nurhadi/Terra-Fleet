# TERRA FLEET — Sistem Monitoring Terintegrasi Aktivitas Pengangkutan Tanah (Dump Truck Fleet)

Aplikasi web mockup interaktif untuk sistem monitoring terintegrasi operasional pengangkutan tanah urug menggunakan armada dump truck. Sistem mencatat pengambilan tanah dari berbagai sumber (quarry), pengiriman ke berbagai proyek tujuan penimbunan, penugasan driver, histori timbangan/weighbridge, serta pencapaian target harian/periodik secara real-time.

Dibangun menggunakan **HTML5 murni, Vanilla CSS3, dan Vanilla JavaScript (ES6 Modules)** dengan desain clean, data-first, dan mendukung **Dark Mode & Light Mode** otomatis.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini tidak memerlukan instalasi backend maupun runtime build tool yang rumit.

### Opsi 1: Menjalankan via Local Web Server (Direkomendasikan untuk ES Modules)
Jalankan salah satu perintah berikut di terminal pada folder root project:

```bash
# Menggunakan npx serve
npx -y serve .

# Atau menggunakan Python 3
python -m http.server 8000

# Atau menggunakan VS Code Live Server extension
```
Lalu buka browser di `http://localhost:3000` (atau `http://localhost:8000`).

---

## 🌟 Fitur & Modul Sistem

### 1. 📊 Dashboard Monitoring Terpadu
- **Summary KPI Cards**: Pemantauan jumlah unit armada (Aktif, Idle, Servis), Driver bertugas, Ritase hari ini, Total volume tanah terangkut (m³), dan rasio pencapaian target harian.
- **Interactive Line Chart**: Tren volume dan ritase 3 hari terakhir (responsif tema).
- **Doughnut Chart**: Distribusi volume per lokasi quarry/galian.
- **Bar Chart**: Progres volume yang diterima per lokasi proyek penimbunan.
- **Tabel Performa per Unit**: Progress bar persentase target dengan warna dinamis (Merah `<70%`, Kuning `70–99%`, Hijau `≥100%`).
- **Live Fleet Tracker Banner**: Akses cepat status truk yang sedang melintas.
- **Live Trip Stream**: Log aktivitas transaksi rit terbaru.

### 2. 🗺️ Modul Peta Armada (Live GPS Map Tracking)
- **Peta Interaktif Layar Penuh** menggunakan Leaflet.js dengan basemap CartoDB (otomatis berganti tile pada Light/Dark mode).
- **Pelacakan Posisi GPS Real-Time**: Marker truk bergerak dengan indikator kecepatan ($km/jam$), muatan volume, nama pengemudi, dan estimasi waktu tiba (ETA).
- **Garis Rute (Polylines)**: Visualisasi lintasan dari lokasi quarry galian ke proyek tujuan.
- **Panel Samping Kendali**: Daftar truk aktif dengan fitur klik untuk fokus (*fly to location*).
- **Simulasi GPS Dinamis**: Tombol aktifasi simulasi pergerakan armada secara langsung.

### 3. 🚛 Modul Armada Dump Truck
- Tabel daftar armada lengkap dengan No. Unit, No. Polisi, Kapasitas bak (m³), Status unit dengan badge indikator warna, Driver bertugas (multi-driver shift), dan Jadwal servis.
- Filter cepat status unit (Semua, Aktif, Idle, Maintenance) dan live search.
- **Form Tambah & Edit Unit Truck** dengan simulasi penyimpanan in-memory.
- **Modal Detail Unit**: Riwayat pemakaian unit, spesifikasi lengkap, level BBM, dan odometer.

### 3. 👨‍✈️ Modul Driver Monitoring
- Monitoring shift kerja (Siang, Malam, Standby/Cadangan, Off-duty).
- Profil kartu driver, nomor SIM B2 Umum, safety score, rating performa, dan total volume terkirim.
- **Modal Histori Driver**: Daftar seluruh rit yang telah diselesaikan oleh driver bersangkutan.

### 4. 📝 Modul Data Pengiriman (Rit / Trip Log)
- Tabel log transaksi komprehensif: No. Surat Jalan, Tanggal & Jam, Unit & Driver, Rute Sumber $\rightarrow$ Tujuan, Jenis Tanah, Volume, Berat Timbangan Netto (kg), dan Status pengiriman.
- **Multi-Filter Lanjutan**: Berdasarkan tanggal (Hari ini, Kemarin, Lama), status pengiriman, armada truck, dan quarry sumber.
- **Input Rit Baru**: Form pembuatan surat jalan baru dengan kalkulasi timbangan otomatis.
- **Modal Detail Surat Jalan**: Bukti muatan lapangan (foto mock), timestamp GPS, checker penerima, dan tombol cetak surat jalan.
- **Ekspor CSV**: Fitur download log ritase langsung ke format file `.csv`.

### 5. ⛰️ Modul Sumber Tanah (Quarry)
- Master data quarry (Bukit Hambalang, Rumpin Indah, Cileungsi, Parung Panjang).
- Progress bar deposit kapasitas tanah vs realisasi ekstraksi.
- Info jenis material tanah urug, PIC lapangan, dan koordinat GPS.
- Modal relasi armada truck yang pernah mengambil muatan dari quarry terkait.

### 6. 🏗️ Modul Tujuan Pengiriman (Proyek)
- Master data proyek infrastruktur & penimbunan (Tol Cisumdawu, Kawasan Industri Cikarang, Residensial Serpong, Logistik Marunda).
- Progress bar pemenuhan volume urugan terhadap target kontrak proyek.
- Info jam penerimaan material dan kontraktor penanggung jawab.

### 7. 🎯 Modul Target & Pencapaian (Achievement KPI)
- Monitoring target rit & volume per armada, sumber, dan proyek tujuan.
- Filter periode: **Target Harian**, **Target Mingguan**, dan **Target Bulanan**.
- Indikator warna progress bar otomatis sesuai standar `design.md`:
  - **Hijau**: $\ge 100\%$ (Target tercapai/optimal)
  - **Kuning**: $70\% - 99\%$ (On track)
  - **Merah**: $< 70\%$ (Perlu percepatan)
- **Form Penyesuaian Target**: Form interaktif untuk mengubah target periode.

### 8. ⚙️ Pengaturan & Backup Data
- Toggle Dark Mode / Light Mode tersimpan permanen di `localStorage`.
- Ekspor database lengkap ke file `.json`.
- Profil operasional perusahaan dan zona waktu.

---

## 🎨 Desain & UI/UX Token (Sesuai `design.md`)

- **Light Mode**: `--bg-primary: #F7F8FA`, `--bg-secondary: #FFFFFF`, `--border-color: #E4E7EB`, `--text-primary: #1A1D23`
- **Dark Mode**: `--bg-primary: #0F1115`, `--bg-secondary: #171A21`, `--border-color: #2A2E38`, `--text-primary: #F2F3F5`
- **Accent Primary**: Biru `#2563EB` (Light) / `#3B82F6` (Dark)
- **Status Colors**:
  - Success: `#16A34A` / `#22C55E`
  - Warning: `#D97706` / `#F59E0B`
  - Danger: `#DC2626` / `#EF4444`
  - Neutral: `#6B7280` / `#9CA3AF`
- **Tipografi**: `Inter`, `-apple-system`, `sans-serif` dan `JetBrains Mono` untuk kode tiket.
- **Micro-Interactions**: Transisi warna halus `250ms`, hover elevasi `translateY(-2px)`, pulse animation status sync.

---

## 📁 Struktur Berkas

```
Mockup-Dashboard/
├── index.html               # Halaman utama & layout shell
├── README.md                # Dokumentasi sistem
├── task.md                  # Spesifikasi requirement
├── design.md                # Panduan UI/UX tokens
├── css/
│   ├── variables.css        # CSS Custom Properties (Theme tokens)
│   ├── base.css             # Reset, typography, scrollbars, utility classes
│   ├── components.css       # Cards, tables, badges, buttons, modals, progress bars
│   └── layout.css           # App layout, sticky topbar, sidebar, responsive breakpoints
└── js/
    ├── app.js               # Central state store, CRUD mutations, modal & toast controller
    ├── router.js            # Client-side hash router & view switcher
    ├── theme.js             # Theme switcher & localStorage persistence
    ├── charts.js            # Chart.js helper dengan theme reactivity
    ├── data/
    │   ├── trucks.js        # Master data armada dump truck
    │   ├── drivers.js       # Master data pengemudi & jadwal shift
    │   ├── sources.js       # Master data lokasi quarry galian
    │   ├── destinations.js  # Master data proyek tujuan penimbunan
    │   ├── trips.js         # Log transaksi ritase realistis
    │   └── targets.js       # Data target harian/mingguan/bulanan
    └── views/
        ├── dashboard.js     # View Dashboard & Summary charts
        ├── trucks.js        # View Armada Truck & Form CRUD
        ├── drivers.js       # View Driver Monitoring & Detail
        ├── trips.js         # View Data Pengiriman & Multi-Filter
        ├── sources.js       # View Sumber Tanah (Quarry)
        ├── destinations.js  # View Tujuan Pengiriman (Proyek)
        ├── targets.js       # View Target vs Realisasi (Progress)
        └── settings.js      # View Pengaturan & Ekspor Data
```
