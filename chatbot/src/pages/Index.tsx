import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Building2, TrendingUp } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { AnalysisChart } from "@/components/AnalysisChart";
import { DataTable } from "@/components/DataTable";
import { FileUpload } from "@/components/FileUpload";
import { processQuery, QueryResult } from "@/utils/queryProcessor";
import { RealEstateData, realEstateDataset } from "@/data/realEstateData";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

const Index = () => {
  const [currentDataset, setCurrentDataset] = useState<RealEstateData[]>(realEstateDataset);
  const [hasUploadedData, setHasUploadedData] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Real Estate Analysis Assistant. Ask me about property trends in areas like Wakad, Aundh, Hinjewadi, Baner, Ambegaon Budruk, or Akurdi.\n\nTry queries like:\n• 'Analyze Wakad'\n• 'Compare Aundh and Baner demand trends'\n• 'Show price growth for Hinjewadi'",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<QueryResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update available areas when dataset changes
  useEffect(() => {
    const areas = Array.from(new Set(currentDataset.map(d => d.area))).sort();
    setAvailableAreas(areas);
  }, [currentDataset]);

  const handleDataLoaded = (data: RealEstateData[]) => {
    setCurrentDataset(data);
    setHasUploadedData(true);
    setCurrentAnalysis(null);
    
    const areas = Array.from(new Set(data.map(d => d.area))).sort();
    setMessages([
      {
        text: `Great! I've loaded ${data.length} records covering ${areas.length} areas: ${areas.join(", ")}.\n\nYou can now ask me questions about your data. Try queries like:\n• 'Analyze ${areas[0]}'\n• 'Compare ${areas[0]} and ${areas[1] || areas[0]}'\n• 'Show trends for all areas'`,
        isUser: false,
      },
    ]);
  };

  const handleResetData = () => {
    setCurrentDataset(realEstateDataset);
    setHasUploadedData(false);
    setCurrentAnalysis(null);
    setMessages([
      {
        text: "Switched back to demo data. Ask me about property trends in areas like Wakad, Aundh, Hinjewadi, Baner, Ambegaon Budruk, or Akurdi.",
        isUser: false,
      },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const result = processQuery(userMessage, currentDataset);
      setCurrentAnalysis(result);
      setMessages((prev) => [...prev, { text: result.summary, isUser: false }]);
      setIsProcessing(false);

      if (result.chartData.length > 0) {
        toast.success("Analysis complete! Check the charts and data below.");
      }
    }, 800);
  };

  const quickQueries = [
    "Analyze Wakad",
    "Compare Aundh and Ambegaon Budruk demand",
    "Show price growth for Hinjewadi",
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      {/* Left Side - Chat Interface */}
      <div className="flex min-h-0 w-full flex-1 flex-col border-border lg:w-1/2 lg:border-r">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Real Estate Analysis</h1>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
          ))}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Buttons */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 px-3 pb-3 sm:px-4"> 
            {quickQueries.map((query, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setInput(query)}
                className="whitespace-nowrap text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-border bg-card p-3 sm:p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about real estate trends..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button type="submit" disabled={isProcessing || !input.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Right Side - Visualizations */}
      <div className="flex min-h-0 w-full flex-1 flex-col border-border bg-muted/30 lg:w-1/2 lg:border-l">
        {/* File Upload Section */}
        <div className="border-b border-border p-3 sm:p-4">
          <FileUpload
            onDataLoaded={handleDataLoaded}
            onReset={handleResetData}
            hasUploadedData={hasUploadedData}
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:space-y-6 sm:p-6">
          {currentAnalysis && currentAnalysis.chartData.length > 0 ? (
            <>
              <AnalysisChart
                data={currentAnalysis.chartData}
                type={currentAnalysis.type === "comparison" ? "comparison" : "price"}
                areas={currentAnalysis.areas}
              />
              <AnalysisChart
                data={currentAnalysis.chartData}
                type="demand"
                areas={currentAnalysis.areas}
              />
              <DataTable data={currentAnalysis.tableData} />
            </>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center py-10">
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Start Analyzing
                </h2>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Upload a spreadsheet or send a query to explore price and demand trends across areas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
