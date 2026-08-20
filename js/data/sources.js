// sources.js — Master Data Lokasi Sumber Tanah (Quarry / Excavation Source)

export const INITIAL_SOURCES = [
  {
    id: "SRC-01",
    name: "Quarry Bukit Hambalang",
    code: "HMB-01",
    location: "Citeureup, Kabupaten Bogor, Jawa Barat",
    soilType: "Tanah Liat Berpasir (Tanah Merah Urug Super)",
    coordinate: "-6.5412, 106.8921",
    pic: "Bpk. Hendra Gunawan (0811-2233-4455)",
    estimatedCapacity: 250000, // m³
    totalVolumeExtracted: 94800, // m³
    totalTrips: 4740,
    status: "active", // active | low_stock | closed
    dailyRateAvg: 680, // m³/hari
    operatingHours: "06:00 - 18:00 WIB"
  },
  {
    id: "SRC-02",
    name: "Galian C Rumpin Indah",
    code: "RMP-02",
    location: "Rumpin, Kabupaten Bogor, Jawa Barat",
    soilType: "Tanah Urug Pilihan & Sirtu Urug",
    coordinate: "-6.4218, 106.6341",
    pic: "Bpk. Rudi Hermawan (0812-9988-7766)",
    estimatedCapacity: 180000,
    totalVolumeExtracted: 62400,
    totalTrips: 3120,
    status: "active",
    dailyRateAvg: 510,
    operatingHours: "24 Jam (2 Shift)"
  },
  {
    id: "SRC-03",
    name: "Tambang Pasir & Tanah Cileungsi",
    code: "CLS-03",
    location: "Cileungsi, Kabupaten Bogor, Jawa Barat",
    soilType: "Tanah Urug Biasa & Pasir Urug",
    coordinate: "-6.3982, 106.9810",
    pic: "Bpk. M. Syafei (0813-1122-3344)",
    estimatedCapacity: 120000,
    totalVolumeExtracted: 88500,
    totalTrips: 4425,
    status: "active",
    dailyRateAvg: 420,
    operatingHours: "07:00 - 17:00 WIB"
  },
  {
    id: "SRC-04",
    name: "Quarry Parung Panjang",
    code: "PRP-04",
    location: "Parung Panjang, Kabupaten Bogor, Jawa Barat",
    soilType: "Tanah Timbunan Batuan Lapuk",
    coordinate: "-6.3541, 106.5812",
    pic: "Bpk. Joko Anwar (0815-6677-8899)",
    estimatedCapacity: 95000,
    totalVolumeExtracted: 21300,
    totalTrips: 1065,
    status: "active",
    dailyRateAvg: 280,
    operatingHours: "07:00 - 18:00 WIB"
  }
];
