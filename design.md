# DESIGN.md — Panduan Desain UI/UX
## Sistem Monitoring Pengangkutan Tanah (Dump Truck Fleet Monitoring)

## 1. Prinsip Desain
- **Clean & Minimalist** — banyak whitespace, hindari elemen dekoratif berlebihan, fokus pada data.
- **Data-first** — dashboard adalah pusat informasi, jadi hierarki visual harus memprioritaskan angka & status yang mudah dipindai (scannable).
- **Konsisten** — spacing, radius, warna, dan tipografi mengikuti sistem token yang sama di seluruh halaman.
- **Dua mode tema** — Light Mode (default siang/kantor) dan Dark Mode (operasional malam/lapangan), keduanya harus punya kontras cukup (WCAG AA minimal).

---

## 2. Color Palette (CSS Variables)

Gunakan CSS custom properties agar mudah switch tema via `data-theme="light" / "dark"` di elemen `<html>` atau `<body>`.

### Light Mode
```css
:root[data-theme="light"] {
  --bg-primary: #F7F8FA;
  --bg-secondary: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --border-color: #E4E7EB;
  --text-primary: #1A1D23;
  --text-secondary: #5B6270;
  --text-muted: #9AA1AC;

  --accent-primary: #2563EB;   /* biru — aksi utama, link, chart utama */
  --accent-primary-hover: #1D4ED8;

  --status-success: #16A34A;   /* achievement >=100%, truck aktif */
  --status-success-bg: #DCFCE7;
  --status-warning: #D97706;   /* achievement 70-99% */
  --status-warning-bg: #FEF3C7;
  --status-danger: #DC2626;    /* achievement <70%, truck maintenance */
  --status-danger-bg: #FEE2E2;
  --status-neutral: #6B7280;   /* truck idle */
  --status-neutral-bg: #F1F2F4;

  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.05);
  --shadow-md: 0 4px 12px rgba(16, 24, 40, 0.08);
}
```

### Dark Mode
```css
:root[data-theme="dark"] {
  --bg-primary: #0F1115;
  --bg-secondary: #171A21;
  --bg-elevated: #1E212B;
  --border-color: #2A2E38;
  --text-primary: #F2F3F5;
  --text-secondary: #A7ADBA;
  --text-muted: #6B7280;

  --accent-primary: #3B82F6;
  --accent-primary-hover: #60A5FA;

  --status-success: #22C55E;
  --status-success-bg: rgba(34, 197, 94, 0.15);
  --status-warning: #F59E0B;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-danger: #EF4444;
  --status-danger-bg: rgba(239, 68, 68, 0.15);
  --status-neutral: #9CA3AF;
  --status-neutral-bg: rgba(156, 163, 175, 0.15);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
}
```

**Aturan pemakaian warna:**
- `--accent-primary` hanya untuk elemen interaktif utama (tombol primary, link aktif di sidebar, garis chart utama). Jangan dipakai berlebihan.
- Status color (success/warning/danger/neutral) **konsisten** di semua tempat: badge status truck, progress bar achievement, indikator status pengiriman.
  - Achievement ≥100% → success
  - Achievement 70–99% → warning
  - Achievement <70% → danger
  - Truck Aktif → success, Idle → neutral, Maintenance → danger

---

## 3. Tipografi

- **Font family:** `'Inter', -apple-system, 'Segoe UI', sans-serif` (via Google Fonts atau system font stack agar ringan)
- **Skala ukuran:**
  | Token | Ukuran | Penggunaan |
  |---|---|---|
  | `--text-xs` | 12px | label kecil, caption, timestamp |
  | `--text-sm` | 13px | teks tabel, secondary info |
  | `--text-base` | 14px | body text default |
  | `--text-md` | 16px | judul card, subjudul |
  | `--text-lg` | 20px | judul section |
  | `--text-xl` | 28–32px | angka besar di summary card (KPI) |
- **Font weight:** 400 (regular body), 500 (label/emphasis), 600 (judul/heading), 700 (angka KPI besar)
- Angka statistik besar di dashboard cards menggunakan weight 600–700 supaya menonjol tanpa perlu warna mencolok.

---

## 4. Spacing & Layout System

- Base unit: **4px** (gunakan skala 4/8/12/16/24/32/48)
- Container max-width halaman: 1440px, dengan padding horizontal 24–32px
- Border radius: 
  - `--radius-sm: 6px` (badge, input kecil)
  - `--radius-md: 10px` (card, button)
  - `--radius-lg: 16px` (modal, panel besar)
- Card padding: 20–24px
- Gap antar card di grid: 16–20px

