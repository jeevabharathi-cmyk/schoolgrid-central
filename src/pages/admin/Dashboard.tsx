import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, FileText, TrendingUp, Plus, Bell, BookOpen,
  ArrowUpRight, Clock, X, Mail, Phone, MapPin, User, Calendar,
  BookMarked, School, Send, Download, BarChart3, PieChart, CheckCircle2,
  Loader2, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/context/StudentContext";
import { useTeachers } from "@/context/TeacherContext";
import { useAnnouncements } from "@/context/AnnouncementContext";
import { useClasses } from "@/context/ClassContext";

// ─── Stats Helper ────────────────────────────────────────────────────────────
const getStats = (teachers: any[], studentCount: number) => [
  { title: "Total Teachers", value: teachers.length.toString(), change: "Active in database", icon: Users, color: "text-primary" },
  { title: "Total Students", value: studentCount.toLocaleString(), change: "Active in database", icon: GraduationCap, color: "text-success" },
  { title: "Dashboard Stats", value: "Live", change: "Synced with Supabase", icon: FileText, color: "text-warning" },
  { title: "Connectivity", value: "100%", change: "Cloud sync active", icon: TrendingUp, color: "text-info" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, subtitle, icon: Icon, children }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  icon: React.ElementType; children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl"
      >
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{title}</h2>
                {subtitle && <p className="text-xs text-blue-100">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ─── Add Teacher Modal ────────────────────────────────────────────────────────
const AddTeacherModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addTeacher } = useTeachers();

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherClass, setTeacherClass] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    if (!name || !phone || !subject) return;
    setLoading(true);
    const { error } = await addTeacher({
      name,
      phone,
      email,
      subjects: [subject],
      classes: teacherClass ? [teacherClass] : [],
      status: "active",
      address,
      joiningDate
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName(""); setPhone(""); setEmail(""); setSubject(""); setTeacherClass(""); setAddress(""); setJoiningDate("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Teacher" subtitle="Register a new staff member" icon={Users}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Teacher Added Successfully!</h3>
          <p className="text-sm text-muted-foreground">The new teacher <strong>{name}</strong> has been registered.</p>
          <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name *</label>
              <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mrs. Anita Sharma" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone Number *</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
              <div className="relative"><BookMarked className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select subject</option>
                  {["Mathematics", "Science", "English", "Hindi", "Social Science", "Physical Education"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className={`flex-1 text-primary-foreground ${name && phone && subject ? "bg-primary hover:bg-primary/90" : "bg-muted cursor-not-allowed"}`} onClick={handleAdd} disabled={!name || !phone || !subject || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Add Teacher</>}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Add Student Modal ────────────────────────────────────────────────────────
const AddStudentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enrollStudent } = useStudents();
  const { classes } = useClasses();

  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [address, setAddress] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  if (!open) return null;

  const handleEnroll = async () => {
    if (!name || !selectedClassId || !selectedSectionId || !parentName || !parentPhone) return;
    setLoading(true);
    const selectedSection = sections.find(s => s.id === selectedSectionId);
    
    const { error } = await enrollStudent({
      name,
      admNo: admNo || `ADM${Date.now().toString().slice(-6)}`,
      class: selectedClass?.name || "",
      section: selectedSection?.name || "",
      classId: selectedClassId,
      sectionId: selectedSectionId,
      parent: parentName,
      phone: parentPhone,
      address,
      enrollmentDate,
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Student" subtitle="Enroll a new student" icon={GraduationCap}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-7 w-7" /></div>
          <h3 className="text-base font-bold text-foreground">Student Enrolled Successfully!</h3>
          <Button className="mt-2 bg-primary text-primary-foreground" onClick={onClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name *" className="w-full rounded-lg border p-2 text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={selectedClassId} 
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId("");
              }} 
              className="rounded-lg border p-2 text-sm bg-background"
            >
              <option value="">Select Class *</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select 
              value={selectedSectionId} 
              onChange={(e) => setSelectedSectionId(e.target.value)} 
              disabled={!selectedClassId}
              className="rounded-lg border p-2 text-sm bg-background disabled:opacity-50"
            >
              <option value="">Section *</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>Section {s.name}</option>
              ))}
            </select>
          </div>
          <input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent Name *" className="w-full rounded-lg border p-2 text-sm" />
          <input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Parent Phone *" className="w-full rounded-lg border p-2 text-sm" />
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Student Address" className="w-full rounded-lg border p-2 text-sm min-h-[80px] resize-none" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Enrollment Date *</label>
            <input 
              type="date" 
              value={enrollmentDate} 
              onChange={(e) => setEnrollmentDate(e.target.value)} 
              className="w-full rounded-lg border p-2 text-sm" 
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleEnroll} disabled={loading}>
                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enroll Student"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Post Announcement Modal ──────────────────────────────────────────────────
const PostAnnouncementModal = ({ open, onClose, initialData }: { open: boolean; onClose: () => void; initialData?: any }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<"normal" | "emergency">("normal");
  const { postAnnouncement, updateAnnouncement } = useAnnouncements();
  const { classes } = useClasses();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetClassId, setTargetClassId] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setTargetClassId(initialData.class_id || "");
        setPriority(initialData.priority);
      } else {
        setTitle("");
        setContent("");
        setTargetClassId("");
        setPriority("normal");
      }
      setSubmitted(false);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handlePost = async () => {
    if (!title || !content) return;
    setLoading(true);
    
    let result;
    if (initialData) {
      result = await updateAnnouncement(initialData.id, {
        title,
        content,
        priority,
        class_id: targetClassId || null
      } as any);
    } else {
      result = await postAnnouncement({
        title,
        content,
        priority,
        class_id: targetClassId || undefined
      });
    }
    
    setLoading(false);
    if (!result.error) setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false); setTitle(""); setContent(""); setTargetClassId(""); setPriority("normal");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Post Announcement" subtitle="Send a notice to parents & teachers" icon={Bell}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-7 w-7" /></div>
          <h3 className="text-base font-bold text-foreground">Announcement {initialData ? "Updated" : "Posted"}!</h3>
          <p className="text-sm text-muted-foreground">Your notice has been {initialData ? "updated" : "sent"} successfully.</p>
          <Button className="mt-2 bg-primary text-primary-foreground" onClick={onClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Announcement Title *</label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Day preparations" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your announcement message here..." rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Target Class (Optional)</label>
            <select value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Priority</label>
            <div className="flex gap-2">
              {(["normal", "emergency"] as const).map((p) => (
                <button key={p} onClick={() => setPriority(p)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${priority === p ? (p === "emergency" ? "border-destructive bg-destructive/10 text-destructive" : "border-primary bg-primary/10 text-primary") : "border-border bg-secondary/50 text-muted-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground" onClick={handlePost} disabled={!title || !content || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> {initialData ? "Update" : "Post"} Announcement</>}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [addTeacher, setAddTeacher] = useState(false);
  const [addStudent, setAddStudent] = useState(false);
  const [postAnnouncement, setPostAnnouncement] = useState(false);
  const [editingAnn, setEditingAnn] = useState<any>(null);
  const { teachers } = useTeachers();
  const { students } = useStudents();
  const { announcements, loading: announcementsLoading, deleteAnnouncement } = useAnnouncements();

  const currentStats = getStats(teachers, students.length);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the announcement "${title}"?`)) {
      await deleteAnnouncement(id);
    }
  };

  const handleEdit = (ann: any) => {
    setEditingAnn(ann);
    setPostAnnouncement(true);
  };

  const handleClosePostModal = () => {
    setPostAnnouncement(false);
    setEditingAnn(null);
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <div className="rounded-xl bg-primary p-6 text-primary-foreground">
            <h1 className="text-2xl font-bold">Welcome back, Admin 👋</h1>
            <p className="mt-1 text-sm opacity-80">Delhi Public School · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentStats.map((stat) => (
            <Card key={stat.title} className="stat-card-gradient border-border/50 transition-shadow hover:shadow-md">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`rounded-lg bg-secondary p-2.5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcementsLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : announcements.length > 0 ? (
                    announcements.slice(0, 5).map((ann) => (
                      <div key={ann.id} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary">
                        <div className={`mt-0.5 rounded-lg p-2 ${ann.priority === 'emergency' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                          <Bell className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{ann.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {new Date(ann.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {ann.priority === 'emergency' && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Urgent</Badge>}
                          <button 
                            onClick={() => handleEdit(ann)}
                            className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(ann.id, ann.title)}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">No recent announcements found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" variant="outline" onClick={() => setAddTeacher(true)}><Plus className="h-4 w-4 text-primary" /> Add Teacher</Button>
                <Button className="w-full justify-start gap-2" variant="outline" onClick={() => setAddStudent(true)}><Plus className="h-4 w-4 text-success" /> Add Student</Button>
                <Button className="w-full justify-start gap-2" variant="outline" onClick={() => setPostAnnouncement(true)}><Bell className="h-4 w-4 text-warning" /> Post Announcement</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <AddTeacherModal open={addTeacher} onClose={() => setAddTeacher(false)} />
      <AddStudentModal open={addStudent} onClose={() => setAddStudent(false)} />
      <PostAnnouncementModal 
        open={postAnnouncement} 
        onClose={handleClosePostModal} 
        initialData={editingAnn}
      />
    </>
  );
};

export default AdminDashboard;
