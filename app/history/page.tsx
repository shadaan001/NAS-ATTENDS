"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HistoryPage() {
  const [studentId, setStudentId] = useState("")
  const [records, setRecords] = useState<any[]>([])

  async function fetchHistory() {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      alert("Error ❌")
    } else {
      setRecords(data)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Attendance History</h1>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button onClick={fetchHistory}>Search</Button>
      </div>

      {/* Table */}
      <div className="mt-4">
        {records.map((r) => (
          <div
            key={r.id}
            className="border p-3 rounded mb-2 flex justify-between"
          >
            <span>{r.date}</span>
            <span
              className={
                r.status === "present"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}