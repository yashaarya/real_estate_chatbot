import { RealEstateData } from "@/data/realEstateData";

export interface QueryResult {
  summary: string;
  chartData: RealEstateData[];
  tableData: RealEstateData[];
  areas: string[];
  type: "single" | "comparison" | "trend";
}

export function processQuery(query: string, dataset: RealEstateData[]): QueryResult {
  const lowerQuery = query.toLowerCase();
  
  // Get available areas from dataset
  const areas = Array.from(new Set(dataset.map(d => d.area))).sort();
  
  // Extract area names from query
  const mentionedAreas = areas.filter(area => 
    lowerQuery.includes(area.toLowerCase())
  );

  if (mentionedAreas.length === 0) {
    return {
      summary: `I couldn't identify any specific area in your query. Available areas in the dataset: ${areas.join(", ")}.\n\nPlease mention an area from this list.`,
      chartData: [],
      tableData: [],
      areas: [],
      type: "single"
    };
  }

  // Filter data for mentioned areas
  const filteredData = dataset.filter(d => 
    mentionedAreas.includes(d.area)
  );

  // Determine query type
  const isComparison = mentionedAreas.length > 1 || lowerQuery.includes("compare");
  const isDemandQuery = lowerQuery.includes("demand");
  const isPriceQuery = lowerQuery.includes("price") || lowerQuery.includes("growth");
  
  // Generate summary based on query type
  let summary = "";
  
  if (isComparison && mentionedAreas.length > 1) {
    const area1Data = filteredData.filter(d => d.area === mentionedAreas[0]);
    const area2Data = filteredData.filter(d => d.area === mentionedAreas[1]);
    
    const area1Latest = area1Data[area1Data.length - 1];
    const area2Latest = area2Data[area2Data.length - 1];
    
    if (isDemandQuery) {
      summary = `Comparing demand trends between ${mentionedAreas[0]} and ${mentionedAreas[1]}:\n\n` +
        `${mentionedAreas[0]} shows a current demand index of ${area1Latest.demand}, with consistent growth over the years. ` +
        `${mentionedAreas[1]} has a demand index of ${area2Latest.demand}. ` +
        `${area1Latest.demand > area2Latest.demand ? mentionedAreas[0] : mentionedAreas[1]} demonstrates stronger market demand. ` +
        `Both areas show positive momentum, making them attractive for real estate investment.`;
    } else {
      summary = `Comparative analysis of ${mentionedAreas[0]} vs ${mentionedAreas[1]}:\n\n` +
        `${mentionedAreas[0]}: Current avg price ₹${area1Latest.avgPrice}/sqft, demand index ${area1Latest.demand}\n` +
        `${mentionedAreas[1]}: Current avg price ₹${area2Latest.avgPrice}/sqft, demand index ${area2Latest.demand}\n\n` +
        `${area1Latest.avgPrice > area2Latest.avgPrice ? mentionedAreas[1] : mentionedAreas[0]} offers better value, ` +
        `while ${area1Latest.demand > area2Latest.demand ? mentionedAreas[0] : mentionedAreas[1]} shows higher market demand.`;
    }
    
    return {
      summary,
      chartData: filteredData,
      tableData: filteredData,
      areas: mentionedAreas,
      type: "comparison"
    };
  }

  // Single area analysis
  const area = mentionedAreas[0];
  const areaData = filteredData.filter(d => d.area === area).sort((a, b) => a.year - b.year);
  
  if (areaData.length === 0) {
    return {
      summary: `No data available for ${area}.`,
      chartData: [],
      tableData: [],
      areas: [area],
      type: "single"
    };
  }

  const latestData = areaData[areaData.length - 1];
  const oldestData = areaData[0];
  const priceGrowthNum = ((latestData.avgPrice - oldestData.avgPrice) / oldestData.avgPrice * 100);
  const demandGrowthNum = ((latestData.demand - oldestData.demand) / oldestData.demand * 100);
  const priceGrowth = priceGrowthNum.toFixed(1);
  const demandGrowth = demandGrowthNum.toFixed(1);

  if (isPriceQuery) {
    summary = `Price analysis for ${area}:\n\n` +
      `Current average price: ₹${latestData.avgPrice}/sqft\n` +
      `Price growth (${oldestData.year}-${latestData.year}): ${priceGrowth}%\n` +
      `Year-over-year growth: Strong upward trend\n\n` +
      `The area has shown consistent price appreciation with ${latestData.transactions} transactions in ${latestData.year}. ` +
      `This indicates a healthy market with good liquidity and investor confidence.`;
  } else if (isDemandQuery) {
    summary = `Demand analysis for ${area}:\n\n` +
      `Current demand index: ${latestData.demand}/100\n` +
      `Demand growth: ${demandGrowth}%\n` +
      `Market activity: ${latestData.transactions} transactions\n\n` +
      `${area} maintains ${latestData.demand > 85 ? 'strong' : 'moderate'} demand with ` +
      `${demandGrowthNum > 5 ? 'accelerating' : 'steady'} growth momentum. ` +
      `The consistent transaction volume suggests sustained buyer interest.`;
  } else {
    summary = `Comprehensive analysis of ${area}:\n\n` +
      `📊 Current Metrics (${latestData.year}):\n` +
      `• Average Price: ₹${latestData.avgPrice}/sqft\n` +
      `• Demand Index: ${latestData.demand}/100\n` +
      `• Avg Property Size: ${latestData.avgSize} sqft\n` +
      `• Transactions: ${latestData.transactions}\n\n` +
      `📈 Growth Trends:\n` +
      `• Price Growth: ${priceGrowth}% (${oldestData.year}-${latestData.year})\n` +
      `• Demand Growth: ${demandGrowth}%\n\n` +
      `${area} is ${latestData.demand > 90 ? 'a premium locality' : latestData.demand > 80 ? 'an emerging hotspot' : 'a developing area'} ` +
      `with ${priceGrowthNum > 20 ? 'excellent' : priceGrowthNum > 10 ? 'good' : 'steady'} appreciation potential.`;
  }

  return {
    summary,
    chartData: areaData,
    tableData: areaData,
    areas: [area],
    type: "trend"
  };
}
