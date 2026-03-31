import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, ChevronRight, Grid3X3, X, BookOpen,
  CheckCircle2, AlertTriangle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClasses, ClassItem, Section } from "@/context/ClassContext";
import { toast } from "sonner";

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({
  open, onClose, title, subtitle, icon: Icon, children, danger = false,
}: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  icon: React.ElementType; children: React.ReactNode; danger?: boolean;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl"
      >
        <div className={`px-6 py-4 ${danger ? "bg-destructive" : "bg-primary"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{title}</h2>
                {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
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

// ─── Field Helper ─────────────────────────────────────────────────────────────
const Field = ({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string;
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
    {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

// ─── Classes Page ─────────────────────────────────────────────────────────────
const ClassesPage = () => {
  const { classes, loading, addClass, deleteClass, updateClass, addSection, updateSection, deleteSection } = useClasses();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal states
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [editClassObj, setEditClassObj] = useState<ClassItem | null>(null);
  const [deleteClassObj, setDeleteClassObj] = useState<ClassItem | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editSectionObj, setEditSectionObj] = useState<Section | null>(null);    
  const [deleteSectionObj, setDeleteSectionObj] = useState<Section | null>(null); 

  const [isDeleting, setIsDeleting] = useState(false);

  // Form values
  const [newClassName, setNewClassName] = useState("");
  const [newClassNum, setNewClassNum] = useState("");
  const [editClassName, setEditClassName] = useState("");
  const [editClassNum, setEditClassNum] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [editSectionName, setEditSectionName] = useState("");

  // Success states
  const [addClassSuccess, setAddClassSuccess] = useState(false);
  const [addSectionSuccess, setAddSectionSuccess] = useState(false);

  const selectedClass = classes.find((c) => c.id === selectedId);

  // Set default selection when loading finishes
  useEffect(() => {
    if (!loading && classes.length > 0 && !selectedId) {
      setSelectedId(classes[0].id);
    }
  }, [loading, classes, selectedId]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    const { data, error } = await addClass(newClassName.trim(), parseInt(newClassNum) || 0);
    if (!error && data) {
      setSelectedId(data.id);
      setAddClassSuccess(true);
    }
  };

  const handleUpdateClass = async () => {
    if (!editClassName.trim() || !editClassObj) return;
    const { error } = await updateClass(editClassObj.id, editClassName.trim(), parseInt(editClassNum) || 0);
    if (!error) {
      setEditClassObj(null);
      setEditClassName("");
      setEditClassNum("");
    }
  };

  const handleDeleteClass = async () => {
    if (!deleteClassObj) return;
    setIsDeleting(true);
    const { error } = await deleteClass(deleteClassObj.id);
    setIsDeleting(false);
    
    if (error) {
      toast.error(`Failed to delete class: ${error}`);
      return;
    }

    toast.success(`Class "${deleteClassObj.name}" deleted successfully`);
    
    if (selectedId === deleteClassObj.id) {
      const nextId = classes.find(c => c.id !== deleteClassObj.id)?.id || null;
      setSelectedId(nextId);
    }
    setDeleteClassObj(null);
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !selectedId) return;
    const letter = newSectionName.trim().toUpperCase();
    const { error } = await addSection(selectedId, letter);
    if (!error) {
      setAddSectionSuccess(true);
    }
  };

  const handleSaveEditSection = async () => {
    if (!editSectionName.trim() || !editSectionObj) return;
    const newName = editSectionName.trim().toUpperCase();
    const { error } = await updateSection(editSectionObj.id, newName);
    if (!error) {
      setEditSectionObj(null);
      setEditSectionName("");
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteSectionObj) return;
    const { error } = await deleteSection(deleteSectionObj.id);
    if (error) {
      toast.error(`Failed to delete section: ${error}`);
      return;
    }
    toast.success(`Section "${deleteSectionObj.name}" deleted successfully`);
    setDeleteSectionObj(null);
  };

  const closeAddClass = () => { setAddClassOpen(false); setNewClassName(""); setNewClassNum(""); setAddClassSuccess(false); };
  const closeAddSection = () => { setAddSectionOpen(false); setNewSectionName(""); setAddSectionSuccess(false); };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classes &amp; Sections</h1>
            <p className="text-sm text-muted-foreground">Manage your school's class structure</p>
          </div>
          <Button size="sm" onClick={() => setAddClassOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Class
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Classes List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3 pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {classes.map((cls) => (
                    <motion.button
                      key={cls.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={() => setSelectedId(cls.id)}
                      className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${selectedId === cls.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                        }`}
                    >
                      <span className="font-medium">{cls.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity ${selectedId === cls.id ? "text-primary-foreground" : ""}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditClassObj(cls);
                              setEditClassName(cls.name);
                              setEditClassNum(cls.order.toString());
                            }}
                            className="p-1 rounded hover:bg-white/20"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteClassObj(cls);
                            }}
                            className="p-1 rounded hover:bg-white/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <Badge
                          variant={selectedId === cls.id ? "outline" : "secondary"}
                          className={`text-xs ${selectedId === cls.id ? "border-primary-foreground/30 text-primary-foreground" : ""}`}
                        >
                          {cls.sections.length} sections
                        </Badge>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </div>
                    </motion.button>
                  ))}
                  {classes.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">No classes found.</p>
                  )}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>

          {/* Sections Panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                {selectedClass ? `${selectedClass.name} — Sections` : "Select a class"}
              </CardTitle>
              {selectedClass && (
                <Button size="sm" variant="outline" onClick={() => setAddSectionOpen(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Section
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {selectedClass ? (
                selectedClass.sections.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No sections yet</p>
                    <p className="text-xs text-muted-foreground">Click "+ Add Section" to create the first one.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AnimatePresence initial={false}>
                      {selectedClass.sections.map((section) => (
                        <motion.div
                          key={section.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 transition-shadow hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                              {section.name}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">Section {section.name}</p>
                              <p className="text-xs text-muted-foreground">{selectedClass.name} — {section.name}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditSectionObj(section); setEditSectionName(section.name); }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteSectionObj(section)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-20">Select a class from the left panel to manage its sections.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ── Add Class Modal ──────────────────────────────────────────────── */}
      <Modal open={addClassOpen} onClose={closeAddClass} title="Add New Class" subtitle="Create a class for your school" icon={Grid3X3}>
        {addClassSuccess ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">Class Added!</h3>
            <p className="text-sm text-muted-foreground">
              <strong>{newClassName}</strong> has been added. You can now add sections to it.
            </p>
            <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={closeAddClass}>
              Done
            </Button>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-4 space-y-4">
            <Field
              label="Class Name *"
              value={newClassName}
              onChange={setNewClassName}
              placeholder="e.g. Class 11"
              hint="Enter a unique class name (e.g. Class 5, Grade 10)"
            />
            <Field
              label="Class Number / Grade"
              value={newClassNum}
              onChange={setNewClassNum}
              placeholder="e.g. 11"
              hint="Optional — used for sorting"
            />
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
              💡 Sections can be added after the class is created.
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={closeAddClass}>Cancel</Button>
              <Button
                className={`flex-1 text-primary-foreground transition-all ${newClassName.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                onClick={handleAddClass}
                disabled={!newClassName.trim()}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Class
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Section Modal ────────────────────────────────────────────── */}
      <Modal open={addSectionOpen} onClose={closeAddSection} title={`Add Section to ${selectedClass?.name}`} subtitle="Create a new section" icon={BookOpen}>
        {addSectionSuccess ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">Section Added!</h3>
            <p className="text-sm text-muted-foreground">
              Section <strong>{newSectionName.toUpperCase()}</strong> has been added to <strong>{selectedClass?.name}</strong>.
            </p>
            <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={closeAddSection}>
              Done
            </Button>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-4 space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-xs text-muted-foreground">Adding section to</p>
              <p className="text-sm font-semibold text-primary">{selectedClass?.name}</p>
            </div>
            <Field
              label="Section Letter *"
              value={newSectionName}
              onChange={setNewSectionName}
              placeholder="e.g. C"
              hint="Usually a single letter (A, B, C…)"
            />
            {selectedClass && selectedClass.sections.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Existing sections:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedClass.sections.map((s) => (
                    <span key={s.id} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={closeAddSection}>Cancel</Button>
              <Button
                className={`flex-1 text-primary-foreground transition-all ${newSectionName.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Section Modal ───────────────────────────────────────────── */}
      <Modal
        open={editSectionObj !== null}
        onClose={() => { setEditSectionObj(null); setEditSectionName(""); }}
        title="Edit Section"
        subtitle={`Rename section in ${selectedClass?.name}`}
        icon={Edit}
      >
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">Editing</p>
            <p className="text-sm font-semibold text-primary">{selectedClass?.name} — Section {editSectionObj?.name}</p>
          </div>
          <Field
            label="New Section Name *"
            value={editSectionName}
            onChange={setEditSectionName}
            placeholder="e.g. D"
            hint="Enter the new section letter or name"
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => { setEditSectionObj(null); setEditSectionName(""); }}>
              Cancel
            </Button>
            <Button
              className={`flex-1 text-primary-foreground ${editSectionName.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              onClick={handleSaveEditSection}
              disabled={!editSectionName.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Section Confirm Modal ─────────────────────────────────── */}
      <Modal
        open={deleteSectionObj !== null}
        onClose={() => setDeleteSectionObj(null)}
        title="Delete Section"
        subtitle="This action cannot be undone"
        icon={AlertTriangle}
        danger
      >
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-destructive">Section {deleteSectionObj?.name}</strong> from{" "}
              <strong>{selectedClass?.name}</strong>?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All data associated with this section will be permanently removed.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteSectionObj(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteSection}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Section
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Class Modal ───────────────────────────────────────────── */}
      <Modal
        open={editClassObj !== null}
        onClose={() => { setEditClassObj(null); setEditClassName(""); setEditClassNum(""); }}
        title="Edit Class"
        subtitle="Update class details"
        icon={Edit}
      >
        <div className="px-6 pb-6 pt-4 space-y-4">
          <Field
            label="Class Name *"
            value={editClassName}
            onChange={setEditClassName}
            placeholder="e.g. Class 12"
          />
          <Field
            label="Class Number / Grade"
            value={editClassNum}
            onChange={setEditClassNum}
            placeholder="e.g. 12"
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => { setEditClassObj(null); setEditClassName(""); setEditClassNum(""); }}>
              Cancel
            </Button>
            <Button
              className={`flex-1 text-primary-foreground ${editClassName.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              onClick={handleUpdateClass}
              disabled={!editClassName.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Class Confirm Modal ─────────────────────────────────── */}
      <Modal
        open={deleteClassObj !== null}
        onClose={() => setDeleteClassObj(null)}
        title="Delete Class"
        subtitle="This action cannot be undone"
        icon={AlertTriangle}
        danger
      >
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <strong className="text-destructive">{deleteClassObj?.name}</strong>?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This will also permanently delete <strong>{deleteClassObj?.sections.length} sections</strong> and all associated data (timetable, homework, etc.).
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteClassObj(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteClass}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClassesPage;
