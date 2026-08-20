// targets.js — Target & Achievement Configuration & Data

export const INITIAL_TARGETS = {
  daily: [
    {
      id: "TGT-D-01",
      category: "truck",
      entityId: "TRK-01",
      entityName: "DT-01 (B 9142 TDA)",
      targetTrips: 3,
      targetVolume: 60,
      actualTrips: 2,
      actualVolume: 40,
      unit: "m³"
    },
    {
      id: "TGT-D-02",
      category: "truck",
      entityId: "TRK-02",
      entityName: "DT-02 (B 9381 UDA)",
      targetTrips: 3,
      targetVolume: 66,
      actualTrips: 2,
      actualVolume: 44,
      unit: "m³"
    },
    {
      id: "TGT-D-03",
      category: "truck",
      entityId: "TRK-03",
      entityName: "DT-03 (B 9512 KDA)",
      targetTrips: 2,
      targetVolume: 48,
      actualTrips: 2,
      actualVolume: 48,
      unit: "m³"
    },
    {
      id: "TGT-D-04",
      category: "truck",
      entityId: "TRK-04",
      entityName: "DT-04 (B 9660 WDA)",
      targetTrips: 3,
      targetVolume: 60,
      actualTrips: 2,
      actualVolume: 40,
      unit: "m³"
    },
    {
      id: "TGT-D-05",
      category: "truck",
      entityId: "TRK-06",
      entityName: "DT-06 (B 9811 PDA)",
      targetTrips: 4,
      targetVolume: 48,
      actualTrips: 2,
      actualVolume: 24,
      unit: "m³"
    },
    {
      id: "TGT-D-06",
      category: "truck",
      entityId: "TRK-08",
      entityName: "DT-08 (B 9233 ZDA)",
      targetTrips: 2,
      targetVolume: 48,
      actualTrips: 2,
      actualVolume: 48,
      unit: "m³"
    },
    {
      id: "TGT-D-07",
      category: "source",
      entityId: "SRC-01",
      entityName: "Quarry Bukit Hambalang",
      targetTrips: 8,
      targetVolume: 176,
      actualTrips: 6,
      actualVolume: 132,
      unit: "m³"
    },
    {
      id: "TGT-D-08",
      category: "source",
      entityId: "SRC-02",
      entityName: "Galian C Rumpin Indah",
      targetTrips: 5,
      targetVolume: 84,
      actualTrips: 3,
      actualVolume: 48,
      unit: "m³"
    },
    {
      id: "TGT-D-09",
      category: "destination",
      entityId: "DST-01",
      entityName: "Proyek Tol Cisumdawu Seksi 3",
      targetTrips: 6,
      targetVolume: 136,
      actualTrips: 5,
      actualVolume: 112,
      unit: "m³"
    },
    {
      id: "TGT-D-10",
      category: "destination",
      entityId: "DST-03",
      entityName: "Pembangunan Residensial Grand Serpong",
      targetTrips: 5,
      targetVolume: 72,
      actualTrips: 3,
      actualVolume: 48,
      unit: "m³"
    }
  ],
  weekly: [
    {
      id: "TGT-W-01",
      category: "truck",
      entityId: "TRK-01",
      entityName: "DT-01 (B 9142 TDA)",
      targetTrips: 18,
      targetVolume: 360,
      actualTrips: 17,
      actualVolume: 340,
      unit: "m³"
    },
    {
      id: "TGT-W-02",
      category: "truck",
      entityId: "TRK-02",
      entityName: "DT-02 (B 9381 UDA)",
      targetTrips: 18,
      targetVolume: 396,
      actualTrips: 18,
      actualVolume: 396,
      unit: "m³"
    },
    {
      id: "TGT-W-03",
      category: "truck",
      entityId: "TRK-03",
      entityName: "DT-03 (B 9512 KDA)",
      targetTrips: 14,
      targetVolume: 336,
      actualTrips: 15,
      actualVolume: 360,
      unit: "m³"
    },
    {
      id: "TGT-W-04",
      category: "destination",
      entityId: "DST-01",
      entityName: "Proyek Tol Cisumdawu Seksi 3",
      targetTrips: 40,
      targetVolume: 920,
      actualTrips: 41,
      actualVolume: 948,
      unit: "m³"
    },
    {
      id: "TGT-W-05",
      category: "destination",
      entityId: "DST-02",
      entityName: "Penimbunan Kawasan Industri Cikarang",
      targetTrips: 30,
      targetVolume: 660,
      actualTrips: 27,
      actualVolume: 594,
      unit: "m³"
    }
  ],
  monthly: [
    {
      id: "TGT-M-01",
      category: "project",
      entityId: "DST-01",
      entityName: "Proyek Tol Cisumdawu Seksi 3",
      targetTrips: 180,
      targetVolume: 4100,
      actualTrips: 174,
      actualVolume: 3980,
      unit: "m³"
    },
    {
      id: "TGT-M-02",
      category: "project",
      entityId: "DST-02",
      entityName: "Penimbunan Kawasan Industri Cikarang",
      targetTrips: 140,
      targetVolume: 3080,
      actualTrips: 136,
      actualVolume: 2992,
      unit: "m³"
    },
    {
      id: "TGT-M-03",
      category: "project",
      entityId: "DST-03",
      entityName: "Pembangunan Residensial Grand Serpong",
      targetTrips: 120,
      targetVolume: 2160,
      actualTrips: 125,
      actualVolume: 2250,
      unit: "m³"
    },
    {
      id: "TGT-M-04",
      category: "project",
      entityId: "DST-04",
      entityName: "Reklamasi Logistik Marunda",
      targetTrips: 90,
      targetVolume: 1800,
      actualTrips: 76,
      actualVolume: 1520,
      unit: "m³"
    }
  ]
};
