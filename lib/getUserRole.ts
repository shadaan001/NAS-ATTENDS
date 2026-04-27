import { supabase } from "./supabase"

export async function getUserRole() {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (!user) return null

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (error) {
    console.log("Role fetch error:", error)
    return null
  }

  return profile?.role || null
}