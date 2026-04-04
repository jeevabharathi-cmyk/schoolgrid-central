import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { markViewed, markAcknowledged } from "@/homeworkStore";
import { initializeSession, getSession } from "@/authStore";
import { submitDoubt, getDoubtsForHomework, getHomeworkId, getAllDoubts, subscribe as subscribeDoubts } from "@/doubtStore";
import {
  Home, Bell, Clock, User, BookOpen, CheckCircle, ChevronRight, Calendar, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import HelpCenter from "@/components/HelpCenter";

const children = [
  { id: 1, name: "Aarav", appNo: "APP-2024-001", class: "8A" },
  { id: 2, name: "Ishita", appNo: "APP-2024-002", class: "5B" },
];

const homeworkByChild: Record<number, { subject: string; title: string; due: string; acknowledged: boolean }[]> = {
  1: [
    { subject: "Mathematics", title: "Page 45, Ex 1-5", due: "Tomorrow", acknowledged: false },
    { subject: "Science", title: "Read Chapter 3", due: "Today", acknowledged: true },
    { subject: "English", title: "Essay on Environment", due: "Mar 5", acknowledged: false },
  ],
  2: [
    { subject: "Hindi", title: "Learn poem", due: "Today", acknowledged: true },
    { subject: "EVS", title: "Draw water cycle", due: "Tomorrow", acknowledged: false },
  ],
};

const announcements = [
  { title: "Annual Day Preparations", date: "Feb 20", snippet: "Rehearsals begin next week for all participating students..." },
  { title: "Parent-Teacher Meeting", date: "Feb 25", snippet: "PTM scheduled for classes 5-10 on Saturday..." },
  { title: "Sports Day Registration", date: "Feb 18", snippet: "Register your child for upcoming sports events..." },
];

const ParentApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "announcements" | "history" | "profile">("home");
  const [selectedChild, setSelectedChild] = useState(1);
  const homework = homeworkByChild[selectedChild] || [];

  // Acknowledged subjects — keyed as "childId:subject"
  const [ackedKeys, setAckedKeys] = useState<Set<string>>(new Set());

  // Doubt dialog state
  const [doubtDialog, setDoubtDialog] = useState<{ homeworkId: string; subject: string } | null>(null);
  const [doubtText, setDoubtText] = useState("");

  // Reactive snapshot of all doubts (so teacher replies appear live)
  const [allDoubts, setAllDoubts] = useState(getAllDoubts);
  useEffect(() => {
    const unsub = subscribeDoubts(() => setAllDoubts(getAllDoubts()));
    return unsub;
  }, []);

  const childInfo = children.find((c) => c.id === selectedChild)!;

  const handleAcknowledge = (childId: number, subject: string) => {
    const key = `${childId}:${subject}`;
    if (ackedKeys.has(key)) return;
    markAcknowledged(childId, subject);
    setAckedKeys((prev) => new Set([...prev, key]));
  };

  const isAcked = (childId: number, subject: string) =>
    ackedKeys.has(`${childId}:${subject}`);

  const handleSubmitDoubt = () => {
    if (!doubtDialog || !doubtText.trim()) return;
    submitDoubt({
      homeworkId: doubtDialog.homeworkId,
      studentId: childInfo.appNo,
      studentName: childInfo.name,
      question: doubtText.trim(),
    });
    setDoubtText("");
    setDoubtDialog(null);
  };

  // Initialize parent session on component mount
  useEffect(() => {
    initializeSession("parent");
  }, []);

  const session = getSession("parent");

  const parentProfile = {
    name: "Sunil Mehta",
    email: "sunil.mehta@gmail.com",
    role: "PARENT" as const,
    avatar: "SM",
    school: "Delhi Public School",
    academicYear: "2024 - 2025",
    lastLogin: session.lastLogin ?? "Today, 11:46 AM",
    status: session.status,
  };

  // Automatic View Logging — fires silently as soon as homework cards are rendered.
  useEffect(() => {
    if (activeTab === "home") {
      markViewed(selectedChild);
    }
  }, [activeTab, selectedChild]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl" style={{ height: 740 }}>
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-primary-foreground">
          <span className="text-xs font-medium">9:41</span>
          <span className="text-xs font-medium">SchoolConnect</span>
          <div className="flex gap-1"><span className="text-xs">📶</span><span className="text-xs">🔋</span></div>
        </div>

        {/* Header with Profile Dropdown & Notifications */}
        <div className="flex h-12 items-center justify-between border-b border-border/10 bg-card px-4">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-sm font-black text-primary tracking-tighter">SC</span>
          </div>
          <div className="flex items-center gap-3">
            <ProfileDropdown user={parentProfile} />
          </div>
        </div>

        <div className="h-[calc(100%-156px)] overflow-y-auto">
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
              <div>
                <p className="text-base font-semibold text-foreground">Good morning, Mr. Mehta 👋</p>
                <p className="text-xs text-muted-foreground">Delhi Public School</p>
              </div>

              {/* Child tabs */}
              <div className="flex gap-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedChild === child.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                      }`}
                  >
                    {child.name} · {child.class}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Today's Homework</p>
                {homework.map((hw, i) => {
                  const hwId = getHomeworkId(childInfo.class, hw.subject);
                  const myDoubts = hwId
                    ? allDoubts.filter((d) => d.homeworkId === hwId && d.studentId === childInfo.appNo)
                    : [];
                  const answeredDoubt = myDoubts.find((d) => d.status === "Answered");

                  return (
                    <Card key={i} className="border-border/50">
                      <CardContent className="p-3">
                        {/* Existing homework row — unchanged */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                              <BookOpen className="h-4 w-4 text-accent-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{hw.subject}</p>
                              <p className="text-xs text-muted-foreground">{hw.title}</p>
                              <div className="mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Due: {hw.due}</span>
                              </div>
                            </div>
                          </div>
                          {hw.acknowledged || isAcked(selectedChild, hw.subject) ? (
                            <Badge variant="secondary" className="gap-1 text-xs text-success">
                              <CheckCircle className="h-3 w-3" /> Done
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleAcknowledge(selectedChild, hw.subject)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </div>

                        {/* Doubt section — appended below, inside same card */}
                        {hwId && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => setDoubtDialog({ homeworkId: hwId, subject: hw.subject })}
                                className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2"
                              >
                                <MessageCircle className="h-3 w-3" />
                                {myDoubts.length > 0 ? "View / Ask Doubt" : "Ask a Doubt"}
                              </button>
                              {answeredDoubt && (
                                <span className="text-xs text-green-500 font-medium">✓ Teacher replied</span>
                              )}
                            </div>
                            {/* Show teacher reply inline */}
                            {answeredDoubt && (
                              <div className="mt-1.5 rounded bg-green-500/10 px-2 py-1.5">
                                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                  Teacher: {answeredDoubt.teacherReply}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {answeredDoubt.replyTimestamp} · {answeredDoubt.teacherId}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="border-border/50 bg-accent/30">
                <CardContent className="flex items-center gap-3 p-3">
                  <Bell className="h-5 w-5 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">2 unread announcements</p>
                    <p className="text-xs text-muted-foreground">Tap to view</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "announcements" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
              <p className="text-base font-semibold text-foreground">Announcements</p>
              {announcements.map((ann, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground">{ann.title}</p>
                      <span className="text-xs text-muted-foreground">{ann.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{ann.snippet}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
              <p className="text-base font-semibold text-foreground">Homework History</p>
              {[...homework, ...homework].map((hw, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  <div className="rounded-lg bg-secondary p-2"><BookOpen className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{hw.subject}: {hw.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {hw.due}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
              <div className="flex flex-col items-center gap-3 pt-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">SM</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">Mr. Sunil Mehta</p>
                  <p className="text-sm text-muted-foreground">Parent</p>
                </div>
              </div>

              {/* Session Information Cards */}
              <div className="space-y-2 px-1">
                <Card className="border-border/50">
                  <CardContent className="p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-muted-foreground">School</p>
                        <p className="font-medium text-foreground">Delhi Public School</p>
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
                          <span className="h-2 w-2 rounded-full bg-success ring-4 ring-success/20"></span>
                          Active
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Linked Children</p>
                {children.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-accent text-xs text-accent-foreground">{child.name[0]}</AvatarFallback></Avatar>
                    <div><p className="text-sm font-medium text-foreground">{child.name}</p><p className="text-xs text-muted-foreground">Class {child.class}</p></div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-sm">+ Add Another Child</Button>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>Logout</Button>
            </motion.div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-border bg-card py-2">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "announcements" as const, icon: Bell, label: "News" },
            { id: "history" as const, icon: Clock, label: "History" },
            { id: "profile" as const, icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <HelpCenter isMobileMockup />
      </div>

      {/* Doubt Submission Dialog — renders via portal, not clipped by phone frame */}
      <Dialog open={!!doubtDialog} onOpenChange={(open) => { if (!open) { setDoubtDialog(null); setDoubtText(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask a Doubt — {doubtDialog?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {/* Student identity info */}
            <div className="rounded-md bg-secondary/50 px-3 py-2 text-xs space-y-0.5">
              <p className="text-muted-foreground">
                Student: <span className="font-medium text-foreground">{childInfo?.name}</span>
              </p>
              <p className="text-muted-foreground">
                ID: <span className="font-medium text-foreground">{childInfo?.appNo}</span>
              </p>
              <p className="text-muted-foreground">
                Homework ID: <span className="font-medium text-foreground">{doubtDialog?.homeworkId}</span>
              </p>
            </div>

            {/* Previous doubts for this homework by this student */}
            {doubtDialog && (() => {
              const prev = allDoubts.filter(
                (d) => d.homeworkId === doubtDialog.homeworkId && d.studentId === childInfo.appNo
              );
              if (prev.length === 0) return null;
              return (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Your doubts</p>
                  {prev.map((d) => (
                    <div key={d.id} className="rounded-md border border-border/50 p-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{d.id} · {d.timestamp}</span>
                        <Badge variant={d.status === "Answered" ? "default" : "secondary"} className="text-xs h-4 px-1.5">
                          {d.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground">Q: {d.question}</p>
                      {d.teacherReply && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          A: {d.teacherReply} <span className="text-muted-foreground">({d.replyTimestamp})</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            <Textarea
              placeholder="Type your doubt here..."
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitDoubt} disabled={!doubtText.trim()} className="gap-2">
              <MessageCircle className="h-4 w-4" /> Submit Doubt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentApp;
