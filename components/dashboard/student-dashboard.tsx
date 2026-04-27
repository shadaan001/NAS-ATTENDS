"use client"

import { cn } from "@/lib/utils"
import { StatsCard } from "./stats-card"
import {
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Progress } from "@/components/ui/progress"

const monthlyData = [
  { month: "Jan", attendance: 92 },
  { month: "Feb", attendance: 88 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 90 },
  { month: "May", attendance: 87 },
  { month: "Jun", attendance: 93 },
  { month: "Jul", attendance: 96 },
  { month: "Aug", attendance: 91 },
  { month: "Sep", attendance: 94 },
  { month: "Oct", attendance: 89 },
  { month: "Nov", attendance: 92 },
  { month: "Dec", attendance: 95 },
]

const subjectData = [
  { subject: "Physics", attendance: 94, totalClasses: 48, attended: 45 },
  { subject: "Chemistry", attendance: 88, totalClasses: 45, attended: 40 },
  { subject: "Mathematics", attendance: 96, totalClasses: 52, attended: 50 },
  { subject: "Biology", attendance: 90, totalClasses: 42, attended: 38 },
  { subject: "English", attendance: 92, totalClasses: 40, attended: 37 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-white/10">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-primary mt-1">
          Attendance: {payload[0].value}%
        </p>
      </div>
    )
  }
  return null
}

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-glass p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full blur-3xl opacity-20 bg-primary -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="text-primary">Priya!</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your attendance overview for the current semester
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Subjects"
          value="5"
          subtitle="Active this semester"
          icon={BookOpen}
          variant="primary"
        />
        <StatsCard
          title="Overall Attendance"
          value="92%"
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
          variant="accent"
        />
        <StatsCard
          title="Present Days"
          value="210"
          subtitle="Out of 227 days"
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Absent Days"
          value="17"
          subtitle="This semester"
          icon={XCircle}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 card-glass p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Monthly Attendance Trend
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your attendance percentage over the past year
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">2024</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.25 280)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.25 280)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="oklch(0.7 0.25 280)"
                  strokeWidth={2}
                  fill="url(#colorAttendance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card-glass p-5 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            This Week
          </h3>
          <div className="space-y-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
              const isPresent = index !== 2 // Wednesday absent for demo
              return (
                <div
                  key={day}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    "border transition-all duration-200",
                    isPresent
                      ? "bg-success/5 border-success/20"
                      : "bg-destructive/5 border-destructive/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center text-sm font-medium",
                        isPresent ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}
                    >
                      {day.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{day}</span>
                  </div>
                  {isPresent ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="card-glass p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Subject-wise Attendance
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your attendance breakdown by subject
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectData.map((subject) => (
            <div
              key={subject.subject}
              className={cn(
                "p-4 rounded-xl",
                "bg-white/[0.02] border border-white/5",
                "hover:bg-white/[0.05] hover:border-white/10",
                "transition-all duration-200"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{subject.subject}</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    subject.attendance >= 90
                      ? "text-success"
                      : subject.attendance >= 80
                      ? "text-warning"
                      : "text-destructive"
                  )}
                >
                  {subject.attendance}%
                </span>
              </div>
              <Progress
                value={subject.attendance}
                className="h-2 bg-white/5"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {subject.attended} of {subject.totalClasses} classes attended
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
