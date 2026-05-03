"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Calendar as CalendarIcon,
  Users,
  Check,
  X,
  UserCheck,
  UserX,
  Save,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { supabase } from "@/lib/supabase"

interface Student {
  id: string
  rollNo: string
  name: string
  status: "present" | "absent" | null
}

export function MarkAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const presentCount = students.filter((s) => s.status === "present").length
  const absentCount = students.filter((s) => s.status === "absent").length
  const totalMarked = presentCount + absentCount
  const attendancePercentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0

  // Load classes and subjects for logged-in teacher
  useEffect(() => {
    loadTeacherData()
  }, [])

  async function loadTeacherData() {
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

      // Fetch unique classes via teacher_assignments
      const { data: assignments, error } = await supabase
        .from("teacher_assignments")
        .select("class_id, classes(name)")
        .eq("teacher_id", teacher.id)

      if (error) {
        console.error("Error fetching classes:", error)
        return
      }

      const uniqueClasses = Array.from(
        new Map(
          assignments?.map((item: any) => [
            item.class_id,
            { id: item.class_id, name: item.classes?.name || "Unknown" },
          ]) || []
        ).values()
      )

      setClasses(uniqueClasses)
    } catch (err) {
      console.error("Error in loadTeacherData:", err)
    }
  }

  // Load subjects when class is selected
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([])
      setSelectedSubject("")
      return
    }
    loadSubjectsForClass()
  }, [selectedClass])

  async function loadSubjectsForClass() {
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

      const { data, error } = await supabase
        .from("teacher_assignments")
        .select("subject")
        .eq("teacher_id", teacher.id)
        .eq("class_id", selectedClass)

      if (error) {
        console.error("Error fetching subjects:", error)
        return
      }

      // Get unique subjects
      const uniqueSubjects = Array.from(
        new Set(data?.map((item: any) => item.subject) || [])
      ).map((sub) => ({ value: sub, label: sub }))

      setSubjects(uniqueSubjects)
      
      // Auto-select first subject if available
      if (uniqueSubjects.length > 0 && !selectedSubject) {
        setSelectedSubject(uniqueSubjects[0].value)
      }
    } catch (err) {
      console.error("Error loading subjects:", err)
    }
  }

  // Load students for selected class
  const handleLoadStudents = async () => {
    if (!selectedClass) {
      alert("Please select a class")
      return
    }

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("class_id", selectedClass)
        .order("name")

      if (error) {
        alert("Error loading students ❌")
        console.error(error)
        return
      }

      const formatted = data?.map((s: any) => ({
        id: s.id,
        rollNo: "N/A",
        name: s.name,
        status: null,
      })) || []

      setStudents(formatted)
      setIsLoaded(true)
    } catch (err) {
      alert("Failed to load students")
      console.error(err)
    }
  }

  const handleStatusChange = (studentId: string, status: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    )
  }

  const handleMarkAll = (status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })))
  }

  const handleSave = async () => {
    if (students.length === 0) return

    try {
      for (let student of students) {
        if (!student.status) continue

        const today = selectedDate

        // Check if record exists
        const { data: existing } = await supabase
          .from("attendance")
          .select("*")
          .eq("student_id", student.id)
          .eq("date", today)
          .single()

        if (existing) {
          await supabase
            .from("attendance")
            .update({ 
              status: student.status,
              class_id: selectedClass 
            })
            .eq("student_id", student.id)
            .eq("date", today)
        } else {
          await supabase.from("attendance").insert([
            {
              student_id: student.id,
              class_id: selectedClass,
              status: student.status,
              date: today,
            },
          ])
        }
      }

      alert("Attendance Saved ✅")
    } catch (err) {
      alert("Error saving attendance")
      console.error(err)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filters */}
        <div className="card-glass p-5 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Mark Attendance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 bg-secondary/50 border-white/5"
                />
              </div>
            </div>

            {/* Class Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select Class
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-secondary/50 border-white/5">
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Subject Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select Subject
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-secondary/50 border-white/5">
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  {subjects.length > 0 ? (
                    subjects.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleLoadStudents}
            disabled={!selectedClass || !selectedSubject}
            className="mt-4 gradient-primary text-white hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Students
          </Button>
        </div>

        {/* Students Table */}
        {isLoaded && (
          <div className="card-glass rounded-2xl overflow-hidden">
            {/* Table Header Actions */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">{students.length} Students</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll("present")}
                  className="border-success/30 text-success hover:bg-success/10"
                >
                  <UserCheck className="h-4 w-4 mr-1.5" />
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll("absent")}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <UserX className="h-4 w-4 mr-1.5" />
                  Mark All Absent
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Roll No</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Student Name</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-white/5 hover:bg-white/[0.02]"
                    >
                      <TableCell className="font-mono text-sm">
                        {student.rollNo}
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(student.id, "present")}
                            className={cn(
                              "h-9 px-4 transition-all duration-200",
                              student.status === "present"
                                ? "bg-success text-white border-success hover:bg-success/90"
                                : "border-white/10 hover:border-success/50 hover:text-success"
                            )}
                          >
                            <Check className="h-4 w-4 mr-1.5" />
                            Present
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(student.id, "absent")}
                            className={cn(
                              "h-9 px-4 transition-all duration-200",
                              student.status === "absent"
                                ? "bg-destructive text-white border-destructive hover:bg-destructive/90"
                                : "border-white/10 hover:border-destructive/50 hover:text-destructive"
                            )}
                          >
                            <X className="h-4 w-4 mr-1.5" />
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Save Button */}
            <div className="p-5 border-t border-white/5">
              <Button
                onClick={handleSave}
                className="w-full gradient-primary text-white hover:opacity-90 h-11"
                disabled={totalMarked !== students.length}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Sidebar */}
      <div className="space-y-6">
        {/* Circular Progress */}
        <div className="card-glass p-6 rounded-2xl">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Attendance Progress
          </h4>
          
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(attendancePercentage / 100) * 440} 440`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.7 0.25 280)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 250)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">
                {attendancePercentage}%
              </span>
              <span className="text-xs text-muted-foreground mt-1">Attendance</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-glass p-5 rounded-2xl space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Quick Stats
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Present</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-success">{presentCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Absent</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-destructive">{absentCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Total</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">{students.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}