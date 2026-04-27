"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Users } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  async function handleLogin() {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Invalid credentials ❌")
      setLoading(false)
      return
    }

    const userRole = data.user?.user_metadata?.role

    if (userRole === "admin") {
      router.push("/admin")
    } else if (userRole === "teacher") {
      router.push("/")
    } else if (userRole === "student") {
      router.push("/student")
    } else {
      alert("No role assigned ❌")
    }

    setLoading(false)
  }

  // 🔥 FIX METADATA FUNCTION (kept exactly as you had)
  async function fixMetadata() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Login first ❌")
      return
    }

    await supabase.auth.updateUser({
      data: {
        role: role,
        student_id: user.id
      }
    })

    alert("Metadata updated ✅")
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(at_70%_60%,rgba(139,92,246,0.15),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-10">
          
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              NAS Attendance
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Manage attendance smarter & faster
            </p>
          </div>

          {/* Role Selector - Segmented Control */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1 mb-8">
            <div className="flex">
              {["student", "teacher", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as "student" | "teacher" | "admin")}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all capitalize ${
                    role === r
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-gray-500 outline-none transition-all focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-14 py-4 text-white placeholder:text-gray-500 outline-none transition-all focus:ring-1 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 font-semibold text-lg shadow-xl shadow-purple-500/30 transition-all active:scale-[0.985] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-500">
                <span className="bg-[#020617] px-4">or</span>
              </div>
            </div>

            {/* Google Login Button (UI Only) */}
            <button className="w-full py-4 border border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium transition hover:bg-white/5">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Fix Metadata Button (kept for your convenience) */}
            <button
              onClick={fixMetadata}
              className="w-full py-3 mt-2 text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 hover:border-yellow-400/50 rounded-2xl transition"
            >
              Fix Role Metadata (Dev Tool)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            NAS Attendance System © {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Secure • Simple • Smart
          </p>
        </div>
      </div>
    </div>
  )
}