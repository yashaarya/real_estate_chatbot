
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  showExampleQueries?: boolean;
  onExampleQuery?: (query: string) => void;
  exampleQueries?: string[];
  disabled?: boolean;
}

export const ChatMessage = ({
  message,
  isUser,
  showExampleQueries = false,
  onExampleQuery,
  exampleQueries,
  disabled = false,
}: ChatMessageProps) => {
  const defaultQueries = [
    "Analyze Wakad",
    "Compare demand in Wakad and Hinjewadi",
    "Compare prices in Aundh and Baner",
    "Show price trends for Ambegaon Budruk",
  ];

  const queriesToShow = exampleQueries && exampleQueries.length > 0 ? exampleQueries : defaultQueries;

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 mb-3 sm:mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-[88%] sm:max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground border border-border shadow-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Example Queries */}
        {!isUser && showExampleQueries && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-1">
              Try asking
            </p>

            <div className="flex flex-wrap gap-2">
              {queriesToShow.map((query) => (
                <button
                  key={query}
                  type="button"
                  disabled={disabled}
                  onClick={() => onExampleQuery?.(query)}
                  className={cn(
                    "rounded-full border border-border bg-background",
                    "px-3 py-1.5 text-xs text-foreground",
                    "transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};
