"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { supabase } from "@/lib/supabase"

export function Reports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // ✅ Backend Report State
  const [report, setReport] = useState<any>({
    students: [],
    classes: [],
  })

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 90) {
      return <Badge className="bg-success/20 text-success border-success/30">Excellent</Badge>
    } else if (attendance >= 80) {
      return <Badge className="bg-warning/20 text-warning border-warning/30">Good</Badge>
    } else if (attendance >= 70) {
      return <Badge className="bg-accent/20 text-accent border-accent/30">Average</Badge>
    } else {
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Poor</Badge>
    }
  }

  // ✅ Load Reports from Supabase
  useEffect(() => {
    loadReports()
  }, [startDate, endDate])

  async function loadReports() {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return

    // Get teacher id
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!teacher) return

    // Fetch classes for this teacher
    const { data: classes } = await supabase
      .from("classes")
      .select("id, name")
      .eq("teacher_id", teacher.id)

    const classIds = classes?.map((c: any) => c.id) || []

    if (classIds.length === 0) {
      setReport({ students: [], classes: [] })
      return
    }

    // Fetch students in these classes
    const { data: students } = await supabase
      .from("students")
      .select("id, name, class_id")
      .in("class_id", classIds)

    // Fetch attendance with optional date filter
    let attendanceQuery = supabase
      .from("attendance")
      .select("student_id, class_id, status, date")
      .in("class_id", classIds)

    if (startDate) attendanceQuery = attendanceQuery.gte("date", startDate)
    if (endDate) attendanceQuery = attendanceQuery.lte("date", endDate)

    const { data: attendance } = await attendanceQuery

    // Calculate Student-wise Attendance %
    const studentMap: any = {}

    students?.forEach((s: any) => {
      const records = attendance?.filter((a: any) => a.student_id === s.id) || []
      const total = records.length
      const present = records.filter((r: any) => r.status === "present").length

      studentMap[s.id] = {
        id: s.id,
        name: s.name,
        className: classes?.find((c: any) => c.id === s.class_id)?.name || "Unknown Class",
        percent: total === 0 ? 0 : Math.round((present / total) * 100),
      }
    })

    // Calculate Class-wise Average Attendance
    const classMap: any = {}

    classes?.forEach((cls: any) => {
      const clsStudents = students?.filter((s: any) => s.class_id === cls.id) || []
      const percents = clsStudents.map((s: any) => studentMap[s.id]?.percent || 0)

      const avg =
        percents.length === 0
          ? 0
          : Math.round(percents.reduce((a: number, b: number) => a + b, 0) / percents.length)

      classMap[cls.id] = {
        id: cls.id,
        name: cls.name,
        avgPercent: avg,
      }
    })

    setReport({
      students: Object.values(studentMap),
      classes: Object.values(classMap),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance Reports</h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive attendance analytics and reports
          </p>
        </div>
        <Button className="gradient-primary text-white hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="card-glass p-5 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject, class, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/50 border-white/5"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[150px] bg-secondary/50 border-white/5"
                placeholder="Start Date"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[150px] bg-secondary/50 border-white/5"
                placeholder="End Date"
              />
            </div>

            <Select>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-white/5">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10">
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="ix">Class IX</SelectItem>
                <SelectItem value="x">Class X</SelectItem>
                <SelectItem value="xi">Class XI</SelectItem>
                <SelectItem value="xii">Class XII</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="subject" className="space-y-6">
        <TabsList className="glass border-white/5 p-1">
          <TabsTrigger
            value="subject"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Subject-wise Report
          </TabsTrigger>
          <TabsTrigger
            value="teacher"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Teacher-wise Report
          </TabsTrigger>
        </TabsList>

        {/* Subject-wise Report */}
        <TabsContent value="subject" className="space-y-4">
          <div className="card-glass rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">
                    <Button variant="ghost" size="sm" className="hover:bg-transparent p-0 h-auto font-medium">
                      Subject
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Class</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Teacher</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Total Classes</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Students</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Avg. Attendance</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No subject-wise report data available 🚀
                    </TableCell>
                  </TableRow>
                ) : (
                  report.classes.map((row: any) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="font-medium">Mathematics</TableCell> {/* Static for now as per original UI */}
                      <TableCell>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {row.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">You (Current Teacher)</TableCell>
                      <TableCell className="text-center font-mono">—</TableCell>
                      <TableCell className="text-center font-mono">—</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={row.avgPercent} className="h-2 w-20 bg-white/5" />
                          <span className={cn(
                            "text-sm font-medium",
                            row.avgPercent >= 90 ? "text-success" :
                            row.avgPercent >= 80 ? "text-warning" : "text-destructive"
                          )}>
                            {row.avgPercent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getAttendanceBadge(row.avgPercent)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Teacher-wise Report */}
        <TabsContent value="teacher" className="space-y-4">
          <div className="card-glass rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">
                    <Button variant="ghost" size="sm" className="hover:bg-transparent p-0 h-auto font-medium">
                      Teacher Name
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Subject</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Classes</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Total Students</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Total Classes Held</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Avg. Attendance</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No teacher-wise report data available
                    </TableCell>
                  </TableRow>
                ) : (
                  report.classes.map((row: any) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="font-medium">You (Current Teacher)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-accent/30 text-accent">
                          Mathematics
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono">{row.name}</TableCell>
                      <TableCell className="text-center font-mono">—</TableCell>
                      <TableCell className="text-center font-mono">—</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={row.avgPercent} className="h-2 w-20 bg-white/5" />
                          <span className={cn(
                            "text-sm font-medium",
                            row.avgPercent >= 90 ? "text-success" :
                            row.avgPercent >= 80 ? "text-warning" : "text-destructive"
                          )}>
                            {row.avgPercent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getAttendanceBadge(row.avgPercent)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Class-wise Attendance Bar Chart - Added below existing UI */}
      <div className="card-glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">
          Class Attendance Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.classes}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgPercent" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}