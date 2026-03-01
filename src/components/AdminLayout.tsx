import { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Settings, Grid3X3, BookOpen, Users, GraduationCap,
  Link2, Bell, BarChart3, SlidersHorizontal, GraduationCap as Logo,
  Menu, X, LogOut, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "School Setup", icon: Settings, path: "/admin/setup" },
  { title: "Classes & Sections", icon: Grid3X3, path: "/admin/classes" },
  { title: "Subjects", icon: BookOpen, path: "/admin/subjects" },
  { title: "Teachers", icon: Users, path: "/admin/teachers" },
  { title: "Students", icon: GraduationCap, path: "/admin/students" },
  { title: "Assignments", icon: Link2, path: "/admin/assignments" },
  { title: "Notifications", icon: Bell, path: "/admin/notifications" },
  { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { title: "Settings", icon: SlidersHorizontal, path: "/admin/settings" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const adminUser = {
    name: "Administrator",
    email: "admin@school.edu",
    role: "SUPER ADMIN" as const,
    avatar: "AD",
    school: "Delhi Public School",
    academicYear: "2024 - 2025",
    lastLogin: "Today, 9:41 AM",
    status: "Active" as const,
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`sidebar-gradient fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 -translate-x-full lg:w-16 lg:translate-x-0"
          }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Logo className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold text-sidebar-foreground"
            >
              SchoolConnect
            </motion.span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>{item.title}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Delhi Public School</h2>
              <p className="text-xs text-muted-foreground">Academic Year 2024-2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <ProfileDropdown user={adminUser} />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
