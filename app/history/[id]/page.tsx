"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function StudentHistory() {
  const { id } = useParams()
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    if (id) fetchHistory()
  }, [id])

  async function fetchHistory() {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", id)
      .order("date", { ascending: false })

    if (error) {
      alert("Error loading history ❌")
    } else {
      setRecords(data)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Attendance History
      </h1>

      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        records.map((r) => (
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
        ))
      )}
    </div>
  )
}