### Grid Layout Dashboard
```
[ Sidebar 240px ] [ Main Content — fluid ]
                    ├─ Topbar (sticky, h:64px)
                    ├─ Summary Cards Row (grid 4-6 kolom, responsive → 2 → 1)
                    ├─ Chart Section (grid 2 kolom: tren pengiriman | distribusi sumber)
                    └─ Tables Section (per truck / per source / per destination, stacked atau tab)
```

---

## 5. Komponen UI

### Sidebar Navigasi
- Lebar 240px (collapsible ke 64px icon-only)
- Background `--bg-secondary`, border-right tipis `--border-color`
- Menu aktif: background lembut `--accent-primary` opacity 10%, teks/icon warna `--accent-primary`
- Icon minimalis (gunakan outline icon set seperti Lucide/Feather via CDN atau inline SVG)

### Topbar
- Sticky di atas, background `--bg-primary` + blur/border-bottom tipis
- Berisi: judul halaman, search bar ringkas, toggle tema (icon sun/moon), avatar/profil

### Summary Card (KPI Card)
- Background `--bg-elevated`, border 1px `--border-color`, shadow-sm
- Struktur: label kecil (text-secondary) di atas → angka besar (text-primary, bold) → sublabel/trend kecil di bawah (misal "+5% dari kemarin" dengan warna status)
- Optional icon kecil di pojok kanan atas (opacity rendah, dekoratif)

### Tabel Data
- Header tabel: background `--bg-secondary`, text-secondary, uppercase text-xs, letter-spacing sedikit
- Row hover: background sedikit berubah (`--bg-secondary` di light, sedikit lebih terang di dark)
- Border antar row: hanya border-bottom tipis `--border-color`, hindari border vertikal (biar clean)
- Kolom status pakai **Badge/Pill** (rounded-full, padding kecil, background status-bg + text status color)
- Kolom achievement pakai **Progress Bar** horizontal tipis (height 6-8px, rounded-full) + label persen di sampingnya

### Progress Bar Achievement
- Track: `--border-color` atau bg-secondary
- Fill: warna sesuai status (success/warning/danger)
- Transisi width animasi halus (`transition: width 0.4s ease`)

### Chart
- Gunakan Chart.js via CDN (ringan, tanpa build tool) atau Canvas API manual jika ingin benar-benar vanilla
- Palet chart: 1 warna accent utama untuk data utama, warna netral/abu untuk data pembanding
- Grid line chart tipis & samar (`--border-color` opacity rendah), jangan terlalu ramai

### Modal / Detail Panel
- Overlay backdrop semi-transparan gelap
- Panel: `--bg-elevated`, radius-lg, shadow-md, padding 24px
- Muncul dengan animasi fade + scale halus

### Toggle Dark/Light Mode
- Icon switch (sun ↔ moon) di topbar
- Simpan preferensi di `localStorage` (key: `theme`)
- Transisi warna halus saat switch: `transition: background-color 0.25s ease, color 0.25s ease;` diterapkan global di `body, .card, .sidebar, dst`

---

## 6. Ikonografi & Visual
- Gunakan icon set outline minimalis (Lucide Icons / Feather Icons via CDN SVG) — jangan icon filled/berwarna-warni supaya tetap clean
- Ilustrasi/emoji dihindari, kecuali untuk empty state (boleh 1 ilustrasi simpel line-art)
- Foto bukti pengiriman (jika ada) ditampilkan dalam thumbnail rounded dengan border tipis

---

## 7. Responsiveness
- **Desktop (≥1200px):** layout penuh sidebar + grid multi-kolom
- **Tablet (768–1199px):** sidebar collapsible jadi icon-only, summary cards jadi 2 kolom
- **Mobile (<768px):** sidebar jadi bottom-nav atau hamburger drawer, cards & tabel jadi 1 kolom (tabel bisa jadi card-list agar tidak overflow horizontal)

---

## 8. Motion & Interaksi
- Semua transisi state (hover, tema, tab switch) menggunakan durasi singkat **150–300ms**, easing `ease` atau `ease-in-out` — hindari animasi mencolok/bouncy agar tetap terasa profesional
- Hover pada card: elevasi sedikit naik (`box-shadow` bertambah) + transform `translateY(-2px)` halus
- Loading state: skeleton loader dengan shimmer halus, bukan spinner besar mencolok

---

## 9. Aksesibilitas
- Kontras teks terhadap background minimal rasio 4.5:1 (cek terutama warna status di dark mode)
- Semua elemen interaktif punya `:focus-visible` outline yang jelas (pakai `--accent-primary`)
- Ukuran target klik minimal 40x40px untuk tombol/icon di mobile

---

## 10. Referensi Gaya Visual
Gaya yang dituju mirip dashboard SaaS modern seperti Linear, Vercel Dashboard, atau Notion — banyak whitespace, tipografi rapi, warna aksen minim tapi tegas, dan status berbasis warna yang konsisten.
