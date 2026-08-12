import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload.tsx";
import { ChatMessage } from "@/components/ChatMessage";
import { AnalysisChart } from "@/components/AnalysisChart";
import { DataTable } from "@/components/DataTable";
import { toast } from "sonner";
import { processQuery, QueryResult } from "@/utils/queryProcessor";
import { RealEstateData, realEstateDataset } from "@/data/realEstateData";
import {
  MoonStar,
  Send,
  Sparkles,
  RotateCcw,
  TrendingUp,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import logo from "@/logo.png";

interface Message {
  text: string;
  isUser: boolean;
}

const Index = () => {
  const [currentDataset, setCurrentDataset] =
    useState<RealEstateData[]>(realEstateDataset);

  const [hasUploadedData, setHasUploadedData] = useState(false);

  const { theme, setTheme } = useTheme();

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Real Estate Analyst. Upload a dataset above or ask a question to generate insights.",
      isUser: false,
    },
  ]);

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<QueryResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- DATA HANDLING ---------------- */

  const handleDataLoaded = (data: RealEstateData[]) => {
    setCurrentDataset(data);
    setHasUploadedData(true);
    setCurrentAnalysis(null);

    const areas = Array.from(new Set(data.map((d) => d.area))).sort();

    setMessages((prev) => [
      ...prev,
      {
        text: `Data loaded! (${data.length} records). Ask me a query like "Analyze ${
          areas[0] || "an area"
        }" to generate full charts.`,
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
        text: "Hello! I'm your Real Estate Analyst. Upload a dataset above or ask a question to generate insights.",
        isUser: false,
      },
    ]);
  };

  /* ---------------- CHAT SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------------- QUERY HANDLING ---------------- */

  const runQuery = (query: string) => {
    const userMessage = query.trim();

    if (!userMessage || isProcessing) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        isUser: true,
      },
    ]);

    setIsProcessing(true);

    setTimeout(() => {
      const result = processQuery(userMessage, currentDataset);

      setCurrentAnalysis(result);

      setMessages((prev) => [
        ...prev,
        {
          text: result.summary,
          isUser: false,
        },
      ]);

      setIsProcessing(false);

      if (result.chartData.length > 0) {
        toast.success("Charts generated successfully.");
      }
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isProcessing) return;

    runQuery(input);
  };

  /* ---------------- EXAMPLE QUERIES ---------------- */

  const datasetAreas = Array.from(
    new Set(currentDataset.map((data) => data.area))
  ).sort();
  const firstArea = datasetAreas[0] ?? "Wakad";
  const secondArea = datasetAreas[1] ?? firstArea;
  const thirdArea = datasetAreas[2] ?? secondArea;

  const exampleQueries = [
    `Analyze ${firstArea}`,
    `Compare demand in ${firstArea} and ${secondArea}`,
    `Compare prices in ${secondArea} and ${thirdArea}`,
    `Show price trends for ${thirdArea}`,
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground font-sans">

      {/* ================= HEADER ================= */}

      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6 shadow-sm backdrop-blur-xl dark:border-sky-500/15 dark:bg-card/70 z-20">

        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5">
            <img
              src={logo}
              alt="EstateIQ Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="truncate text-lg sm:text-xl font-bold text-foreground tracking-tight">
            EstateIQ
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="gap-2 border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:border-sky-500/20 dark:bg-white/5 dark:text-sky-200 dark:hover:bg-sky-500/10"
          >
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}

            <span className="hidden sm:inline">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </Button>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="bg-background lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:snap-y lg:snap-mandatory">

        {/* ================= UPLOAD SECTION ================= */}

        <section className="min-h-[calc(100dvh-3.5rem)] w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 bg-slate-200 dark:bg-background lg:snap-start">

          <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-[1600px] flex-col rounded-2xl sm:rounded-3xl bg-card shadow-sm backdrop-blur-xl overflow-hidden dark:bg-[#131f33]/75 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

            <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-10">

              <div className="welcome-card w-full max-w-3xl rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md">

                <div className="mb-6 text-center">

                  <h2 className="bg-gradient-to-r from-primary via-cyan-500 to-teal-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                    Welcome to EstateIQ
                  </h2>

                  <p className="mt-3 text-base sm:text-lg text-muted-foreground">
                    Import real estate data to unlock AI insights, charts, and comparisons.
                  </p>

                </div>

                <FileUpload
                  onDataLoaded={handleDataLoaded}
                  onReset={handleResetData}
                  hasUploadedData={hasUploadedData}
                />

              </div>
            </div>
          </div>
        </section>

        {/* ================= CHAT + VISUALIZATION ================= */}

        <section className="min-h-[calc(100dvh-3.5rem)] w-full px-3 py-3 sm:px-6 sm:py-6 lg:h-[calc(100dvh-3.5rem)] lg:px-8 lg:py-10 bg-slate-200 dark:bg-background lg:snap-start lg:overflow-hidden">

          <div className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-[1600px] flex-col gap-4 sm:gap-6 lg:h-full lg:min-h-0 lg:flex-row lg:overflow-hidden">

            {/* ================= AI ASSISTANT ================= */}

            <aside className="flex h-[min(620px,78dvh)] w-full flex-col rounded-2xl border border-border bg-card shadow-sm backdrop-blur-xl overflow-hidden shrink-0 lg:h-full lg:w-[400px] lg:basis-[400px] min-h-0 dark:border-white/10 dark:bg-[#131f33]/75 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

              <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between shrink-0 dark:border-white/10 dark:bg-white/5">

                <h2 className="font-semibold text-foreground">
                  Ask AI Assistant
                </h2>

              </div>

              {/* CHAT BODY - INDEPENDENT SCROLL */}

              <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4">

                {/* CLICKABLE EXAMPLE QUERIES */}

                {hasUploadedData && (
                  <div className="space-y-2">

                    <p className="text-xs font-medium text-muted-foreground">
                      Try asking
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {exampleQueries.map((query) => (
                        <Button
                          key={query}
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => runQuery(query)}
                          className="h-auto min-h-8 rounded-full px-3 py-1.5 text-left text-[11px] font-normal whitespace-normal transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed"
                        >
                          {query}
                        </Button>
                      ))}

                    </div>

                  </div>
                )}

                {/* CHAT MESSAGES */}

                {messages.map((msg, idx) => {
                  return (
                    <ChatMessage
                      key={idx}
                      message={msg.text}
                      isUser={msg.isUser}
                      showExampleQueries={!msg.isUser && idx === 0}
                      onExampleQuery={(q) => runQuery(q)}
                      exampleQueries={exampleQueries}
                      disabled={isProcessing}
                    />
                  );
                })}

                {/* PROCESSING STATE */}

                {isProcessing && (
                  <div className="flex gap-3 animate-pulse">

                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 dark:bg-sky-500/10">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                    </div>

                    <div className="bg-muted/50 border border-border rounded-2xl px-4 py-2 text-xs text-muted-foreground dark:border-white/10">
                      Generating charts...
                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />

              </div>

              {/* CHAT INPUT */}

              <form
                onSubmit={handleSubmit}
                className="p-3 sm:p-4 border-t border-border bg-muted/5 shrink-0 dark:border-white/10 dark:bg-white/5"
              >

                <div className="flex gap-2 relative">

                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isProcessing}
                    className="flex-1 rounded-full bg-white dark:bg-card focus-visible:ring-primary pl-4 pr-12 text-sm min-w-0"
                  />

                  <Button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>

                </div>

              </form>

            </aside>

            {/* ================= VISUALIZATION ================= */}

            <section className="flex min-h-[520px] w-full flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm backdrop-blur-xl overflow-hidden min-w-0 lg:h-full lg:min-h-0 dark:border-white/10 dark:bg-[#131f33]/75 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

              <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between shrink-0 dark:border-white/10 dark:bg-white/5">

                <h2 className="font-semibold text-foreground">
                  Analysis & Visualization
                </h2>

                {currentAnalysis && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentAnalysis(null)}
                    className="h-8 text-xs text-muted-foreground gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear View
                  </Button>
                )}

              </div>

              {/* VISUALIZATION - INDEPENDENT SCROLL */}

              <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-slate-50/50 dark:bg-white/5">

                {currentAnalysis &&
                currentAnalysis.chartData.length > 0 ? (

                  <div className="space-y-6 max-w-4xl mx-auto pb-6 animate-in fade-in zoom-in-95 duration-500">

                    {/* CHART GRID */}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">

                      <div className="rounded-xl border border-border bg-card p-1 shadow-sm dark:border-white/10">

                        <AnalysisChart
                          data={currentAnalysis.chartData}
                          type={
                            currentAnalysis.type === "comparison"
                              ? "comparison"
                              : "price"
                          }
                          areas={currentAnalysis.areas}
                        />

                      </div>

                      <div className="rounded-xl border border-border bg-card p-1 shadow-sm dark:border-white/10">

                        <AnalysisChart
                          data={currentAnalysis.chartData}
                          type="demand"
                          areas={currentAnalysis.areas}
                        />

                      </div>

                    </div>

                    {/* DATA TABLE */}

                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden dark:border-white/10">
                      <DataTable data={currentAnalysis.tableData} />
                    </div>

                  </div>

                ) : (

                  <div className="flex h-full min-h-[420px] sm:min-h-[350px] flex-col items-center justify-center text-center px-2">

                    <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-sky-500/10 mb-4 border shadow-sm dark:border-sky-500/20">

                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 dark:text-sky-300" />

                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      Awaiting Query
                    </h3>

                    <p className="max-w-xs text-xs sm:text-sm text-muted-foreground mb-4">
                      Ask a question in the AI Assistant to automatically generate interactive charts here.
                    </p>

                  </div>

                )}

              </div>

            </section>

          </div>

        </section>

      </main>
    </div>
  );
};

export default Index;
