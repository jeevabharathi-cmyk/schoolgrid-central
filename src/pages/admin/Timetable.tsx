import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Edit, Plus, Calendar, User, BookOpen, X, CheckCircle2,
    ChevronDown, Printer, RefreshCw, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useClasses } from "@/context/ClassContext";
import { useTeachers, Teacher } from "@/context/TeacherContext";
import { toast } from "sonner";

// ─── Static Data ──────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PERIODS = [
    { no: 1, time: "8:00 – 8:45" },
    { no: 2, time: "8:45 – 9:30" },
    { no: "Break", time: "9:30 – 9:45", isBreak: true },
    { no: 3, time: "9:45 – 10:30" },
    { no: 4, time: "10:30 – 11:15" },
    { no: "Lunch", time: "11:15 – 12:00", isBreak: true },
    { no: 5, time: "12:00 – 12:45" },
    { no: 6, time: "12:45 – 1:30" },
    { no: 7, time: "1:30 – 2:15" },
    { no: 8, time: "2:15 – 3:00" },
] as const;

// Subject → color mapping
const SUBJECT_COLORS: Record<string, string> = {
    "Mathematics": "bg-blue-100 text-blue-800 border-blue-200",
    "Science": "bg-green-100 text-green-800 border-green-200",
    "English": "bg-purple-100 text-purple-800 border-purple-200",
    "Hindi": "bg-orange-100 text-orange-800 border-orange-200",
    "Social Science": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Physical Education": "bg-red-100 text-red-800 border-red-200",
    "Computer Science": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Art & Craft": "bg-pink-100 text-pink-800 border-pink-200",
    "Music": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Library": "bg-teal-100 text-teal-800 border-teal-200",
    "Social": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

type Subject = {
    id: string;
    name: string;
};

type SlotKey = string; // "dayIndex-periodNo"
type Slot = { subjectId: string; teacherId: string };

// ─── Period Edit Modal ────────────────────────────────────────────────────────
const EditPeriodModal = ({
    open, onClose, day, period, time, currentSlot, onSave, subjects, teachers,
}: {
    open: boolean; onClose: () => void; day: string; period: number; time: string;
    currentSlot: Slot | null;
    onSave: (slot: Slot) => void;
    subjects: Subject[];
    teachers: Teacher[];
}) => {
    const [subjectId, setSubjectId] = useState(currentSlot?.subjectId ?? "");
    const [teacherId, setTeacherId] = useState(currentSlot?.teacherId ?? "");
    const [saved, setSaved] = useState(false);

    const selectedSubject = subjects.find(s => s.id === subjectId);
    const selectedTeacher = teachers.find(t => t.id === teacherId);

    const filteredTeachers = subjectId && selectedSubject
        ? teachers.filter((t) => t.subjects.includes(selectedSubject.name) || true) // show all, highlight matching
        : teachers;

    const handleSave = () => {
        if (!subjectId || !teacherId) return;
        onSave({ subjectId, teacherId });
        setSaved(true);
    };

    const handleClose = () => {
        setSaved(false);
        setSubjectId(currentSlot?.subjectId ?? "");
        setTeacherId(currentSlot?.teacherId ?? "");
        onClose();
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl"
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">
                                    {currentSlot ? "Edit Period" : "Assign Period"}
                                </h2>
                                <p className="text-xs text-blue-100">{day} · Period {period} · {time}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {saved ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">Period Saved!</h3>
                        <p className="text-sm text-muted-foreground">
                            <strong>{selectedSubject?.name}</strong> assigned to{" "}
                            <strong>{selectedTeacher?.full_name}</strong>.
                        </p>
                        <Button className="mt-2 bg-primary text-primary-foreground" onClick={handleClose}>Done</Button>
                    </div>
                ) : (
                    <div className="px-6 pb-6 pt-4 space-y-4">
                        {/* Subject */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                                {subjects.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSubjectId(s.id)}
                                        className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${subjectId === s.id
                                            ? "border-primary bg-primary/8 text-primary ring-1 ring-primary/30"
                                            : "border-border bg-secondary/30 text-foreground hover:bg-secondary"
                                            }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Teacher */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Assign Teacher *</label>
                            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                                {filteredTeachers.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTeacherId(t.id)}
                                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all ${teacherId === t.id
                                            ? "border-primary bg-primary/8 ring-1 ring-primary/30"
                                            : "border-border bg-secondary/30 hover:bg-secondary"
                                            }`}
                                    >
                                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${teacherId === t.id ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                                            }`}>
                                            {t.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-semibold truncate ${teacherId === t.id ? "text-primary" : "text-foreground"}`}>{t.full_name}</p>
                                            <p className="text-[10px] text-muted-foreground">{t.subjects.join(", ")}</p>
                                        </div>
                                        {t.subjects.includes(selectedSubject?.name || "") && (
                                            <span className="ml-auto shrink-0 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">Match</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                            <Button
                                className={`flex-1 text-primary-foreground ${subjectId && teacherId ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                                onClick={handleSave}
                                disabled={!subjectId || !teacherId}
                            >
                                Save Period
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// ─── Clear Period Confirm ─────────────────────────────────────────────────────
const ClearPeriodModal = ({ open, onClose, onConfirm, day, period }: {
    open: boolean; onClose: () => void; onConfirm: () => void; day: string; period: number;
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-2xl"
            >
                <div className="bg-destructive px-6 py-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                        <X className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-white">Clear Period</h2>
                        <p className="text-xs text-red-100">{day} · Period {period}</p>
                    </div>
                </div>
                <div className="px-6 pb-6 pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">This will remove the subject and teacher from this period slot.</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}>Clear Period</Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Timetable Page ───────────────────────────────────────────────────────────
const TimetablePage = () => {
    const { classes, loading: classesLoading } = useClasses();
    const { teachers, loading: teachersLoading } = useTeachers();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timetable, setTimetable] = useState<Record<SlotKey, Slot>>({});
    const [loading, setLoading] = useState(true);

    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedSectionId, setSelectedSectionId] = useState<string>("");

    const [editModal, setEditModal] = useState<{ day: number; period: number } | null>(null);
    const [clearModal, setClearModal] = useState<{ day: number; period: number } | null>(null);

    const selectedClass = classes.find(c => c.id === selectedClassId);
    const selectedSection = selectedClass?.sections.find(s => s.id === selectedSectionId);

    // Initial selection
    useEffect(() => {
        if (!classesLoading && classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].id);
            if (classes[0].sections.length > 0) {
                setSelectedSectionId(classes[0].sections[0].id);
            }
        }
    }, [classesLoading, classes, selectedClassId]);

    // Fetch subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase.from("subjects").select("id, name");
            if (error) {
                console.error("Error fetching subjects:", error);
            } else {
                setSubjects(data || []);
            }
        };
        fetchSubjects();
    }, []);

    // Fetch timetable
    const fetchTimetable = useCallback(async () => {
        if (!selectedClassId || !selectedSectionId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("timetable")
            .select("*")
            .eq("class_id", selectedClassId)
            .eq("section_id", selectedSectionId);

        if (error) {
            console.error("Error fetching timetable:", error);
            toast.error("Failed to load timetable");
        } else {
            const formatted: Record<SlotKey, Slot> = {};
            (data || []).forEach((row: any) => {
                formatted[`${row.day_index}-${row.period_no}`] = {
                    subjectId: row.subject_id,
                    teacherId: row.teacher_id
                };
            });
            setTimetable(formatted);
        }
        setLoading(false);
    }, [selectedClassId, selectedSectionId]);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    const getSlot = (dayIndex: number, periodNo: number): Slot | null =>
        timetable[`${dayIndex}-${periodNo}`] ?? null;

    const saveSlot = async (dayIndex: number, periodNo: number, slot: Slot) => {
        if (!selectedClassId || !selectedSectionId) return;

        const { error } = await supabase
            .from("timetable")
            .upsert({
                class_id: selectedClassId,
                section_id: selectedSectionId,
                day_index: dayIndex,
                period_no: periodNo,
                subject_id: slot.subjectId,
                teacher_id: slot.teacherId,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "class_id,section_id,day_index,period_no"
            });

        if (error) {
            console.error("Error saving slot:", error);
            toast.error("Failed to save period");
        } else {
            setTimetable((prev) => ({
                ...prev,
                [`${dayIndex}-${periodNo}`]: slot,
            }));
            setEditModal(null);
            toast.success("Period updated");
        }
    };

    const clearSlot = async (dayIndex: number, periodNo: number) => {
        if (!selectedClassId || !selectedSectionId) return;

        const { error } = await supabase
            .from("timetable")
            .delete()
            .eq("class_id", selectedClassId)
            .eq("section_id", selectedSectionId)
            .eq("day_index", dayIndex)
            .eq("period_no", periodNo);

        if (error) {
            console.error("Error clearing slot:", error);
            toast.error("Failed to clear period");
        } else {
            setTimetable((prev) => {
                const updated = { ...prev };
                delete updated[`${dayIndex}-${periodNo}`];
                return updated;
            });
            setClearModal(null);
            toast.success("Period cleared");
        }
    };

    const workingPeriods = PERIODS.filter((p) => !("isBreak" in p && p.isBreak));
    const totalSlots = DAYS.length * workingPeriods.length;
    const filledSlots = Object.keys(timetable).length;
    const completionPct = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Class Timetable</h1>
                        <p className="text-sm text-muted-foreground">Schedule periods and assign staff to each class</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="mr-1.5 h-4 w-4" /> Print
                        </Button>
                    </div>
                </div>

                {/* Class + Section Selector */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Class:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {classesLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                classes.map((cls) => (
                                    <button
                                        key={cls.id}
                                        onClick={() => {
                                            setSelectedClassId(cls.id);
                                            if (cls.sections.length > 0) {
                                                setSelectedSectionId(cls.sections[0].id);
                                            }
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${selectedClassId === cls.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                                            }`}
                                    >
                                        {cls.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Section:</span>
                        <div className="flex gap-1.5">
                            {(selectedClass?.sections ?? []).map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => setSelectedSectionId(sec.id)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${selectedSectionId === sec.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    {sec.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">
                            {selectedClass?.name ?? "..."} – Section {selectedSection?.name ?? "..."}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">{filledSlots} / {totalSlots} periods filled</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                        <div className="relative h-4 w-20 overflow-hidden rounded-full bg-secondary">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style={{ width: `${completionPct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{completionPct}% complete</span>
                    </div>
                </div>

                {/* Timetable Grid */}
                {loading ? (
                    <Card className="py-16">
                        <CardContent className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading timetable...</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
                            <CardTitle className="text-sm font-semibold">
                                {selectedClass?.name} – Section {selectedSection?.name} · Weekly Schedule
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={fetchTimetable}>
                                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] border-collapse">
                                    <thead>
                                        <tr className="bg-primary/5">
                                            <th className="w-28 border-b border-r border-border px-3 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                                Period / Day
                                            </th>
                                            {SHORT_DAYS.map((d) => (
                                                <th key={d} className="border-b border-r border-border px-3 py-3 text-center text-xs font-semibold uppercase text-muted-foreground last:border-r-0">
                                                    {d}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PERIODS.map((period) => {
                                            const isBreak = "isBreak" in period && period.isBreak;
                                            return (
                                                <tr
                                                    key={String(period.no)}
                                                    className={isBreak ? "bg-secondary/60" : "hover:bg-secondary/20 transition-colors"}
                                                >
                                                    {/* Period label */}
                                                    <td className="border-b border-r border-border px-3 py-2">
                                                        {isBreak ? (
                                                            <div className="text-center">
                                                                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{period.no}</span>
                                                                <p className="text-[10px] text-muted-foreground">{period.time}</p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span className="text-xs font-bold text-foreground">Period {period.no}</span>
                                                                <p className="text-[10px] text-muted-foreground">{period.time}</p>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Day cells */}
                                                    {DAYS.map((day, dayIndex) => {
                                                        if (isBreak) {
                                                            return (
                                                                <td key={day} className="border-b border-r border-border px-2 py-2 last:border-r-0">
                                                                    <div className="flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                                                                        {String(period.no)}
                                                                    </div>
                                                                </td>
                                                            );
                                                        }
                                                        const periodNo = period.no as number;
                                                        const slot = getSlot(dayIndex, periodNo);
                                                        const subject = subjects.find(s => s.id === slot?.subjectId);
                                                        const colorCls = subject ? (SUBJECT_COLORS[subject.name] ?? "bg-gray-100 text-gray-800 border-gray-200") : "";
                                                        const teacher = slot ? teachers.find((t) => t.id === slot.teacherId) : null;

                                                        return (
                                                            <td key={day} className="border-b border-r border-border px-1.5 py-1.5 last:border-r-0">
                                                                <AnimatePresence mode="wait">
                                                                    {slot && subject ? (
                                                                        <motion.div
                                                                            key="filled"
                                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                                            className={`group relative rounded-lg border px-2 py-1.5 ${colorCls} cursor-pointer`}
                                                                            onClick={() => setEditModal({ day: dayIndex, period: periodNo })}
                                                                        >
                                                                            <p className="text-[11px] font-bold leading-tight truncate">{subject.name}</p>
                                                                            <div className="mt-0.5 flex items-center gap-1">
                                                                                <User className="h-2.5 w-2.5 shrink-0" />
                                                                                <p className="text-[10px] truncate opacity-80">
                                                                                    {teacher?.full_name?.split(" ").slice(-1)[0] ?? "N/A"}
                                                                                </p>
                                                                            </div>
                                                                            {/* Edit overlay on hover */}
                                                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
                                                                                <div className="flex gap-1">
                                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/80 text-foreground shadow">
                                                                                        <Edit className="h-3 w-3" />
                                                                                    </div>
                                                                                    <div
                                                                                        className="flex h-6 w-6 items-center justify-center rounded-md bg-white/80 text-destructive shadow"
                                                                                        onClick={(e) => { e.stopPropagation(); setClearModal({ day: dayIndex, period: periodNo }); }}
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.button
                                                                            key="empty"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            onClick={() => setEditModal({ day: dayIndex, period: periodNo })}
                                                                            className="flex h-full w-full min-h-[52px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground/40 transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                                                        >
                                                                            <Plus className="h-3.5 w-3.5" />
                                                                        </motion.button>
                                                                    )}
                                                                </AnimatePresence>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Subject Legend */}
                {subjects.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Subject Legend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subj) => (
                                    <span key={subj.id} className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${SUBJECT_COLORS[subj.name] ?? "bg-gray-100 border-gray-200"}`}>{subj.name}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Staff Overview */}
                {selectedClass && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Assigned Staff — {selectedClass.name} Section {selectedSection?.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {teachers.map((teacher) => {
                                    const slots = Object.values(timetable).filter((s) => s.teacherId === teacher.id);
                                    if (slots.length === 0) return null;
                                    return (
                                        <div key={teacher.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                                {teacher.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">{teacher.full_name}</p>
                                                <p className="text-[10px] text-muted-foreground">{teacher.subjects.join(", ")}</p>
                                                <Badge variant="secondary" className="mt-0.5 text-[10px]">{slots.length} period{slots.length !== 1 ? "s" : ""}</Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                                {Object.keys(timetable).length === 0 && (
                                    <p className="col-span-full py-4 text-center text-xs text-muted-foreground">No staff assigned yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>

            {/* Edit Period Modal */}
            {editModal && (
                <EditPeriodModal
                    open
                    onClose={() => setEditModal(null)}
                    day={DAYS[editModal.day]}
                    period={editModal.period}
                    time={PERIODS.find((p) => !("isBreak" in p) && p.no === editModal.period)?.time ?? ""}
                    currentSlot={getSlot(editModal.day, editModal.period)}
                    onSave={(slot) => saveSlot(editModal.day, editModal.period, slot)}
                    subjects={subjects}
                    teachers={teachers}
                />
            )}

            {/* Clear Confirm */}
            {clearModal && (
                <ClearPeriodModal
                    open
                    onClose={() => setClearModal(null)}
                    onConfirm={() => clearSlot(clearModal.day, clearModal.period)}
                    day={DAYS[clearModal.day]}
                    period={clearModal.period}
                />
            )}
        </>
    );
};

export default TimetablePage;
