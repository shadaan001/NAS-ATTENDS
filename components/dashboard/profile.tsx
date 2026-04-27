"use client"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Award,
  Edit,
  Camera,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    setUser(user)

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profileData)
    }
  }

  // 🔥 UPLOAD IMAGE FUNCTION
  async function uploadAvatar(file: File) {
    if (!user) return

    const filePath = `${user.id}.png`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true })

    if (error) {
      console.error(error)
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)

    setProfile((prev: any) => ({
      ...prev,
      avatar_url: publicUrl,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card-glass p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-primary -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row gap-6">
          
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage
                src={
                  profile?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
              />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* 🔥 IMAGE UPLOAD BUTTON */}
            <label className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-4 w-4 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadAvatar(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {profile?.name || user?.email?.split("@")[0] || "Loading..."}
                </h2>

                <p className="text-muted-foreground mt-1">
                  {profile?.role || "Teacher"}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {profile?.department || "No Department"}
                  </Badge>
                </div>
              </div>

              <Button className="gradient-primary text-white hover:opacity-90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* SIGN OUT */}
            <Button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/login"
              }}
              className="bg-red-500 text-white mt-2"
            >
              Sign Out
            </Button>

            {/* CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">
                    {profile?.phone || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">
                    {profile?.location || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">
                    {profile?.join_date || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass p-5 rounded-2xl text-center">
          <Users className="h-6 w-6 text-primary mx-auto" />
          <p className="text-3xl font-bold mt-3">0</p>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </div>

        <div className="card-glass p-5 rounded-2xl text-center">
          <BookOpen className="h-6 w-6 text-accent mx-auto" />
          <p className="text-3xl font-bold mt-3">0</p>
          <p className="text-sm text-muted-foreground">Active Classes</p>
        </div>

        <div className="card-glass p-5 rounded-2xl text-center">
          <Award className="h-6 w-6 text-success mx-auto" />
          <p className="text-3xl font-bold mt-3">0%</p>
          <p className="text-sm text-muted-foreground">Avg. Attendance</p>
        </div>

        <div className="card-glass p-5 rounded-2xl text-center">
          <Calendar className="h-6 w-6 text-warning mx-auto" />
          <p className="text-3xl font-bold mt-3">0</p>
          <p className="text-sm text-muted-foreground">Years Experience</p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass border-white/5 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="card-glass p-5 rounded-2xl text-center text-muted-foreground">
            Profile data loaded from database 🚀
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <div className="card-glass p-5 rounded-2xl text-center text-muted-foreground">
            No classes assigned yet
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="card-glass p-5 rounded-2xl text-center text-muted-foreground">
            No achievements yet
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}