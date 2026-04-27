"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: false })

    if (!error) setStudents(data || [])
  }

  // ➕ ADD STUDENT
  async function addStudent() {
    const name = prompt("Enter name")
    const studentClass = prompt("Enter class")
    const email = prompt("Enter email")

    if (!name) return

    setLoading(true)

    const { error } = await supabase.from("students").insert([
      {
        name,
        class: studentClass,
        email,
      },
    ])

    setLoading(false)

    if (error) {
      toast.error("Error adding student ❌")
    } else {
      toast.success("Student added ✅")
      fetchStudents()
    }
  }

  // ❌ DELETE STUDENT
  async function deleteStudent(id: number) {
    const confirmDelete = confirm("Delete this student?")
    if (!confirmDelete) return

    setLoading(true)

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)

    setLoading(false)

    if (error) {
      toast.error("Error deleting student ❌")
    } else {
      toast.success("Student deleted ✅")
      fetchStudents()
    }
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Students</h1>

        <button
          onClick={addStudent}
          disabled={loading}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add Student"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <p className="text-sm text-gray-400">{student.email}</p>
            <p className="text-sm mt-1">Class: {student.class}</p>

            <button
              onClick={() => deleteStudent(student.id)}
              disabled={loading}
              className="mt-3 text-red-400 hover:text-red-500 text-sm disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}