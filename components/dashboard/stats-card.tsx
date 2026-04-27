"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "accent" | "success"
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "from-white/5 to-white/[0.02]",
    primary: "from-primary/20 to-primary/5",
    accent: "from-accent/20 to-accent/5",
    success: "from-success/20 to-success/5",
  }

  const iconStyles = {
    default: "bg-white/10 text-foreground",
    primary: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent",
    success: "bg-success/20 text-success",
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5",
        "bg-gradient-to-br border border-white/5",
        "backdrop-blur-xl transition-all duration-300",
        "hover:border-white/10 hover:shadow-lg hover:shadow-primary/5",
        variantStyles[variant]
      )}
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-20",
        "transition-all duration-500 group-hover:opacity-40 group-hover:scale-125",
        variant === "primary" && "bg-primary",
        variant === "accent" && "bg-accent",
        variant === "success" && "bg-success",
        variant === "default" && "bg-white"
      )} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-center h-12 w-12 rounded-xl",
            "transition-all duration-300 group-hover:scale-110",
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
