import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. 12.5 or -3.2
  timeframe?: string; // e.g. "vs last month"
  icon: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  timeframe = "vs last month",
  icon,
  className = "",
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-custom/60 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-text-custom tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-text-custom/50 font-medium">{timeframe}</span>
        </div>
      )}
    </Card>
  );
};
