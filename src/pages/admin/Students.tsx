import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/context/StudentContext";
import { User, FileText, Calendar, School, BookOpen, Users, Phone, Mail, MapPin, CheckCircle2, X } from "lucide-react";

// ─── Modal Wrapper (Reuse for consistency) ───
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
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ─── Add Student Modal (Reuse logic from Dashboard for consistency) ───
const AddStudentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const { enrollStudent } = useStudents();
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
    setName(""); setAdmNo(""); setDob(""); setStudentClass(""); setSection("");
    setParentName(""); setParentPhone(""); setParentEmail(""); setAddress("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Student" subtitle="Enroll a new student" icon={School}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Student Enrolled!</h3>
          <p className="text-sm text-muted-foreground"><strong>{name}</strong> has been added to the registry.</p>
          <Button className="mt-2 bg-primary text-primary-foreground" onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Mehta" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Class *</label>
              <Select value={studentClass} onValueChange={setStudentClass}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {["5", "6", "7", "8", "9", "10"].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Section *</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Parent Name *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. Mr. Sunil Mehta" className="pl-9" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Parent Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+91 98765 43210" className="pl-9" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleEnroll} disabled={!name || !studentClass || !section || !parentName || !parentPhone}>
              Enroll Student
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const StudentsPage = () => {
  const { students } = useStudents();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search);
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">{students.length} students enrolled</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Import CSV</Button>
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Student
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or admission no..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {["5", "6", "7", "8", "9", "10"].map((c) => (
                <SelectItem key={c} value={c}>Class {c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Adm. No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Class</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground sm:table-cell">Section</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell">Parent</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.admNo}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">Class {student.class}</Badge></td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{student.section}</td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{student.parent}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-xs">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <AddStudentModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
};

export default StudentsPage;
