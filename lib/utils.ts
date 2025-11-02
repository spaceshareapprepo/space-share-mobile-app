import { clsx, type ClassValue } from "clsx";
// import Papa from "papaparse";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export interface AirportData {
//   id: number;
//   name: string;
//   city: string | null;
//   country: string | null;
//   iataCode: string | null;
//   icaoCode: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   elevationFt: number | null;
//   timezoneOffset: number | null;
//   dst: string | null;
//   timezone: string | null;
//   type: string | null;
//   source: string | null;
// }

// export async function fetchAirportData(): Promise<string> {

//   console.log("Fetching airport data from OpenFlights...");
//   const response = await fetch(
//     "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
//   );
//   if (!response.ok) {
//     throw new Error(`Failed to fetch data: ${response.statusText}`);
//   }
//   return await response.text();
// }

// export function parseAirportData(csvData: string): AirportData[] {
//   console.log("Parsing airport data...");
  
//   const parsed = Papa.parse<string[]>(csvData, {
//     header: false,
//     skipEmptyLines: true,
//     transform: (value: string) => {
//       if (value === String.raw`\N` || value === '' || value === 'null') {
//         return null;
//       }
//       return value;
//     }
//   });

//   return parsed.data
//     .filter((row: string[]) => {
//       const country = row[3];
//       const iataCode = row[4]
//       const timeZone = row[11]
//       // Early filtering BEFORE parsing - more efficient
//       return (country === "Ghana" || country === "United States")  && iataCode !== null && timeZone !== null;
//     })
//     .map((row: string[]) => {
//       const parseFloatNum = (val: string | null): number | null => {
//         if (!val || val === String.raw`\N`) return null;
//         const num = Number(val);
//         return Number.isNaN(num) ? null : num;
//       };

//       const parseIntNum = (val: string | null): number | null => {
//         if (!val || val === String.raw`\N`) return null;
//         const num = Number(val);
//         return Number.isNaN(num) ? null : Math.floor(num);
//       };

//       return {
//         id: parseIntNum(row[0]) || 0,
//         name: row[1] || 'Unknown Airport',
//         city: row[2] || null,
//         country: row[3] || null,
//         iataCode: row[4] || null,
//         icaoCode: row[5] || null,
//         latitude: parseFloatNum(row[6]),
//         longitude: parseFloatNum(row[7]),
//         elevationFt: parseIntNum(row[8]),
//         timezoneOffset: parseIntNum(row[9]),
//         dst: row[10] || null,
//         timezone: row[11] || null,
//         type: row[12] || null,
//         source: row[13] || null,
//       };
//     });
// }
