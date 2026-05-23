const ROMAN_MONTHS = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

interface GenerateOptions {
  number: number;
  prefix?: string | null;
  division?: string | null;
  date: Date;
}

/**
 * Generate letter number from a format template.
 * 
 * Available placeholders:
 * - {NUMBER} → Sequential number (zero-padded to 3 digits)
 * - {PREFIX} → Letter prefix (e.g. "SKL", "UND")
 * - {DIVISION} → Division/department code (e.g. "DWP", "HRD")
 * - {MONTH} → Month in Roman numerals (I-XII)
 * - {MONTH_NUM} → Month as number (01-12)
 * - {YEAR} → Full year (e.g. 2025)
 * - {YEAR_SHORT} → Short year (e.g. 25)
 * - {DAY} → Day of month (01-31)
 * 
 * Example format: "{PREFIX}/{NUMBER}/{DIVISION}/{MONTH}/{YEAR}"
 * Result: "SKL/001/DWP/V/2025"
 */
export function generateLetterNumber(format: string, options: GenerateOptions): string {
  const { number, prefix, division, date } = options;

  const padNumber = String(number).padStart(3, "0");
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  let result = format;
  result = result.replace(/\{NUMBER\}/g, padNumber);
  result = result.replace(/\{PREFIX\}/g, prefix ?? "");
  result = result.replace(/\{DIVISION\}/g, division ?? "");
  result = result.replace(/\{MONTH\}/g, ROMAN_MONTHS[month]);
  result = result.replace(/\{MONTH_NUM\}/g, String(month + 1).padStart(2, "0"));
  result = result.replace(/\{YEAR\}/g, String(year));
  result = result.replace(/\{YEAR_SHORT\}/g, String(year).slice(-2));
  result = result.replace(/\{DAY\}/g, String(date.getDate()).padStart(2, "0"));

  // Clean up double slashes from empty values
  result = result.replace(/\/+/g, "/");
  result = result.replace(/^\/|\/$/g, "");

  return result;
}

/**
 * Get available format placeholders for display in settings
 */
export function getFormatPlaceholders() {
  return [
    { key: "{NUMBER}", description: "Nomor urut (001, 002, ...)" },
    { key: "{PREFIX}", description: "Prefix surat (SKL, UND, ...)" },
    { key: "{DIVISION}", description: "Kode divisi (DWP, HRD, ...)" },
    { key: "{MONTH}", description: "Bulan romawi (I, II, ..., XII)" },
    { key: "{MONTH_NUM}", description: "Bulan angka (01-12)" },
    { key: "{YEAR}", description: "Tahun penuh (2025)" },
    { key: "{YEAR_SHORT}", description: "Tahun singkat (25)" },
    { key: "{DAY}", description: "Tanggal (01-31)" },
  ];
}
