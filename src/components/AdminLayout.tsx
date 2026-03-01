import { useState } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Settings, Grid3X3, BookOpen, Users, GraduationCap,
  Link2, Bell, BarChart3, SlidersHorizontal, GraduationCap as Logo,
  Menu, X, LogOut, ChevronDown, CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import HelpCenter from "@/components/HelpCenter";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "School Setup", icon: Settings, path: "/admin/setup" },
  { title: "Classes & Sections", icon: Grid3X3, path: "/admin/classes" },
  { title: "Timetable", icon: CalendarDays, path: "/admin/timetable" },
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
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/");
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
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
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

            {/* Admin Profile Button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">AD</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground sm:inline">Admin</span>
                <ChevronDown
                  className={`hidden h-4 w-4 text-muted-foreground transition-transform duration-200 sm:block ${profileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                    >
                      {/* Profile Header — uses primary blue */}
                      <div className="bg-primary px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white shadow-inner">
                            AD
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">Administrator</p>
                            <p className="truncate text-xs text-blue-100">admin@school.edu</p>
                            <span className="mt-1 inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Super Admin
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="px-5 py-3 border-b border-border">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">School</p>
                            <p className="font-medium text-foreground">Delhi Public School</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Academic Year</p>
                            <p className="font-medium text-foreground">2024 – 2025</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Login</p>
                            <p className="font-medium text-foreground">Today, 9:41 AM</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="flex items-center gap-1 font-medium text-green-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                              Active
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/admin/profile"); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Users className="h-3.5 w-3.5" />
                          </div>
                          View Profile
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/admin/account-settings"); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </div>
                          Account Settings
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                            <LogOut className="h-3.5 w-3.5" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        <HelpCenter />
      </div>
    </div>
  );
};

export default AdminLayout;
