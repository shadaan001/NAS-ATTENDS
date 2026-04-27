"use client"

import { cn } from "@/lib/utils"
import { Clock, Users, BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ClassItem {
  id: string
  time: string
  className: string
  subject: string
  students: number
  status: "upcoming" | "ongoing" | "completed"
}

const todayClasses: ClassItem[] = [
  {
    id: "1",
    time: "09:00 AM",
    className: "Class XII-A",
    subject: "Physics",
    students: 42,
    status: "completed",
  },
  {
    id: "2",
    time: "10:30 AM",
    className: "Class XI-B",
    subject: "Mathematics",
    students: 38,
    status: "completed",
  },
  {
    id: "3",
    time: "12:00 PM",
    className: "Class X-A",
    subject: "Chemistry",
    students: 45,
    status: "ongoing",
  },
  {
    id: "4",
    time: "02:00 PM",
    className: "Class XII-B",
    subject: "Physics",
    students: 40,
    status: "upcoming",
  },
  {
    id: "5",
    time: "03:30 PM",
    className: "Class IX-A",
    subject: "Mathematics",
    students: 48,
    status: "upcoming",
  },
]

export function TodayClasses() {
  const statusStyles = {
    upcoming: "bg-warning/10 text-warning border-warning/20",
    ongoing: "bg-success/10 text-success border-success/20 animate-pulse",
    completed: "bg-muted text-muted-foreground border-transparent",
  }

  const statusLabels = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
  }

  return (
    <div className="card-glass p-5 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today&apos;s Classes</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {todayClasses.length} classes scheduled
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Classes List */}
      <div className="space-y-3">
        {todayClasses.map((classItem, index) => (
          <div
            key={classItem.id}
            className={cn(
              "group relative p-4 rounded-xl",
              "bg-white/[0.02] border border-white/5",
              "transition-all duration-200",
              "hover:bg-white/[0.05] hover:border-white/10",
              classItem.status === "ongoing" && "border-success/30 bg-success/[0.03]"
            )}
          >
            {/* Time indicator line */}
            {index < todayClasses.length - 1 && (
              <div className="absolute left-[30px] top-[60px] w-0.5 h-[calc(100%-24px)] bg-white/5" />
            )}

            <div className="flex items-start gap-4">
              {/* Time */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    "text-xs font-semibold",
                    classItem.status === "ongoing"
                      ? "gradient-primary text-white neon-glow-sm"
                      : "bg-white/5 text-muted-foreground"
                  )}
                >
                  <Clock className="h-5 w-5" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{classItem.className}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{classItem.subject}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-medium shrink-0",
                      statusStyles[classItem.status]
                    )}
                  >
                    {statusLabels[classItem.status]}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{classItem.students} students</span>
                  </div>
                  <span className="text-xs font-medium text-primary">{classItem.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
