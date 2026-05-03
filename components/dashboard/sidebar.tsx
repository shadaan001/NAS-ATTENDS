"use client"
import { logoutUser } from "@/lib/logout"
import { useState } from "react"
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
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
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
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ activeItem, onNavigate, isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleNavigate = (label: string) => {
    onNavigate(label)
    onClose() // close on mobile after navigation
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col glass border-r border-white/5 transition-all duration-300 ease-in-out",
          // Mobile
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[260px]"
        )}
      >
        {/* Logo + Close Button (Mobile) */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl gradient-primary neon-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className={cn("flex flex-col", collapsed && "lg:hidden")}>
              <span className="font-semibold text-sm text-foreground tracking-tight">NAS Revolution</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Centre</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Toggle for Desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex absolute -right-3 top-20 z-50 h-6 w-6 rounded-full bg-secondary border border-border hover:bg-primary hover:text-primary-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            return (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive ? "bg-primary/15 text-primary neon-glow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />}
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                <span className={cn("truncate", collapsed && "lg:hidden")}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Logout") {
                  logoutUser()
                } else {
                  handleNavigate(item.label)
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                item.label === "Logout" ? "text-destructive/80 hover:text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </TooltipProvider>
  )
}