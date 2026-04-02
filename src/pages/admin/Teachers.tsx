import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Mail, Phone, Edit, UserX, X, CheckCircle2, User, BookMarked, School, Calendar, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeachers, Teacher } from "@/context/TeacherContext";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import Papa from "papaparse";

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, subtitle, icon: Icon, children, danger = false }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  icon: React.ElementType; children: React.ReactNode; danger?: boolean;
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
        <div className={`${danger ? "bg-destructive" : "bg-primary"} px-6 py-4`}>
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

// ─── Add Teacher Modal ────────────────────────────────────────────────────────
const AddTeacherModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const { addTeacher } = useTeachers();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherClass, setTeacherClass] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [loading, setLoading] = useState(false);

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
    
    if (!error) {
      setSubmitted(true);
      toast.success("Teacher added successfully");
    } else {
      toast.error(`Error adding teacher: ${error}`);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName(""); setPhone(""); setEmail(""); setSubject(""); setTeacherClass("");
    setAddress(""); setJoiningDate("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Teacher" subtitle="Register a new staff member" icon={User}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Teacher Registered!</h3>
          <p className="text-sm text-muted-foreground"><strong>{name}</strong> has been added to the registry.</p>
          <Button className="mt-2 bg-primary text-primary-foreground" onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mrs. Anita Sharma" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone *</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="pl-3" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.edu" className="pl-3" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {["Mathematics", "Science", "English", "Hindi", "Social Science", "Physical Education"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Assigned Class</label>
              <Select value={teacherClass} onValueChange={setTeacherClass}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd} disabled={!name || !phone || !subject || loading}>
              {loading ? "Adding..." : "Add Teacher"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Edit Teacher Modal ───────────────────────────────────────────────────────
const EditTeacherModal = ({ open, onClose, teacher }: { open: boolean; onClose: () => void; teacher: Teacher | null }) => {
  const { updateTeacher } = useTeachers();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherClass, setTeacherClass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setName(teacher.full_name);
      setPhone(teacher.phone);
      setEmail(teacher.email);
      setSubject(teacher.subjects[0] || "");
      setTeacherClass(teacher.classes?.[0] || "");
    }
  }, [teacher]);

  if (!open || !teacher) return null;

  const handleUpdate = async () => {
    if (!name || !phone || !subject) return;
    setLoading(true);
    const { error } = await updateTeacher(teacher.id, {
      full_name: name,
      phone,
      email,
      subjects: [subject],
      classes: teacherClass ? [teacherClass] : [],
    });
    setLoading(false);

    if (!error) {
      toast.success("Teacher profile updated");
      onClose();
    } else {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Teacher" subtitle="Update staff member details" icon={Edit}>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-6 pb-6 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone *</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-3" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-3" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {["Mathematics", "Science", "English", "Hindi", "Social Science", "Physical Education"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Assigned Class</label>
            <Select value={teacherClass} onValueChange={setTeacherClass}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Delete Teacher Modal ─────────────────────────────────────────────────────
const DeleteTeacherModal = ({ open, onClose, teacher }: { open: boolean; onClose: () => void; teacher: Teacher | null }) => {
  const { deleteTeacher } = useTeachers();
  const [loading, setLoading] = useState(false);

  if (!open || !teacher) return null;

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await deleteTeacher(teacher.id);
    setLoading(false);

    if (!error) {
      toast.success("Teacher removed successfully");
      onClose();
    } else {
      toast.error(`Error removing teacher: ${error}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Remove Teacher" subtitle="This action cannot be undone" icon={AlertTriangle} danger>
      <div className="px-6 pb-6 pt-4 space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-foreground">
            Are you sure you want to remove <strong className="text-destructive">{teacher.full_name}</strong>?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This will permanently delete their account and associated assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete} disabled={loading}>
            {loading ? "Removing..." : "Remove Teacher"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const TeachersPage = () => {
  const { teachers, loading, importTeachers } = useTeachers();
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ["full_name", "phone", "email", "subjects", "classes"];
    const sampleData = ["Anita Sharma", "+91 9876543210", "anita@school.edu", "Mathematics, Science", "Class 10, Class 11"];
    const csvContent = [headers, sampleData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "teachers_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Template downloaded. Fill it and upload.");
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { error, count } = await importTeachers(results.data);
        if (error) {
          toast.error(`Import failed: ${error}`);
        } else {
          toast.success(`Successfully imported ${count} teachers`);
        }
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: (error) => {
        toast.error(`CSV Parsing error: ${error.message}`);
      }
    });
  };

  const filtered = teachers.filter((t) =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
            <p className="text-sm text-muted-foreground">{teachers.length} teachers registered</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              className="hidden" 
            />
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="text-xs">
              Download Template
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportCSV}>
              <Upload className="mr-1.5 h-4 w-4" /> Import CSV
            </Button>
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Teacher
            </Button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name or subject..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Name</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell">Contact</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:table-cell">Subjects</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground sm:table-cell">Classes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                              {teacher.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{teacher.full_name}</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {teacher.email}</div>
                          <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {teacher.phone}</div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="text-sm text-muted-foreground">{teacher.classes.join(", ")}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={teacher.status === "active" ? "default" : "secondary"} className="text-xs">
                          {teacher.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedTeacher(teacher); setEditModalOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { setSelectedTeacher(teacher); setDeleteModalOpen(true); }}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <AddTeacherModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditTeacherModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedTeacher(null); }} teacher={selectedTeacher} />
      <DeleteTeacherModal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedTeacher(null); }} teacher={selectedTeacher} />
    </>
  );
};

export default TeachersPage;
