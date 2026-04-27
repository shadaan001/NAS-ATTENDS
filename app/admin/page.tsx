"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { getUserRole } from "@/lib/getUserRole"
import { toast } from "sonner"
// Lucide Icons
import { 
  Users, 
  UserCog, 
  BookOpen, 
  CalendarCheck, 
  TrendingUp, 
  Plus, 
  Search,
  X
} from "lucide-react"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export default function AdminDashboard() {
  const router = useRouter()
  useEffect(() => {
  checkAccess()
}, [])
async function checkAccess() {
  const role = await getUserRole()

  if (!role) {
    console.log("No role yet, skipping redirect")
    return
  }

  if (role === "admin") {
    return
  }

  if (role === "teacher") {
    router.push("/dashboard")
    return
  }
}

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    attendance: 0,
  })
  

  // Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)

  // Form States
  const [studentName, setStudentName] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [teacherName, setTeacherName] = useState("")
  const [teacherEmail, setTeacherEmail] = useState("")

  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    getStats()
    loadClasses()
  }, [])

  async function getStats() {
    const [
      { count: studentCount },
      { count: teacherCount },
      { count: subjectCount },
      { count: attendanceCount }
    ] = await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("teachers").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase.from("attendance").select("*", { count: "exact", head: true }),
    ])

    setStats({
      students: studentCount || 0,
      teachers: teacherCount || 0,
      subjects: subjectCount || 0,
      attendance: attendanceCount || 0,
    })
  }

  async function loadClasses() {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name")
    
    setClasses(data || [])
  }

  // Add Student
  const handleAddStudent = async () => {
    if (!studentName.trim() || !selectedClassId) return

    const { error } = await supabase
      .from("students")
      .insert({
        name: studentName.trim(),
        class_id: selectedClassId,
      })

    if (error) {
      toast.error("Error adding student: " + error.message)
      return
    }

    // Reset form and close modal
    setStudentName("")
    setSelectedClassId("")
    setShowAddStudentModal(false)
    
    // Refresh stats
    getStats()
    toast.success("Student added successfully ✅")
  }

  // Add Teacher
  const handleAddTeacher = async () => {
    if (!teacherName.trim() || !teacherEmail.trim()) return

    // Insert into profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        name: teacherName.trim(),
        email: teacherEmail.trim().toLowerCase(),
        role: "teacher",
      })
      .select("id")
      .single()

    if (profileError) {
      alert("Error creating profile: " + profileError.message)
      return
    }

    // Insert into teachers table
    const { error: teacherError } = await supabase
      .from("teachers")
      .insert({
        user_id: profile.id,   // using profile id as user_id reference
      })

    if (teacherError) {
      alert("Error adding teacher: " + teacherError.message)
      return
    }

    // Reset form and close modal
    setTeacherName("")
    setTeacherEmail("")
    setShowAddTeacherModal(false)
    
    // Refresh stats
    getStats()
    alert("Teacher added successfully ✅")
  }

  // Dummy data for charts
  const attendanceData = [
    { name: "Present", value: 1248, fill: "#22c55e" },
    { name: "Absent", value: 187, fill: "#ef4444" },
  ]

  const subjectData = [
    { subject: "Mathematics", attendance: 92 },
    { subject: "Physics", attendance: 88 },
    { subject: "Chemistry", attendance: 95 },
    { subject: "English", attendance: 79 },
    { subject: "Biology", attendance: 85 },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* MAIN CONTENT AREA */}
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2 text-lg">Welcome back • Overview of your institution</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-2xl transition-all active:scale-95">
              <Search className="w-5 h-5" />
              <span className="text-sm">Quick search...</span>
            </button>
            <button 
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6 py-3 rounded-2xl font-medium transition-all active:scale-95 shadow-lg shadow-violet-500/30"
            >
              <Plus className="w-5 h-5" />
              Quick Add
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Students */}
          <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +12%
              </div>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">
              {stats.students}
            </div>
            <p className="text-gray-400 mt-2 text-lg">Total Students</p>
          </div>

          {/* Total Teachers */}
          <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center">
                <UserCog className="w-7 h-7 text-violet-400" />
              </div>
              <div className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +3
              </div>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">{stats.teachers}</div>
            <p className="text-gray-400 mt-2 text-lg">Total Teachers</p>
          </div>

          {/* Total Subjects */}
          <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">{stats.subjects}</div>
            <p className="text-gray-400 mt-2 text-lg">Total Subjects</p>
          </div>

          {/* Total Attendance Records */}
          <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">{stats.attendance}</div>
            <p className="text-gray-400 mt-2 text-lg">Attendance Records</p>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Pie Chart - Attendance Distribution */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-8">Attendance Overview</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#020617" strokeWidth={8} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Subject-wise Attendance */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-8">Subject Performance</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="subject" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="attendance" fill="#6366f1" radius={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS / RECENT SECTION */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowAddStudentModal(true)}
                className="h-28 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all hover:border-white/30"
              >
                <Users className="w-8 h-8" />
                <span className="font-medium">Add Student</span>
              </button>
              <button 
                onClick={() => setShowAddTeacherModal(true)}
                className="h-28 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all hover:border-white/30"
              >
                <UserCog className="w-8 h-8" />
                <span className="font-medium">Add Teacher</span>
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-6 text-sm text-gray-400">
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                <div>New student registered • Aryan Sharma</div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                <div>Attendance marked for Class 10-A</div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-400" />
                <div>New subject added • Computer Science</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold">Add New Student</h3>
                <button 
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-8 flex gap-4">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!studentName.trim() || !selectedClassId}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-medium transition-all disabled:opacity-50"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold">Add New Teacher</h3>
                <button 
                  onClick={() => setShowAddTeacherModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Teacher Name</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Enter teacher full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-8 flex gap-4">
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                disabled={!teacherName.trim() || !teacherEmail.trim()}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-medium transition-all disabled:opacity-50"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}