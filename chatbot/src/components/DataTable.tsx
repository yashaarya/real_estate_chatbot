import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RealEstateData } from "@/data/realEstateData";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  data: RealEstateData[];
}

export const DataTable = ({ data }: DataTableProps) => {
  if (data.length === 0) return null;

  const downloadCSV = () => {
    const headers = ["Year", "Area", "Avg Price (₹/sqft)", "Demand Index", "Avg Size (sqft)", "Transactions"];
    const rows = data.map(d => [d.year, d.area, d.avgPrice, d.demand, d.avgSize, d.transactions]);
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "real_estate_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Filtered Data</CardTitle>
          <CardDescription>{data.length} records found</CardDescription>
        </div>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Area</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Demand</TableHead>
                <TableHead className="text-right">Avg Size</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.year}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell className="text-right">₹{row.avgPrice}/sqft</TableCell>
                  <TableCell className="text-right">{row.demand}</TableCell>
                  <TableCell className="text-right">{row.avgSize} sqft</TableCell>
                  <TableCell className="text-right">{row.transactions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
