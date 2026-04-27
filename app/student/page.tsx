"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "@/components/students/sidebar"
import Navbar from "@/components/students/Navbar"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Import Lucide Icons (add to your project: npm install lucide-react)
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Award, 
  BookOpen, 
  UserCheck, 
  AlertCircle 
} from "lucide-react"

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  })

  useEffect(() => {
    fetchAttendance()
  }, [])

  async function fetchAttendance() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", user.id)
      .order("date", { ascending: false })

    if (!data) return

    setAttendance(data)

    const total = data.length
    const present = data.filter((a) => a.status === "present").length
    const absent = total - present
    const percentage = total ? Math.round((present / total) * 100) : 0

    setStats({ total, present, absent, percentage })
  }

  // Group attendance by subject for subject-wise stats
  const subjectStats = attendance.reduce((acc: any, record: any) => {
    const key = record.subject || "General"
    if (!acc[key]) {
      acc[key] = {
        subject: key,
        teacher: record.teacher || "N/A",
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
      }
    }
    acc[key].total += 1
    if (record.status === "present") acc[key].present += 1
    else acc[key].absent += 1
    acc[key].percentage = Math.round((acc[key].present / acc[key].total) * 100)
    return acc
  }, {})

  const subjectArray = Object.values(subjectStats)

  const chartData = [
    { name: "Present", value: stats.present },
    { name: "Absent", value: stats.absent },
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 p-8 overflow-y-auto">
          {/* HEADER */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">Welcome Back 👋</h1>
                <p className="text-gray-400 mt-2 text-lg">Track your academic journey with clarity</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* OVERALL STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Classes</p>
                  <p className="text-4xl font-semibold tabular-nums tracking-tighter mt-1">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Present</p>
                  <p className="text-4xl font-semibold text-emerald-400 tabular-nums tracking-tighter mt-1">{stats.present}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 hover:border-red-500/40 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Absent</p>
                  <p className="text-4xl font-semibold text-red-400 tabular-nums tracking-tighter mt-1">{stats.absent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Overall Attendance</p>
                  <p className="text-4xl font-semibold text-cyan-400 tabular-nums tracking-tighter mt-1">{stats.percentage}<span className="text-2xl">%</span></p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* PIE CHART + OVERALL PROGRESS */}
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Pie Chart */}
            <div className="lg:col-span-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">Attendance Overview</h2>
                  <p className="text-gray-400 text-sm mt-1">Present vs Absent Distribution</p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={95}
                      outerRadius={140}
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} stroke="#020617" strokeWidth={6} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)",
                        color: "#e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject-wise Mini Stats */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                Subject Performance
              </h2>

              {subjectArray.length > 0 ? (
                <div className="space-y-6 flex-1">
                  {subjectArray.slice(0, 3).map((sub: any, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{sub.subject}</span>
                          <p className="text-xs text-gray-500">{sub.teacher}</p>
                        </div>
                        <span className="font-mono font-semibold text-emerald-400">{sub.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">Subject data will appear here</p>
              )}
            </div>
          </div>

          {/* SUBJECT-WISE DETAILED CARDS */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              Attendance by Subject
            </h2>

            {subjectArray.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {subjectArray.map((sub: any, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-semibold">{sub.subject}</h3>
                        <p className="text-gray-400 text-sm mt-1">{sub.teacher}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-semibold text-white tabular-nums">{sub.percentage}<span className="text-lg">%</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-2xl font-semibold mt-1">{sub.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-400">Present</p>
                        <p className="text-2xl font-semibold text-emerald-400 mt-1">{sub.present}</p>
                      </div>
                      <div>
                        <p className="text-xs text-red-400">Absent</p>
                        <p className="text-2xl font-semibold text-red-400 mt-1">{sub.absent}</p>
                      </div>
                    </div>

                    <div className="mt-8 h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-2.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full transition-all"
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No subject-wise data available yet</p>
              </div>
            )}
          </div>

          {/* ATTENDANCE HISTORY */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                Attendance History
              </h2>
              <span className="text-sm text-gray-400 bg-white/5 px-5 py-2 rounded-2xl border border-white/10">
                Showing {attendance.length} records
              </span>
            </div>

            {attendance.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-20 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">No attendance records found</p>
                <p className="text-gray-500 mt-2">Your attendance will appear here once recorded</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendance.map((record) => (
                  <div 
                    key={record.id}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl px-10 py-6 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="text-right w-28">
                        <p className="font-mono text-sm text-gray-400">
                          {new Date(record.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-lg">{record.subject || "General Subject"}</p>
                        <p className="text-sm text-gray-400">{record.teacher || "—"}</p>
                      </div>
                    </div>

                    <div className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      record.status === "present" 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {record.status === "present" ? "Present" : "Absent"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}