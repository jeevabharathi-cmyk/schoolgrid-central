import { motion } from "framer-motion";
import {
  Users, GraduationCap, FileText, TrendingUp, Plus, Bell, BookOpen,
  ArrowUpRight, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Total Teachers", value: "48", change: "+3 this month", icon: Users, color: "text-primary" },
  { title: "Total Students", value: "1,247", change: "+24 this month", icon: GraduationCap, color: "text-success" },
  { title: "Posts Today", value: "32", change: "12 homework, 20 notices", icon: FileText, color: "text-warning" },
  { title: "Parent Engagement", value: "87%", change: "+5% vs last week", icon: TrendingUp, color: "text-info" },
];

const recentActivity = [
  { text: "Mrs. Sharma posted Maths homework for Class 8A", time: "10 min ago", type: "homework" },
  { text: "New announcement: Annual Day preparations", time: "25 min ago", type: "announcement" },
  { text: "Mr. Patel posted Science assignment for Class 10B", time: "1 hour ago", type: "homework" },
  { text: "Parent meeting schedule updated for Class 5", time: "2 hours ago", type: "announcement" },
  { text: "Mrs. Kumar posted English essay for Class 7C", time: "3 hours ago", type: "homework" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item}>
        <div className="rounded-xl bg-primary p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold">Welcome back, Admin 👋</h1>
          <p className="mt-1 text-sm opacity-80">
            Delhi Public School · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card-gradient border-border/50 transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`rounded-lg bg-secondary p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary">
                    <div className={`mt-0.5 rounded-lg p-2 ${activity.type === "homework" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                      {activity.type === "homework" ? <BookOpen className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4 text-primary" /> Add Teacher
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4 text-success" /> Add Student
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Bell className="h-4 w-4 text-warning" /> Post Announcement
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <FileText className="h-4 w-4 text-info" /> Generate Report
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
