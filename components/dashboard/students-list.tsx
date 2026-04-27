"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export function StudentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [attendanceMap, setAttendanceMap] = useState<any>({})

  useEffect(() => {
    fetchStudents()
  }, [])

  // 🔥 FETCH STUDENTS
  async function fetchStudents() {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return

    // ✅ FIX: handle null teacher
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!teacher) {
      console.log("Teacher not found ❌")
      return
    }

    const { data: classes } = await supabase
      .from("classes")
      .select("id, name")
      .eq("teacher_id", teacher.id)

    const classIds = classes?.map(c => c.id) || []

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .in("class_id", classIds)

    if (error || !data) {
      console.log(error)
      return
    }

    const formatted = data.map((student: any) => {
      const cls = classes?.find(c => c.id === student.class_id)

      return {
        ...student,
        className: cls?.name || "Unknown",
      }
    })

    setStudents(formatted)
    loadAttendance(formatted)
  }

  // 🔥 ATTENDANCE %
  async function getAttendancePercentage(studentId: string) {
    const { data } = await supabase
      .from("attendance")
      .select("status")
      .eq("student_id", studentId)

    if (!data) return 0

    const total = data.length
    const present = data.filter(d => d.status === "present").length

    return total === 0 ? 0 : Math.round((present / total) * 100)
  }

  async function loadAttendance(studentsData: any[]) {
    const map: any = {}

    for (let student of studentsData) {
      const percent = await getAttendancePercentage(student.id)
      map[student.id] = percent
    }

    setAttendanceMap(map)
  }

  // 🔥 ADD STUDENT
  async function addStudent() {
    const name = prompt("Enter name")
    const email = prompt("Enter email")

    if (!name) return

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return

    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!teacher) {
      alert("Teacher not found ❌")
      return
    }

    const { data: classes } = await supabase
      .from("classes")
      .select("id")
      .eq("teacher_id", teacher.id)

    const classId = classes?.[0]?.id

    if (!classId) {
      alert("No class found ❌")
      return
    }

    const { error } = await supabase.from("students").insert([
      {
        name,
        email,
        class_id: classId,
      },
    ])

    if (error) {
      alert("Error adding student ❌")
    } else {
      alert("Student added ✅")
      fetchStudents()
    }
  }

  // 🔥 MARK ATTENDANCE
  async function markAttendance(studentId: string, status: string) {
    const { data: student } = await supabase
      .from("students")
      .select("class_id")
      .eq("id", studentId)
      .single()

    if (!student) return

    const { error } = await supabase.from("attendance").insert([
      {
        student_id: studentId,
        class_id: student.class_id,
        status: status.toLowerCase(),
      },
    ])

    if (error) {
      alert("Error saving attendance ❌")
    } else {
      alert(`Marked ${status} ✅`)
      fetchStudents()
    }
  }

  // 🔍 FILTER
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground mt-1">
            Manage and view all enrolled students
          </p>
        </div>

        <Button onClick={addStudent} className="gradient-primary text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* SEARCH */}
      <div className="card-glass p-5 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="card-glass p-5 rounded-2xl">

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                />
                <AvatarFallback>{student.name?.[0]}</AvatarFallback>
              </Avatar>

              <div>
                <Link href={`/history/${student.id}`}>
                  <h3 className="font-semibold cursor-pointer">
                    {student.name}
                  </h3>
                </Link>
                <Badge>{student.className}</Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              {student.email}
            </p>

            <p className="mt-2 text-sm font-medium">
              Attendance: {attendanceMap[student.id] ?? 0}%
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => markAttendance(student.id, "present")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Present
              </button>

              <button
                onClick={() => markAttendance(student.id, "absent")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Absent
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}