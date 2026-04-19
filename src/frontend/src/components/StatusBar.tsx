import { Clock, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { ConnectionStatus } from "../types/bitcoin";

interface StatusBarProps {
  status: ConnectionStatus;
  lastUpdated?: bigint | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function StatusBar({
  status,
  lastUpdated,
  onRefresh,
  isRefreshing,
}: StatusBarProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (status === "success") setCountdown(30);
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 30 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = lastUpdated
    ? new Date(Number(lastUpdated) / 1_000_000).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const statusConfig = {
    idle: { color: "text-[#848e9c]", dot: "bg-[#848e9c]", label: "IDLE" },
    loading: {
      color: "text-[#f0b90b]",
      dot: "bg-[#f0b90b] animate-pulse",
      label: "LOADING",
    },
    fetching: {
      color: "text-[#f0b90b]",
      dot: "bg-[#f0b90b] animate-pulse",
      label: "FETCHING",
    },
    success: { color: "text-[#02c076]", dot: "bg-[#02c076]", label: "LIVE" },
    error: { color: "text-[#f84960]", dot: "bg-[#f84960]", label: "ERROR" },
  };

  const cfg = statusConfig[status];

  return (
    <div
      data-ocid="statusbar.panel"
      className="flex items-center justify-between px-4 py-2 border-b border-[#23272e] bg-[#161a1e] font-mono text-xs"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className={cfg.color}>{cfg.label}</span>
        </div>
        {status === "error" ? (
          <WifiOff className="w-3.5 h-3.5 text-[#f84960]" />
        ) : (
          <Wifi className="w-3.5 h-3.5 text-[#848e9c]" />
        )}
        <span className="text-[#848e9c] uppercase tracking-widest">
          BTC/USD · BTC/INR
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[#848e9c]">
          <Clock className="w-3 h-3" />
          <span>
            Updated: <span className="text-[#eaecef]">{formattedTime}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#848e9c]">
          <span>Next in:</span>
          <span className="text-[#eaecef] tabular-nums w-6 text-right">
            {countdown}s
          </span>
        </div>
        <button
          type="button"
          data-ocid="statusbar.refresh_button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-2 py-1 rounded border border-[#2b3139] text-[#848e9c] hover:text-[#eaecef] hover:border-[#474d57] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
