import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import TeachersPage from "./pages/admin/Teachers";
import StudentsPage from "./pages/admin/Students";
import ClassesPage from "./pages/admin/Classes";
import SubjectsPage from "./pages/admin/Subjects";
import SchoolSetup from "./pages/admin/SchoolSetup";
import NotificationsPage from "./pages/admin/Notifications";
import { AssignmentsPage, AnalyticsPage, SettingsPage } from "./pages/admin/Placeholder";
import ViewProfile from "./pages/admin/ViewProfile";
import AccountSettings from "./pages/admin/AccountSettings";
import TimetablePage from "./pages/admin/Timetable";
import { StudentProvider } from "./context/StudentContext";
import { TeacherProvider } from "./context/TeacherContext";
import TeacherApp from "./pages/TeacherApp";
import ParentApp from "./pages/ParentApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StudentProvider>
        <TeacherProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="setup" element={<SchoolSetup />} />
                <Route path="classes" element={<ClassesPage />} />
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="teachers" element={<TeachersPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="assignments" element={<AssignmentsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ViewProfile />} />
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="timetable" element={<TimetablePage />} />
              </Route>
              <Route path="/teacher" element={<TeacherApp />} />
              <Route path="/parent" element={<ParentApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TeacherProvider>
      </StudentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

