import * as XLSX from "xlsx";
import { RealEstateData } from "@/data/realEstateData";
import { z } from "zod";

// Validation schema for Excel data
const excelRowSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  area: z.string().trim().min(1).max(100),
  avgPrice: z.number().positive(),
  demand: z.number().min(0).max(100),
  avgSize: z.number().positive(),
  transactions: z.number().int().nonnegative(),
});

export interface ParseResult {
  success: boolean;
  data?: RealEstateData[];
  error?: string;
  rowCount?: number;
}

// Map common column name variations to our standard format
const columnMappings: Record<string, string> = {
  // Year variations
  year: "year",
  yr: "year",
  
  // Area variations
  area: "area",
  location: "area",
  locality: "area",
  region: "area",
  
  // Price variations
  avgprice: "avgPrice",
  "avg price": "avgPrice",
  "average price": "avgPrice",
  price: "avgPrice",
  "price per sqft": "avgPrice",
  
  // Demand variations
  demand: "demand",
  "demand index": "demand",
  
  // Size variations
  avgsize: "avgSize",
  "avg size": "avgSize",
  "average size": "avgSize",
  size: "avgSize",
  
  // Transactions variations
  transactions: "transactions",
  "transaction count": "transactions",
  count: "transactions",
};

function normalizeColumnName(col: string): string {
  const normalized = col.toLowerCase().trim().replace(/[_\s]+/g, "");
  return columnMappings[normalized] || col;
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return {
        success: false,
        error: "Invalid file format. Please upload an Excel file (.xlsx, .xls) or CSV file.",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size exceeds 5MB limit. Please upload a smaller file.",
      };
    }

    // Read file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        error: "Excel file appears to be empty. Please check your file.",
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    if (rawData.length === 0) {
      return {
        success: false,
        error: "No data found in the Excel sheet. Please check your file.",
      };
    }

    // Transform and validate data
    const transformedData: RealEstateData[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i] as Record<string, any>;
      
      // Normalize column names
      const normalizedRow: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) {
        const normalizedKey = normalizeColumnName(key);
        normalizedRow[normalizedKey] = value;
      }

      // Check for required fields
      const requiredFields = ["year", "area", "avgPrice", "demand", "avgSize", "transactions"];
      const missingFields = requiredFields.filter(field => 
        normalizedRow[field] === null || normalizedRow[field] === undefined || normalizedRow[field] === ""
      );

      if (missingFields.length > 0) {
        errors.push(`Row ${i + 2}: Missing required fields - ${missingFields.join(", ")}`);
        continue;
      }

      // Convert string numbers to actual numbers if needed
      const processedRow = {
        year: typeof normalizedRow.year === "string" ? parseInt(normalizedRow.year) : normalizedRow.year,
        area: String(normalizedRow.area).trim(),
        avgPrice: typeof normalizedRow.avgPrice === "string" ? parseFloat(normalizedRow.avgPrice) : normalizedRow.avgPrice,
        demand: typeof normalizedRow.demand === "string" ? parseFloat(normalizedRow.demand) : normalizedRow.demand,
        avgSize: typeof normalizedRow.avgSize === "string" ? parseFloat(normalizedRow.avgSize) : normalizedRow.avgSize,
        transactions: typeof normalizedRow.transactions === "string" ? parseInt(normalizedRow.transactions) : normalizedRow.transactions,
      };

      // Validate row
      const validation = excelRowSchema.safeParse(processedRow);
      
      if (!validation.success) {
        const fieldErrors = validation.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
        errors.push(`Row ${i + 2}: ${fieldErrors}`);
        continue;
      }

      transformedData.push(validation.data as RealEstateData);
    }

    // Check if we have any valid data
    if (transformedData.length === 0) {
      return {
        success: false,
        error: `No valid data found. Errors:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n...and ${errors.length - 5} more errors` : ""}`,
      };
    }

    // Warn if some rows were skipped
    if (errors.length > 0) {
      console.warn(`Skipped ${errors.length} invalid rows:`, errors);
    }

    return {
      success: true,
      data: transformedData,
      rowCount: transformedData.length,
    };
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    return {
      success: false,
      error: `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// Generate a sample Excel file for download
export function generateSampleExcel(): Blob {
  const sampleData: RealEstateData[] = [
    {
      year: 2023,
      area: "Sample Area 1",
      avgPrice: 7500,
      demand: 85,
      avgSize: 1200,
      transactions: 450,
    },
    {
      year: 2024,
      area: "Sample Area 1",
      avgPrice: 8200,
      demand: 88,
      avgSize: 1180,
      transactions: 520,
    },
    {
      year: 2023,
      area: "Sample Area 2",
      avgPrice: 6800,
      demand: 78,
      avgSize: 1300,
      transactions: 380,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Real Estate Data");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
