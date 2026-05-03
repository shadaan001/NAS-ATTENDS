"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { logoutUser } from "@/lib/logout"
import { Bell, Search, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  onMenuClick?: () => void   // ← Added for mobile menu
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16",
        "glass border-b border-white/5",
        "flex items-center justify-between px-4 lg:px-6 gap-4"
      )}
    >
      {/* Left Section - Title + Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, classes, reports..."
            className={cn(
              "w-full pl-10 h-10",
              "bg-secondary/50 border-white/5",
              "placeholder:text-muted-foreground/60",
              "focus:bg-secondary focus:border-primary/30",
              "transition-all duration-200"
            )}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl hover:bg-white/5"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 glass border-white/10"
          >
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-[10px]">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <span className="text-sm font-medium">Attendance Updated</span>
              <span className="text-xs text-muted-foreground">Class XII-A attendance marked for today</span>
              <span className="text-[10px] text-primary">2 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <span className="text-sm font-medium">New Student Added</span>
              <span className="text-xs text-muted-foreground">Rahul Kumar joined Class X-B</span>
              <span className="text-[10px] text-primary">15 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <span className="text-sm font-medium">Report Generated</span>
              <span className="text-xs text-muted-foreground">Monthly attendance report is ready</span>
              <span className="text-[10px] text-primary">1 hour ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl hover:bg-white/5"
        >
          <Moon className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 px-2 rounded-xl hover:bg-white/5"
            >
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.email || "Loading..."}
                </span>
                <span className="text-[10px] text-muted-foreground">Teacher</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass border-white/10"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={logoutUser}
              className="text-destructive cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}