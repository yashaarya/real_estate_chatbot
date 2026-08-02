import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, X, CheckCircle2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseExcelFile, generateSampleExcel } from "@/utils/excelParser";
import { RealEstateData } from "@/data/realEstateData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataLoaded: (data: RealEstateData[]) => void;
  onReset: () => void;
  hasUploadedData: boolean;
}

const REQUIRED_COLUMNS = ["year", "area", "avgPrice", "demand", "avgSize", "transactions"];

export const FileUpload = ({ onDataLoaded, onReset, hasUploadedData }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
    <Card
      className={cn(
        "transition-all duration-200 border shadow-sm",
        hasUploadedData ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground/30"
      )}
    >
      <CardContent className="p-3 sm:p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {hasUploadedData ? (
          /* Active State View */
          <div className="space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-none mb-1">Custom Dataset Active</h3>
                  <p className="text-xs text-muted-foreground">Currently displaying uploaded Excel data</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                disabled={isProcessing}
                className="flex-1 text-xs h-8 w-full"
              >
                <FileUp className="w-3.5 h-3.5 mr-1.5" />
                Replace File
              </Button>
              <Button onClick={handleReset} variant="ghost" size="sm" className="flex-1 text-xs h-8 w-full text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5 mr-1.5" />
                Reset to Demo
              </Button>
            </div>
          </div>
        ) : (
          /* Upload State View */
          <div className="space-y-1">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
               
                <div>
                  <h3 className="font-semibold text-sm leading-none mb-1">Upload Data</h3>
                  <p className="text-xs text-muted-foreground">Import your real estate metrics</p>
                </div>
              <Button
                onClick={handleDownloadSample}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-white h-8 px-2 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Sample
              </Button>
            </div>

            {/* Dropzone area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5 min-h-[140px] sm:min-h-[unset]",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
                isProcessing && "opacity-50 pointer-events-none"
              )}
            >
              <Upload className="w-5 h-3 text-muted-foreground" />
              <div className="text-xs">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <p className="text-[10px] text-muted-foreground">Supports .xlsx, .xls, .csv</p>
            </div>

            {/* Expected Columns Indicator */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                Required Columns
              </span>
              <div className="flex flex-wrap gap-1">
                {REQUIRED_COLUMNS.map((col) => (
                  <Badge key={col} variant="secondary" className="text-[10px] px-1.5 py-0 font-mono font-normal">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};