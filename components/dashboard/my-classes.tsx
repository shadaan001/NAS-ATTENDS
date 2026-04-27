"use client"

import { cn } from "@/lib/utils"
import {
  Users,
  Clock,
  BookOpen,
  ChevronRight,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function MyClasses() {
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return

    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!teacher) return

    const { data: classData } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacher.id)

    if (!classData) return

    // 🔥 enrich class data (students count etc)
    const formatted = await Promise.all(
      classData.map(async (cls: any) => {
        const { data: students } = await supabase
          .from("students")
          .select("id")
          .eq("class_id", cls.id)

        return {
          id: cls.id,
          name: cls.name,
          subject: "Subject", // can improve later
          students: students?.length || 0,
          avgAttendance: 0,
          schedule: "Not set",
          time: "--:--",
          nextClass: "Coming soon",
          color: "from-primary/20 to-primary/5",
        }
      })
    )

    setClasses(formatted)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Classes</h2>
          <p className="text-muted-foreground mt-1">
            Manage your assigned classes and schedules
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">
            {classes.length} Active Classes
          </span>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-2 flex items-center justify-center h-40 text-gray-400">
            No classes available 🚀
          </div>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br border border-white/5",
                "hover:border-white/10 transition-all duration-300",
                classItem.color
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {classItem.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="mt-2 border-primary/30 text-primary bg-primary/10"
                    >
                      {classItem.subject}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {classItem.students}
                      </p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {classItem.avgAttendance}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg. Attendance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <Progress
                    value={classItem.avgAttendance}
                    className="h-1.5 bg-white/10"
                  />
                </div>

                {/* Schedule */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{classItem.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium text-foreground">
                      Next: {classItem.nextClass}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}