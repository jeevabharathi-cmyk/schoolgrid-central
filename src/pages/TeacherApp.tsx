import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, Clock, User, Plus, BookOpen, ChevronRight, Bell, FileText, Paperclip, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";

const assignedClasses = [
  { id: 1, name: "Class 8A", subject: "Mathematics", schedule: "Mon, Wed, Fri - 9:00 AM" },
  { id: 2, name: "Class 9B", subject: "Mathematics", schedule: "Tue, Thu - 10:00 AM" },
  { id: 3, name: "Class 10A", subject: "Mathematics", schedule: "Mon, Wed - 11:00 AM" },
];

const recentPosts = [
  { title: "Chapter 5 Exercises", class: "8A", time: "2 hours ago", type: "homework" },
  { title: "Unit Test Announcement", class: "9B", time: "Yesterday", type: "announcement" },
  { title: "Assignment: Trigonometry", class: "10A", time: "2 days ago", type: "homework" },
];

const TeacherApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "history" | "profile">("home");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl" style={{ height: 740 }}>
        {/* Status Bar Mock */}
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-primary-foreground">
          <span className="text-xs font-medium">9:41</span>
          <span className="text-xs font-medium">SchoolConnect</span>
          <div className="flex gap-1">
            <span className="text-xs">📶</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-108px)] overflow-y-auto">
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-foreground">Good morning, Mrs. Sharma 👋</p>
                  <p className="text-xs text-muted-foreground">Mathematics Teacher</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Your Classes</p>
                {assignedClasses.map((cls) => (
                  <Card key={cls.id} className="border-border/50">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                          <BookOpen className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{cls.name} — {cls.subject}</p>
                          <p className="text-xs text-muted-foreground">{cls.schedule}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Recent Posts</p>
                {recentPosts.map((post, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                    <div className={`rounded-lg p-2 ${post.type === "homework" ? "bg-accent" : "bg-secondary"}`}>
                      {post.type === "homework" ? <FileText className="h-4 w-4 text-accent-foreground" /> : <Bell className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground">Class {post.class} · {post.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
              <p className="text-base font-semibold text-foreground">Post History</p>
              {[...recentPosts, ...recentPosts].map((post, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">Class {post.class} · {post.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
              <div className="flex flex-col items-center gap-3 pt-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">AS</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">Mrs. Anita Sharma</p>
                  <p className="text-sm text-muted-foreground">Mathematics Teacher</p>
                  <Badge className="mt-2">Active</Badge>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">+91 98765 43210</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">anita@school.edu</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Classes</span><span className="text-foreground">8A, 9B, 10A</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>Logout</Button>
            </motion.div>
          )}
        </div>

        {/* FAB */}
        {activeTab === "home" && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Plus className="h-6 w-6" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Post Homework</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1"><Label className="text-sm">Class</Label><Input value="8A — Mathematics" readOnly /></div>
                <div className="space-y-1"><Label className="text-sm">Title</Label><Input placeholder="e.g. Chapter 5 Exercises" /></div>
                <div className="space-y-1"><Label className="text-sm">Description</Label><Textarea placeholder="Enter homework details..." rows={3} /></div>
                <div className="space-y-1"><Label className="text-sm">Due Date</Label><Input type="date" /></div>
                <Button variant="outline" className="w-full gap-2"><Paperclip className="h-4 w-4" /> Attach Files</Button>
              </div>
              <DialogFooter><Button className="w-full gap-2"><Send className="h-4 w-4" /> Post Homework</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-border bg-card py-2">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "history" as const, icon: Clock, label: "History" },
            { id: "profile" as const, icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherApp;
