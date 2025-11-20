import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { parseExcelFile, generateSampleExcel } from "@/utils/excelParser";
import { RealEstateData } from "@/data/realEstateData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataLoaded: (data: RealEstateData[]) => void;
  onReset: () => void;
  hasUploadedData: boolean;
}

export const FileUpload = ({ onDataLoaded, onReset, hasUploadedData }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.loading("Parsing Excel file...", { id: "excel-parse" });

    try {
      const result = await parseExcelFile(file);

      if (result.success && result.data) {
        onDataLoaded(result.data);
        toast.success(`Successfully loaded ${result.rowCount} records!`, { id: "excel-parse" });
      } else {
        toast.error(result.error || "Failed to parse file", { id: "excel-parse" });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: "excel-parse" });
      console.error("File upload error:", error);
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownloadSample = () => {
    const blob = generateSampleExcel();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_real_estate_data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sample file downloaded!");
  };

  const handleReset = () => {
    onReset();
    toast.info("Switched back to demo data");
  };

  return (
    <Card className={cn("shadow-md", hasUploadedData && "border-accent")}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {hasUploadedData ? "Custom Dataset Active" : "Upload Your Data"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {hasUploadedData
                  ? "Using your uploaded Excel file"
                  : "Upload Excel file with real estate data"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasUploadedData ? (
              <Button onClick={handleReset} variant="outline" size="sm" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Use Demo Data
              </Button>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Upload Excel"}
                </Button>
                <Button onClick={handleDownloadSample} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Sample
                </Button>
              </>
            )}
          </div>

          {!hasUploadedData && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
              <p className="font-medium mb-1">Required columns:</p>
              <p>year, area, avgPrice, demand, avgSize, transactions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
