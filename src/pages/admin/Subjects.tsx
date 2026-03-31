import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, BookMarked, CheckCircle2, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Subject = {
  id: string;
  name: string;
  code: string;
};

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
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl"
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

// ─── Add Subject Modal ────────────────────────────────────────────────────────
const AddSubjectModal = ({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [savedName, setSavedName] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    if (!name || !code) return;
    const { error } = await supabase
      .from("subjects")
      .insert({ name, code })
      .select()
      .single();

    if (!error) {
      setSavedName(name);
      setSubmitted(true);
      onAdded();
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setCode("");
    setSavedName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Subject" subtitle="Configure a new subject" icon={BookMarked}>
      {submitted ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">Subject Added!</h3>
          <p className="text-sm text-muted-foreground"><strong>{savedName}</strong> has been added to the curriculum.</p>
          <Button className="mt-2 bg-primary text-primary-foreground" onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject Code *</label>
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. MATH" maxLength={6} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd} disabled={!name || !code}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Subject
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const SubjectsPage = () => {
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { session } = useAuth();

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, code")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setSubjects(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchSubjects();
  }, [session, fetchSubjects]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (!error) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
            <p className="text-sm text-muted-foreground">{subjects.length} subjects configured</p>
          </div>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Subject
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search subjects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((subject) => (
                  <tr key={subject.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{subject.name}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{subject.code}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No subjects found. Click "Add Subject" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
      <AddSubjectModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdded={fetchSubjects} />
    </>
  );
};

export default SubjectsPage;
