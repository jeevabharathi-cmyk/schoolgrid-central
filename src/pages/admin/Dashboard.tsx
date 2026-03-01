import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, FileText, TrendingUp, Plus, Bell, BookOpen,
  ArrowUpRight, Clock, X, Mail, Phone, MapPin, User, Calendar,
  BookMarked, School, Send, Download, BarChart3, PieChart, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStudents } from "@/context/StudentContext";
import { useTeachers } from "@/context/TeacherContext";

// ─── Data ────────────────────────────────────────────────────────────────────
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
        {/* Modal Header — blue banner */}
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

// ─── Field Component ──────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, placeholder, type = "text", as = "input", options = [] }: {
  label: string; icon: React.ElementType; placeholder?: string;
  type?: string; as?: "input" | "select" | "textarea"; options?: { value: string; label: string }[];
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {as === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      ) : as === "select" ? (
        <select className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      )}
    </div>
  </div>
);

// ─── Add Teacher Modal ────────────────────────────────────────────────────────
const AddTeacherModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
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

  const handleAdd = () => {
    if (!name || !phone || !subject) return;

    addTeacher({
      name,
      phone,
      email,
      subjects: [subject],
      classes: teacherClass ? [teacherClass] : [],
      status: "active",
      address,
      joiningDate
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setTeacherClass("");
    setAddress("");
    setJoiningDate("");
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
          <p className="text-sm text-muted-foreground">The new teacher <strong>{name}</strong> has been registered. They can now login with their phone number.</p>
          <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mrs. Anita Sharma" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.edu" type="email" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
              <div className="relative">
                <BookMarked className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select subject</option>
                  {[
                    { value: "maths", label: "Mathematics" }, { value: "science", label: "Science" },
                    { value: "english", label: "English" }, { value: "hindi", label: "Hindi" },
                    { value: "social", label: "Social Science" }, { value: "pe", label: "Physical Education" },
                  ].map((s) => <option key={s.value} value={s.label}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Assigned Class</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={teacherClass} onChange={(e) => setTeacherClass(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select class</option>
                  {["5", "6", "7", "8", "9", "10"].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter residential address" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date of Joining</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} type="date" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button
              className={`flex-1 text-primary-foreground transition-all ${name && phone && subject ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              onClick={handleAdd}
              disabled={!name || !phone || !subject}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Teacher
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
  const { enrollStudent } = useStudents();

  // Form state
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [dob, setDob] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [address, setAddress] = useState("");

  if (!open) return null;

  const handleEnroll = () => {
    if (!name || !studentClass || !section || !parentName || !parentPhone) return;

    enrollStudent({
      name,
      admNo: admNo || `ADM${Date.now().toString().slice(-6)}`,
      class: studentClass,
      section,
      parent: parentName,
      email: parentEmail,
      phone: parentPhone,
      dob,
      address
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setAdmNo("");
    setDob("");
    setStudentClass("");
    setSection("");
    setParentName("");
    setParentPhone("");
    setParentEmail("");
    setAddress("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Student" subtitle="Enroll a new student" icon={GraduationCap}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Student Enrolled Successfully!</h3>
          <p className="text-sm text-muted-foreground">The student <strong>{name}</strong> has been enrolled. Parents can now view homework from their portal.</p>
          <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Mehta" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Admission No.</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={admNo} onChange={(e) => setAdmNo(e.target.value)} placeholder="e.g. 2024009" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Class *</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select class</option>
                  {["5", "6", "7", "8", "9", "10"].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Section *</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select section</option>
                  {["A", "B", "C", "D"].map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Parent / Guardian Name *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. Mr. Sunil Mehta" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Parent Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Parent Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@email.com" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter home address" className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button
              className={`flex-1 text-primary-foreground transition-all ${name && studentClass && section && parentName && parentPhone ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              onClick={handleEnroll}
              disabled={!name || !studentClass || !section || !parentName || !parentPhone}
            >
              <Plus className="mr-2 h-4 w-4" /> Enroll Student
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Post Announcement Modal ──────────────────────────────────────────────────
const PostAnnouncementModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState<"normal" | "important" | "urgent">("normal");
  if (!open) return null;
  return (
    <Modal open={open} onClose={() => { setSubmitted(false); onClose(); }} title="Post Announcement" subtitle="Send a notice to parents & teachers" icon={Bell}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Announcement Posted!</h3>
          <p className="text-sm text-muted-foreground">Your notice has been sent to all selected recipients successfully.</p>
          <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setSubmitted(false); onClose(); }}>
            Done
          </Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <Field label="Announcement Title *" icon={Bell} placeholder="e.g. Annual Day preparations" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message *</label>
            <textarea
              placeholder="Write your announcement message here..."
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Target Audience" icon={Users} placeholder="Select audience" as="select"
              options={[
                { value: "all", label: "All (Teachers + Parents)" },
                { value: "parents", label: "Parents Only" },
                { value: "teachers", label: "Teachers Only" },
              ]}
            />
            <Field label="Target Class" icon={School} placeholder="All Classes" as="select"
              options={[
                { value: "all", label: "All Classes" },
                ...["5", "6", "7", "8", "9", "10"].map((c) => ({ value: c, label: `Class ${c}` })),
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Priority</label>
            <div className="flex gap-2">
              {(["normal", "important", "urgent"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${priority === p
                    ? p === "urgent" ? "border-destructive bg-destructive/10 text-destructive"
                      : p === "important" ? "border-warning bg-warning/10 text-warning"
                        : "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setSubmitted(true)}>
              <Send className="mr-2 h-4 w-4" /> Post Announcement
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Generate Report Modal ────────────────────────────────────────────────────
const reportTypes = [
  { id: "attendance", label: "Attendance Report", desc: "Daily / monthly attendance summary", icon: Calendar },
  { id: "homework", label: "Homework Report", desc: "Assignments posted per teacher & class", icon: BookOpen },
  { id: "engagement", label: "Parent Engagement", desc: "Parent acknowledgement rates", icon: TrendingUp },
  { id: "teacher", label: "Teacher Performance", desc: "Activity and posting frequency", icon: Users },
  { id: "student", label: "Student Progress", desc: "Class-wise academic overview", icon: GraduationCap },
  { id: "summary", label: "Monthly Summary", desc: "Full school activity digest", icon: BarChart3 },
];

const GenerateReportModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  if (!open) return null;

  const handleGenerate = () => {
    if (!selected) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1800);
  };

  return (
    <Modal open={open} onClose={() => { setSelected(null); setDone(false); setGenerating(false); onClose(); }} title="Generate Report" subtitle="Download school data reports" icon={PieChart}>
      {done ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Report Ready!</h3>
          <p className="text-sm text-muted-foreground">Your report has been generated and is ready to download.</p>
          <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <button onClick={() => { setDone(false); setSelected(null); }} className="text-xs text-muted-foreground hover:text-foreground">Generate another</button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <p className="text-xs text-muted-foreground">Select the type of report you want to generate:</p>
          <div className="grid grid-cols-2 gap-2.5">
            {reportTypes.map((rt) => (
              <button
                key={rt.id}
                onClick={() => setSelected(rt.id)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${selected === rt.id
                  ? "border-primary bg-primary/8 shadow-sm ring-1 ring-primary/30"
                  : "border-border bg-secondary/30 hover:bg-secondary hover:border-border/80"
                  }`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${selected === rt.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  <rt.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${selected === rt.id ? "text-primary" : "text-foreground"}`}>{rt.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{rt.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From Date" icon={Calendar} type="date" placeholder="" />
            <Field label="To Date" icon={Calendar} type="date" placeholder="" />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              className={`flex-1 text-primary-foreground transition-all ${selected ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              onClick={handleGenerate}
              disabled={!selected || generating}
            >
              {generating ? (
                <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Generating…</span>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Generate Report</>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [addTeacher, setAddTeacher] = useState(false);
  const [addStudent, setAddStudent] = useState(false);
  const [postAnnouncement, setPostAnnouncement] = useState(false);
  const [generateReport, setGenerateReport] = useState(false);

  return (
    <>
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
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => setAddTeacher(true)}
                >
                  <Plus className="h-4 w-4 text-primary" /> Add Teacher
                </Button>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => setAddStudent(true)}
                >
                  <Plus className="h-4 w-4 text-success" /> Add Student
                </Button>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => setPostAnnouncement(true)}
                >
                  <Bell className="h-4 w-4 text-warning" /> Post Announcement
                </Button>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => setGenerateReport(true)}
                >
                  <FileText className="h-4 w-4 text-info" /> Generate Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Modals */}
      <AddTeacherModal open={addTeacher} onClose={() => setAddTeacher(false)} />
      <AddStudentModal open={addStudent} onClose={() => setAddStudent(false)} />
      <PostAnnouncementModal open={postAnnouncement} onClose={() => setPostAnnouncement(false)} />
      <GenerateReportModal open={generateReport} onClose={() => setGenerateReport(false)} />
    </>
  );
};

export default AdminDashboard;
