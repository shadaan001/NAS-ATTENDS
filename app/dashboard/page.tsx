"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { MarkAttendance } from "@/components/dashboard/mark-attendance"
import { Reports } from "@/components/dashboard/reports"
import { StudentsList } from "@/components/dashboard/students-list"
import { MyClasses } from "@/components/dashboard/my-classes"
import { Profile } from "@/components/dashboard/profile"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Calendar,
  Users,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react"

function TeacherDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    subjects: 0,
  })

  const highlightedDates: Date[] = []

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) return

      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!teacher) return

      const { data: assignments } = await supabase
        .from("teacher_assignments")
        .select("class_id")
        .eq("teacher_id", teacher.id)

      const classIds = assignments?.map((a: any) => a.class_id) || []

      const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .in("class_id", classIds.length ? classIds : ["00000000-0000-0000-0000-000000000000"])

      const { count: classCount } = await supabase
        .from("teacher_assignments")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", teacher.id)

      setStats({
        students: studentCount || 0,
        classes: classCount || 0,
        subjects: 5,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-glass p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-primary -translate-y-1/2 translate-x-1/4" />
        <div className="absolute left-1/4 bottom-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-accent translate-y-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome back</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back <span className="text-primary neon-text">👋</span>
            </h2>

            <p className="text-muted-foreground mt-2 max-w-xl">
              Manage your classes and attendance from here
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <span className="text-muted-foreground">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Classes"
          value={stats.classes.toString()}
          subtitle="Your assigned classes"
          icon={Calendar}
          variant="primary"
        />

        <StatsCard
          title="Total Students"
          value={stats.students.toString()}
          subtitle="Across all classes"
          icon={Users}
          variant="accent"
        />

        <StatsCard
          title="Average Attendance"
          value="--%"
          subtitle="Coming soon"
          icon={TrendingUp}
          variant="success"
        />

        <StatsCard
          title="Subjects"
          value={stats.subjects.toString()}
          subtitle="Subjects you teach"
          icon={BookOpen}
          variant="default"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarWidget
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            highlightedDates={highlightedDates}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No classes scheduled 🚀
          </div>
        </div>
      </div>
    </div>
  )
}

// 🔥 MAIN DASHBOARD - WITH MOBILE SIDEBAR SUPPORT
export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getPageTitle = () => {
    switch (activeItem) {
      case "Dashboard": return "Teacher Dashboard"
      case "Mark Attendance": return "Mark Attendance"
      case "My Classes": return "My Classes"
      case "Students": return "Students"
      case "Attendance Report":
      case "Subject Wise Report":
      case "Teacher Wise Report": return "Attendance Report"
      case "Profile": return "Profile"
      default: return "Dashboard"
    }
  }

  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard": return <TeacherDashboard />
      case "Mark Attendance": return <MarkAttendance />
      case "My Classes": return <MyClasses />
      case "Students": return <StudentsList />
      case "Attendance Report":
      case "Subject Wise Report":
      case "Teacher Wise Report": return <Reports />
      case "Profile": return <Profile />
      default: return <TeacherDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Mobile + Desktop */}
      <Sidebar 
        activeItem={activeItem} 
        onNavigate={setActiveItem}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:ml-[260px] transition-all duration-300">
        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}