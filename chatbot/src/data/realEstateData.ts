// Mock real estate dataset simulating Excel data structure
export interface RealEstateData {
  year: number;
  area: string;
  avgPrice: number;
  demand: number;
  avgSize: number;
  transactions: number;
}

export const realEstateDataset: RealEstateData[] = [
  // Wakad
  { year: 2022, area: "Wakad", avgPrice: 6500, demand: 85, avgSize: 1200, transactions: 450 },
  { year: 2023, area: "Wakad", avgPrice: 7200, demand: 90, avgSize: 1180, transactions: 520 },
  { year: 2024, area: "Wakad", avgPrice: 7800, demand: 88, avgSize: 1150, transactions: 580 },
  { year: 2025, area: "Wakad", avgPrice: 8400, demand: 92, avgSize: 1130, transactions: 620 },
  
  // Aundh
  { year: 2022, area: "Aundh", avgPrice: 8200, demand: 92, avgSize: 1100, transactions: 380 },
  { year: 2023, area: "Aundh", avgPrice: 8900, demand: 95, avgSize: 1080, transactions: 420 },
  { year: 2024, area: "Aundh", avgPrice: 9600, demand: 94, avgSize: 1050, transactions: 460 },
  { year: 2025, area: "Aundh", avgPrice: 10200, demand: 96, avgSize: 1030, transactions: 490 },
  
  // Ambegaon Budruk
  { year: 2022, area: "Ambegaon Budruk", avgPrice: 5800, demand: 75, avgSize: 1300, transactions: 320 },
  { year: 2023, area: "Ambegaon Budruk", avgPrice: 6200, demand: 78, avgSize: 1280, transactions: 350 },
  { year: 2024, area: "Ambegaon Budruk", avgPrice: 6700, demand: 80, avgSize: 1250, transactions: 380 },
  { year: 2025, area: "Ambegaon Budruk", avgPrice: 7100, demand: 82, avgSize: 1230, transactions: 410 },
  
  // Akurdi
  { year: 2022, area: "Akurdi", avgPrice: 5200, demand: 72, avgSize: 1350, transactions: 280 },
  { year: 2023, area: "Akurdi", avgPrice: 5600, demand: 75, avgSize: 1320, transactions: 310 },
  { year: 2024, area: "Akurdi", avgPrice: 6100, demand: 77, avgSize: 1300, transactions: 340 },
  { year: 2025, area: "Akurdi", avgPrice: 6500, demand: 79, avgSize: 1280, transactions: 370 },
  
  // Hinjewadi
  { year: 2022, area: "Hinjewadi", avgPrice: 7000, demand: 88, avgSize: 1150, transactions: 520 },
  { year: 2023, area: "Hinjewadi", avgPrice: 7600, demand: 91, avgSize: 1120, transactions: 580 },
  { year: 2024, area: "Hinjewadi", avgPrice: 8300, demand: 93, avgSize: 1100, transactions: 640 },
  { year: 2025, area: "Hinjewadi", avgPrice: 9000, demand: 95, avgSize: 1080, transactions: 700 },
  
  // Baner
  { year: 2022, area: "Baner", avgPrice: 8800, demand: 94, avgSize: 1050, transactions: 420 },
  { year: 2023, area: "Baner", avgPrice: 9500, demand: 96, avgSize: 1030, transactions: 460 },
  { year: 2024, area: "Baner", avgPrice: 10300, demand: 97, avgSize: 1000, transactions: 500 },
  { year: 2025, area: "Baner", avgPrice: 11000, demand: 98, avgSize: 980, transactions: 540 },
];

export const areas = Array.from(new Set(realEstateDataset.map(d => d.area))).sort();
