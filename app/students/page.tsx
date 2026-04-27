"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState<any[]>([])

  useEffect(() => {
    fetchAttendance()
  }, [])

  async function fetchAttendance() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const studentId = user?.user_metadata?.student_id

    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    setAttendance(data || [])
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>

      {attendance.map((a) => (
        <div key={a.id} className="p-3 mb-2 bg-white/5 rounded">
          {a.date} → {a.status}
        </div>
      ))}
    </div>
  )
}