"use client"
import { logoutUser } from "@/lib/logout"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  Users,
  FileBarChart,
  BookOpenCheck,
  GraduationCap,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard", active: true },
  { label: "Mark Attendance", icon: UserCheck, href: "#attendance" },
  { label: "My Classes", icon: BookOpen, href: "#classes" },
  { label: "Students", icon: Users, href: "#students" },
  { label: "Attendance Report", icon: FileBarChart, href: "#attendance-report" },
  { label: "Subject Wise Report", icon: BookOpenCheck, href: "#subject-report" },
  { label: "Teacher Wise Report", icon: GraduationCap, href: "#teacher-report" },
]

const bottomItems: NavItem[] = [
  { label: "Profile", icon: User, href: "#profile" },
  { label: "Logout", icon: LogOut, href: "#logout" },
]

interface SidebarProps {
  activeItem: string
  onNavigate: (item: string) => void
}

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex flex-col",
          "glass border-r border-white/5",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl gradient-primary neon-glow-sm shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <span className="font-semibold text-sm text-foreground tracking-tight">NAS Revolution</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Centre</span>
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-3 top-20 z-50 h-6 w-6 rounded-full",
            "bg-secondary border border-border",
            "hover:bg-primary hover:text-primary-foreground",
            "transition-all duration-200"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            const NavButton = (
              <button
                key={item.label}
                onClick={() => onNavigate(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  "group relative overflow-hidden",
                  isActive
                    ? "bg-primary/15 text-primary neon-glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  "group-hover:scale-110",
                  isActive && "text-primary"
                )} />
                <span className={cn(
                  "truncate transition-all duration-300",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.label}
                </span>
              </button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                  <TooltipContent side="right" className="glass border-white/10">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavButton
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          {bottomItems.map((item) => {
            const isActive = activeItem === item.label
            const isLogout = item.label === "Logout"
            const NavButton = (
  <button
  key={item.label}
  onClick={() => {
    if (item.label === "Logout") {
      logoutUser()
    } else {
      onNavigate(item.label)
    }
  }}
  className={cn(
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
    "text-sm font-medium transition-all duration-200",
    "group",
    isLogout
      ? "text-destructive/80 hover:text-destructive hover:bg-destructive/10"
      : isActive
      ? "bg-primary/15 text-primary"
      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
  )}
>
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  "group-hover:scale-110"
                )} />
                <span className={cn(
                  "truncate transition-all duration-300",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.label}
                </span>
              </button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                  <TooltipContent side="right" className="glass border-white/10">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavButton
          })}
        </div>
      </aside>
    </TooltipProvider>
  )
}
