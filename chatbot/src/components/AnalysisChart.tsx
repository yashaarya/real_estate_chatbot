import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RealEstateData } from "@/data/realEstateData";

interface AnalysisChartProps {
  data: RealEstateData[];
  type: "price" | "demand" | "comparison";
  areas: string[];
}

export const AnalysisChart = ({ data, type, areas }: AnalysisChartProps) => {
  if (data.length === 0) return null;

  const isComparison = areas.length > 1;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>
          {type === "price" ? "Price Trends" : type === "demand" ? "Demand Trends" : "Comparative Analysis"}
        </CardTitle>
        <CardDescription>
          {isComparison
            ? `Comparing ${areas.join(" vs ")}`
            : `Historical data for ${areas[0]}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "price" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              {isComparison ? (
                areas.map((area, idx) => (
                  <Line
                    key={area}
                    type="monotone"
                    dataKey="avgPrice"
                    data={data.filter((d) => d.area === area)}
                    name={`${area} Price`}
                    stroke={`hsl(var(--chart-${idx + 1}))`}
                    strokeWidth={2}
                    dot={{ fill: `hsl(var(--chart-${idx + 1}))` }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  name="Avg Price (₹/sqft)"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 5 }}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="demand"
                name="Demand Index"
                fill="hsl(var(--chart-2))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
