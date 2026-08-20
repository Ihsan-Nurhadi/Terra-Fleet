// destinations.js — Master Data Lokasi Tujuan Pengiriman (Destination Sites / Projects)

export const INITIAL_DESTINATIONS = [
  {
    id: "DST-01",
    name: "Proyek Tol Cisumdawu Seksi 3",
    code: "CSM-03",
    location: "Sumedang Barat, Jawa Barat",
    projectManager: "PT Hutama Karya (Bpk. Dani Setiawan)",
    phone: "0811-9876-5432",
    coordinate: "-6.8621, 107.9142",
    targetVolume: 120000, // m³
    currentVolumeReceived: 88400, // m³
    totalTripsReceived: 4420,
    status: "in_progress", // in_progress | nearly_completed | completed
    startDate: "2025-10-01",
    targetCompletionDate: "2026-11-30",
    receivingHours: "07:00 - 21:00 WIB",
    notes: "Kebutuhan timbunan badan jalan tol zona sub-grade."
  },
  {
    id: "DST-02",
    name: "Penimbunan Kawasan Industri Cikarang",
    code: "KIC-02",
    location: "Cikarang Pusat, Kabupaten Bekasi, Jawa Barat",
    projectManager: "PT Jababeka Tbk (Bpk. Arya Wiguna)",
    phone: "0812-7711-2233",
    coordinate: "-6.3210, 107.1740",
    targetVolume: 90000,
    currentVolumeReceived: 73500,
    totalTripsReceived: 3675,
    status: "in_progress",
    startDate: "2026-01-15",
    targetCompletionDate: "2026-09-30",
    receivingHours: "24 Jam",
    notes: "Pengurugan lahan kavling pabrik manufaktur 15 hektar."
  },
  {
    id: "DST-03",
    name: "Pembangunan Residensial Grand Serpong",
    code: "GSR-01",
    location: "Serpong, Tangerang Selatan, Banten",
    projectManager: "PT Bumi Serpong Damai (Bpk. Farhan Hakim)",
    phone: "0813-8822-4411",
    coordinate: "-6.3015, 106.6628",
    targetVolume: 60000,
    currentVolumeReceived: 41200,
    totalTripsReceived: 3433,
    status: "in_progress",
    startDate: "2026-03-01",
    targetCompletionDate: "2026-10-15",
    receivingHours: "08:00 - 17:00 WIB",
    notes: "Peninggian elevasi tanah cluster perumahan blok B & C."
  },
  {
    id: "DST-04",
    name: "Reklamasi & Elevasi Logistik Marunda",
    code: "MRD-04",
    location: "Marunda, Cilincing, Jakarta Utara",
    projectManager: "PT Karya Marunda Logistik (Bpk. Budi Santoso)",
    phone: "0815-4433-2211",
    coordinate: "-6.1082, 106.9745",
    targetVolume: 80000,
    currentVolumeReceived: 29800,
    totalTripsReceived: 1490,
    status: "in_progress",
    startDate: "2026-04-10",
    targetCompletionDate: "2026-12-31",
    receivingHours: "06:00 - 22:00 WIB",
    notes: "Timbunan tanah merah padat untuk yard kontainer pelabuhan."
  }
];
