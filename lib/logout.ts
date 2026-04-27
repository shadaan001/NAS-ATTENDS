import { supabase } from "@/lib/supabase"

export async function logoutUser() {
  await supabase.auth.signOut()
  window.location.href = "/login"
}