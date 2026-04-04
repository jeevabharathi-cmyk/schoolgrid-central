import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents, Student } from "@/context/StudentContext";
import { User, FileText, Calendar, School, BookOpen, Users, Phone, Mail, MapPin, CheckCircle2, X, Edit, Trash2, UserPlus, AlertTriangle, Search as SearchIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

// ─── Modal Wrapper (Reuse for consistency) ───
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

// ─── Add Student Modal (Reuse logic from Dashboard for consistency) ───
const AddStudentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const { enrollStudent } = useStudents();
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [dob, setDob] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [address, setAddress] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const { data: cls } = await supabase.from("classes").select("*").order("name");
        const { data: sec } = await supabase.from("sections").select("*").order("name");
        setClasses(cls || []);
        setSections(sec || []);
      };
      fetchData();
    }
  }, [open]);

  if (!open) return null;

  const handleEnroll = async () => {
    if (!name || !selectedClassId || !selectedSectionId || !parentName || !parentPhone) return;
    
    const selectedClass = classes.find(c => c.id === selectedClassId);
    const selectedSection = sections.find(s => s.id === selectedSectionId);

    const { error } = await enrollStudent({
      name,
      admNo: admNo || `ADM${Date.now().toString().slice(-6)}`,
      class: selectedClass?.name || "",
      section: selectedSection?.name || "",
      classId: selectedClassId,
      sectionId: selectedSectionId,
      parent: parentName,
      email: parentEmail,
      phone: parentPhone,
      dob,
      address,
      enrollmentDate
    });
    if (!error) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName(""); setAdmNo(""); setDob(""); 
    setSelectedClassId(""); setSelectedSectionId("");
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
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Section *</label>
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId} disabled={!selectedClassId}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {sections
                    .filter(s => s.class_id === selectedClassId)
                    .map(s => (
                      <SelectItem key={s.id} value={s.id}>Section {s.name}</SelectItem>
                    ))
                  }
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
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Street, City, Zip" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none" 
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Enrollment Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="date" 
                  value={enrollmentDate} 
                  onChange={(e) => setEnrollmentDate(e.target.value)} 
                  className="pl-9" 
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleEnroll} disabled={!name || !selectedClassId || !selectedSectionId || !parentName || !parentPhone}>
              Enroll Student
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Edit Student Modal ───────────────────────────────────────────────────────
const EditStudentModal = ({ open, onClose, student }: { open: boolean; onClose: () => void; student: Student | null }) => {
  const { updateStudent } = useStudents();
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [address, setAddress] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cls } = await supabase.from("classes").select("*").order("name");
      const { data: sec } = await supabase.from("sections").select("*").order("name");
      setClasses(cls || []);
      setSections(sec || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAdmNo(student.admNo);
      setAddress(student.address || "");
      setEnrollmentDate(student.enrollmentDate || "");
      setSelectedClassId(student.classId || "");
      setSelectedSectionId(student.sectionId || "");
    }
  }, [student]);

  if (!open || !student) return null;

  const handleUpdate = async () => {
    if (!name || !selectedClassId || !selectedSectionId) return;
    setLoading(true);

    const selectedClass = classes.find(c => c.id === selectedClassId);
    const selectedSection = sections.find(s => s.id === selectedSectionId);

    const { error } = await updateStudent(student.id, {
      name,
      admNo,
      class: selectedClass?.name || "",
      section: selectedSection?.name || "",
      classId: selectedClassId,
      sectionId: selectedSectionId,
      address,
      enrollmentDate
    });
    setLoading(false);

    if (!error) {
      toast.success("Student details updated");
      onClose();
    } else {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Student" subtitle="Update profile information" icon={Edit}>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-6 pb-6 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Adm. No.</label>
            <Input value={admNo} onChange={(e) => setAdmNo(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Class *</label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Section *</label>
            <Select value={selectedSectionId} onValueChange={setSelectedSectionId} disabled={!selectedClassId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections
                  .filter(s => s.class_id === selectedClassId)
                  .map(s => (
                    <SelectItem key={s.id} value={s.id}>Section {s.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none" 
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Enrollment Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="date" 
                value={enrollmentDate} 
                onChange={(e) => setEnrollmentDate(e.target.value)} 
                className="pl-9" 
              />
            </div>
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

// ─── Delete Student Modal ─────────────────────────────────────────────────────
const DeleteStudentModal = ({ open, onClose, student }: { open: boolean; onClose: () => void; student: Student | null }) => {
  const { deleteStudent } = useStudents();
  const [loading, setLoading] = useState(false);

  if (!open || !student) return null;

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await deleteStudent(student.id);
    setLoading(false);

    if (!error) {
      toast.success("Student removed successfully");
      onClose();
    } else {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Remove Student" subtitle="Danger zone" icon={AlertTriangle} danger>
      <div className="px-6 pb-6 pt-4 space-y-4">
        <p className="text-sm">Are you sure you want to remove <strong className="text-destructive">{student.name}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-destructive hover:bg-destructive/90" onClick={handleDelete} disabled={loading}>
            {loading ? "Removing..." : "Remove Student"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Assign Parent Modal ──────────────────────────────────────────────────────
const AssignParentModal = ({ open, onClose, student }: { open: boolean; onClose: () => void; student: Student | null }) => {
  const { assignParent, unassignParent } = useStudents();
  const [parents, setParents] = useState<any[]>([]);
  const [assignedParentIds, setAssignedParentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [parentFilter, setParentFilter] = useState("all");

  useEffect(() => {
    if (open && student) {
      const fetchData = async () => {
        setLoading(true);
        // 1. Fetch all parents
        const { data: parentsData, error: parentsError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone")
          .eq("role", "parent");
        
        if (!parentsError) setParents(parentsData || []);

        // 2. Fetch already assigned parents for this student
        const { data: assignedData, error: assignedError } = await supabase
          .from("student_parents")
          .select("parent_id")
          .eq("student_id", student.id);
        
        if (!assignedError) {
          const linkedIds = (assignedData || []).map(a => a.parent_id);
          setAssignedParentIds(linkedIds);
          
          // If already assigned, default to "assigned" filter
          if (linkedIds.length > 0) {
            setParentFilter("assigned");
          } else {
            setParentFilter("all");
          }
        }

        setLoading(false);
      };
      fetchData();
    }
  }, [open, student]);

  const handleAssign = async (parentId: string) => {
    if (!student) return;
    setAssigning(parentId);
    const { error } = await assignParent(student.id, parentId);
    setAssigning(null);

    if (!error) {
      setAssignedParentIds(prev => [...prev, parentId]);
      setParentFilter("assigned");
      toast.success("Parent assigned successfully");
    } else {
      toast.error(`Error: ${error}`);
    }
  };

  const handleUnassign = async (parentId: string) => {
    if (!student) return;
    setAssigning(parentId);
    const { error } = await unassignParent(student.id, parentId);
    setAssigning(null);

    if (!error) {
      setAssignedParentIds(prev => prev.filter(id => id !== parentId));
      setParentFilter("all");
      toast.success("Parent unassigned successfully");
    } else {
      toast.error(`Error: ${error}`);
    }
  };

  if (!open || !student) return null;

  const filtered = parents.filter(p => {
    const matchesSearch = p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                         p.email?.toLowerCase().includes(search.toLowerCase());
    const isAssigned = assignedParentIds.includes(p.id);
    
    if (parentFilter === "assigned") return matchesSearch && isAssigned;
    if (parentFilter === "not-assigned") return matchesSearch && !isAssigned;
    return matchesSearch;
  });

  return (
    <Modal open={open} onClose={onClose} title="Assign Parent" subtitle={`Select parent for ${student.name}`} icon={UserPlus}>
      <div className="px-6 pb-6 pt-4 space-y-4">
        <div className="space-y-3">
          {assignedParentIds.length === 0 && (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search parents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          )}
          
          <div className="flex gap-1 rounded-lg bg-secondary/50 p-1">
            {assignedParentIds.length > 0 ? (
              <div className="flex-1 rounded-md bg-card px-2 py-1.5 text-xs font-bold text-primary text-center border border-primary/20">
                Currently Assigned
              </div>
            ) : (
              (["all", "assigned", "not-assigned"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setParentFilter(f)}
                  className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold capitalize transition-all ${
                    parentFilter === f
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.replace("-", " ")}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
          {loading ? (
             <div className="flex py-10 justify-center items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No parents found</p>
          ) : (
            filtered.map((parent) => {
              const isAssigned = assignedParentIds.includes(parent.id);
              return (
                <div key={parent.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{parent.full_name}</p>
                    <p className="text-xs text-muted-foreground">{parent.email}</p>
                  </div>
                  {isAssigned ? (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleUnassign(parent.id)}
                      disabled={assigning === parent.id}
                    >
                      {assigning === parent.id ? "Removing..." : "Unassign"}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleAssign(parent.id)}
                      disabled={assigning === parent.id || assignedParentIds.length > 0}
                    >
                      {assigning === parent.id ? "Linking..." : "Assign"}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
        <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

const StudentsPage = () => {
  const { students, loading, importStudents } = useStudents();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ["name", "adm_no", "class", "section", "parent", "phone", "email"];
    const sampleData = ["Aarav Mehta", "ADM001234", "Class 5", "A", "Mr. Sunil Mehta", "+91 9876543210", "parent@example.com"];
    const csvContent = [headers, sampleData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "students_template.csv");
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
        const { error, count } = await importStudents(results.data);
        if (error) {
          toast.error(`Import failed: ${error}`);
        } else {
          toast.success(`Successfully imported ${count} students`);
        }
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: (error) => {
        toast.error(`CSV Parsing error: ${error.message}`);
      }
    });
  };

  const [assignmentFilter, setAssignmentFilter] = useState("all");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search);
    const matchClass = classFilter === "all" || s.class === classFilter;
    
    // Check if parent is formally assigned
    const isAssigned = !!s.isLinked;
    const matchAssignment = assignmentFilter === "all" || 
                          (assignmentFilter === "assigned" && isAssigned) || 
                          (assignmentFilter === "not-assigned" && !isAssigned);
                          
    return matchSearch && matchClass && matchAssignment;
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

          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
            <SelectTrigger className="w-44">
              <UserPlus className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Parent Link" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Student Records</SelectItem>
              <SelectItem value="assigned">Assigned Students</SelectItem>
              <SelectItem value="not-assigned">Pending Assignment</SelectItem>
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
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:table-cell">Address</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground xl:table-cell">Enrolled</th>
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
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell max-w-[150px] truncate">{student.address}</td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground xl:table-cell">{student.enrollmentDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => { setSelectedStudent(student); setEditModalOpen(true); }}
                            title="Edit Student"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => { setSelectedStudent(student); setAssignModalOpen(true); }}
                            title="Assign Parent"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => { setSelectedStudent(student); setDeleteModalOpen(true); }}
                            title="Delete Student"
                          >
                            <Trash2 className="h-4 w-4" />
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
      <AddStudentModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditStudentModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedStudent(null); }} student={selectedStudent} />
      <DeleteStudentModal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedStudent(null); }} student={selectedStudent} />
      <AssignParentModal open={assignModalOpen} onClose={() => { setAssignModalOpen(false); setSelectedStudent(null); }} student={selectedStudent} />
    </>
  );
};

export default StudentsPage;
