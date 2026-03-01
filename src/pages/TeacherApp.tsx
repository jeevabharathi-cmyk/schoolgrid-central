import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, Clock, User, Plus, BookOpen, ChevronRight, Bell, FileText,
  Paperclip, Send, Eye, EyeOff, MessageCircle
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
<<<<<<< HEAD
import { getAllStatuses, subscribe } from "@/homeworkStore";
import { initializeSession, getSession } from "@/authStore";
import { CheckCircle } from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import {
  getAllDoubts,
  getDoubtsForHomework,
  getPendingCount,
  replyToDoubt,
  subscribe as subscribeDoubts,
} from "@/doubtStore";

const TEACHER_ID = "TCH-2024-001";
=======
import HelpCenter from "@/components/HelpCenter";
>>>>>>> d18e1e5b7c2cfe3877d8d96b693b0c8fada41d75

const assignedClasses = [
  { id: 1, name: "Class 8A", subject: "Mathematics", schedule: "Mon, Wed, Fri - 9:00 AM" },
  { id: 2, name: "Class 9B", subject: "Mathematics", schedule: "Tue, Thu - 10:00 AM" },
  { id: 3, name: "Class 10A", subject: "Mathematics", schedule: "Mon, Wed - 11:00 AM" },
];

// Each post now carries its registered Homework ID
const recentPosts = [
  { title: "Chapter 5 Exercises", class: "8A", time: "2 hours ago", type: "homework", homeworkId: "HW-8A-001" },
  { title: "Unit Test Announcement", class: "9B", time: "Yesterday", type: "announcement", homeworkId: "HW-9B-001" },
  { title: "Assignment: Trigonometry", class: "10A", time: "2 days ago", type: "homework", homeworkId: "HW-10A-001" },
];

// Students matched to the homeworkStore child IDs
const studentRoster = [
  { childId: 1, name: "Aarav", appNo: "APP-2024-001", class: "8A" },
  { childId: 2, name: "Ishita", appNo: "APP-2024-002", class: "5B" },
];

const TeacherApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "history" | "profile">("home");

  // Mirror of the homeworkStore — triggers re-render whenever a student views/acks homework
  const [viewStatuses, setViewStatuses] = useState(getAllStatuses);
  useEffect(() => {
    const unsubscribe = subscribe(() => setViewStatuses(getAllStatuses()));
    return unsubscribe;
  }, []);

  const [allDoubts, setAllDoubts] = useState(getAllDoubts);
  useEffect(() => {
    const unsub = subscribeDoubts(() => setAllDoubts(getAllDoubts()));
    return unsub;
  }, []);

  // Initialize teacher session on component mount
  useEffect(() => {
    initializeSession("teacher");
  }, []);

  const session = getSession("teacher");

  const teacherProfile = {
    name: "Anita Sharma",
    email: "anita@school.edu",
    role: "TEACHER" as const,
    avatar: "AS",
    school: "Delhi Public School",
    academicYear: "2024 - 2025",
    lastLogin: session.lastLogin ?? "Today, 11:46 AM",
    status: session.status,
  };

  // Doubt reply dialog state
  const [doubtDialog, setDoubtDialog] = useState<string | null>(null); // homeworkId
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({}); // doubtId → draft reply

  const handleReply = (doubtId: string) => {
    const text = replyTexts[doubtId]?.trim();
    if (!text) return;
    replyToDoubt(doubtId, TEACHER_ID, text);
    setReplyTexts((prev) => ({ ...prev, [doubtId]: "" }));
  };

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

        {/* Header with Profile Dropdown & Notifications */}
        <div className="flex h-12 items-center justify-between border-b border-border/10 bg-card px-4">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-sm font-black text-primary tracking-tighter">SC</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-muted-foreground transition-all hover:bg-secondary/50 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-card bg-destructive" />
            </button>
            <ProfileDropdown user={teacherProfile} />
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-156px)] overflow-y-auto">
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
                <p className="text-sm font-semibold text-foreground">Recent Posts & Status</p>
                {recentPosts.map((post, i) => {
                  const pendingDoubts = allDoubts.filter(
                    (d) => d.homeworkId === post.homeworkId && d.status === "Pending"
                  ).length;

                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                      <div className={`rounded-lg p-2 ${post.type === "homework" ? "bg-accent" : "bg-secondary"}`}>
                        {post.type === "homework"
                          ? <FileText className="h-4 w-4 text-accent-foreground" />
                          : <Bell className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Post title + pending doubt badge */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                          {pendingDoubts > 0 && (
                            <Badge variant="destructive" className="shrink-0 text-xs h-4 px-1.5">
                              {pendingDoubts} doubt{pendingDoubts > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-muted-foreground">Class {post.class} · {post.time}</p>
                          {/* View Doubts button — opens dialog */}
                          <button
                            onClick={() => setDoubtDialog(post.homeworkId)}
                            className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2 shrink-0"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Doubts ({allDoubts.filter((d) => d.homeworkId === post.homeworkId).length})
                          </button>
                        </div>

                        {/* Student view + acknowledge status */}
                        <div className="mt-2 space-y-1.5">
                          {studentRoster
                            .filter((s) => s.class === post.class)
                            .map((student) => {
                              const status = viewStatuses[student.childId];
                              const viewed = status?.viewed;
                              const subjectAcks = status?.subjectAcks ?? [];
                              return (
                                <div key={student.childId} className="rounded-md border border-border/40 bg-secondary/30 px-2.5 py-1.5 space-y-1">
                                  {/* Student header — name + app number, shown once */}
                                  <p className="text-xs font-semibold text-foreground">
                                    {student.name}
                                    <span className="ml-1.5 font-normal text-muted-foreground">
                                      {student.appNo}
                                    </span>
                                  </p>
                                  {/* Viewed row */}
                                  <div className="flex items-center gap-1.5">
                                    {viewed ? (
                                      <Eye className="h-3 w-3 text-green-500 shrink-0" />
                                    ) : (
                                      <EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
                                    )}
                                    <span className={`text-xs ${viewed ? "text-green-500" : "text-muted-foreground"}`}>
                                      {viewed && status.viewedAt
                                        ? `Viewed at ${status.viewedAt}`
                                        : "Not Viewed"}
                                    </span>
                                  </div>
                                  {/* Acknowledged rows — one per subject */}
                                  {subjectAcks.length > 0 ? (
                                    <div className="space-y-0.5 pl-1">
                                      {subjectAcks.map((ack) => (
                                        <div key={ack.subject} className="flex items-center gap-1.5">
                                          <CheckCircle className="h-3 w-3 text-blue-500 shrink-0" />
                                          <span className="text-xs text-blue-500">
                                            {ack.subject} — Acknowledged at {ack.acknowledgedAt}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                                      <span className="text-xs text-muted-foreground/60">Not Acknowledged</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          {studentRoster.filter((s) => s.class === post.class).length === 0 && (
                            <span className="text-xs text-muted-foreground">No students linked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                </div>
              </div>

              {/* Session Information Cards */}
              <div className="space-y-2 px-1 text-left">
                <Card className="border-border/50">
                  <CardContent className="p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-muted-foreground">School</p>
                        <p className="font-medium text-foreground">Delhi Public School</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Academic Year</p>
                        <p className="font-medium text-foreground">2024 – 2025</p>
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-border/30 pt-2">
                      <div>
                        <p className="text-muted-foreground">Last Login</p>
                        <p className="font-medium text-foreground">
                          {session.lastLogin ?? "Today, 11:46"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-right">Status</p>
                        <p className="flex items-center gap-1 font-medium text-success justify-end">
                          <span className="h-2 w-2 rounded-full bg-success ring-4 ring-success/20 animate-pulse"></span>
                          Active
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">+91 98765 43210</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">anita@school.edu</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Classes</span><span className="text-foreground">8A, 9B, 10A</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Teacher ID</span><span className="text-foreground">{TEACHER_ID}</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>Logout</Button>
            </motion.div>
          )}
        </div>

        {/* FAB — Post Homework */}
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
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <HelpCenter isMobileMockup className="!bottom-36" />
      </div>

      {/* Doubts View & Reply Dialog — portal-rendered, outside phone frame */}
      <Dialog open={!!doubtDialog} onOpenChange={(open) => { if (!open) setDoubtDialog(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Student Doubts
              {doubtDialog && (
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  · {doubtDialog}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto py-1">
            {doubtDialog && (() => {
              const postDoubts = allDoubts.filter((d) => d.homeworkId === doubtDialog);
              if (postDoubts.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No doubts submitted yet.
                  </p>
                );
              }
              return postDoubts.map((d) => (
                <div key={d.id} className="rounded-md border border-border/50 p-3 space-y-2">
                  {/* Doubt header */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {d.studentName}
                        <span className="ml-1.5 font-normal text-muted-foreground">{d.studentId}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{d.id} · {d.timestamp}</p>
                    </div>
                    <Badge
                      variant={d.status === "Answered" ? "default" : "secondary"}
                      className="text-xs h-5 px-2 shrink-0"
                    >
                      {d.status}
                    </Badge>
                  </div>
                  {/* Question */}
                  <p className="text-sm text-foreground border-l-2 border-primary pl-2">{d.question}</p>
                  {/* Teacher reply (if answered) */}
                  {d.teacherReply && (
                    <div className="rounded bg-green-500/10 px-2 py-1.5">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">
                        Reply: {d.teacherReply}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.teacherId} · {d.replyTimestamp}
                      </p>
                    </div>
                  )}
                  {/* Reply input — only for unanswered doubts */}
                  {d.status === "Pending" && (
                    <div className="flex gap-2 pt-1">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyTexts[d.id] ?? ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({ ...prev, [d.id]: e.target.value }))
                        }
                        rows={2}
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        className="shrink-0 self-end gap-1"
                        disabled={!replyTexts[d.id]?.trim()}
                        onClick={() => handleReply(d.id)}
                      >
                        <Send className="h-3 w-3" /> Reply
                      </Button>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherApp;
