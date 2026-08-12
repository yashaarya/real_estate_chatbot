import { useRef, useState } from "react";
import {
  Upload,
  Download,
  X,
  CheckCircle2,
  FileUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseExcelFile, generateSampleExcel } from "@/utils/excelParser";
import { RealEstateData } from "@/data/realEstateData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataLoaded: (data: RealEstateData[]) => void;
  onReset: () => void;
  hasUploadedData: boolean;
}

const REQUIRED_COLUMNS = [
  "year",
  "area",
  "avgPrice",
  "demand",
  "avgSize",
  "transactions",
];

export const FileUpload = ({
  onDataLoaded,
  onReset,
  hasUploadedData,
}: FileUploadProps) => {
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
        toast.success(`Successfully loaded ${result.rowCount} records!`, {
          id: "excel-parse",
        });
      } else {
        toast.error(result.error || "Failed to parse file", {
          id: "excel-parse",
        });
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
        "border-0 bg-card/80 backdrop-blur-md shadow-sm transition-all duration-300",
        "hover:shadow-md",
        hasUploadedData
          ? "bg-primary/5"
          : ""
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {hasUploadedData ? (
          <div className="space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] tracking-tight leading-none mb-1">
                    Custom Dataset Active
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Currently displaying uploaded Excel data
                  </p>
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

              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="flex-1 text-xs h-8 w-full text-muted-foreground hover:text-destructive"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Reset to Demo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[15px] tracking-tight leading-none mb-1">
                  Upload Your Dataset
                </h3>
                <p className="text-xs text-muted-foreground">
                  Import your real estate metrics to get AI-powered insights.
                </p>
              </div>

              <Button
                onClick={handleDownloadSample}
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Try Sample Data
              </Button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl px-4 py-5 sm:py-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[145px]",
                isDragging
                  ? "border-primary bg-primary/10 shadow-sm scale-[1.01]"
                  : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/[0.03]",
                isProcessing && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/10">
                <Upload className="w-5 h-5" />
              </div>

              <div className="text-sm">
                <span className="font-semibold text-primary">
                  Drop your dataset here
                </span>
                <span className="text-muted-foreground"> or </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="font-semibold text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Browse Files
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground">
                XLSX • XLS • CSV
              </p>
            </div>

            {/* Dataset requirements - hidden until info icon is clicked */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground">
                Dataset requirements
              </span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Show required dataset columns"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>

                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="max-w-xs p-3"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold">
                        Required columns
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Your file must contain these columns for AI analysis
                        and visualizations to work correctly.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {REQUIRED_COLUMNS.map((col) => (
                          <Badge
                            key={col}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0.5 font-mono font-normal"
                          >
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
