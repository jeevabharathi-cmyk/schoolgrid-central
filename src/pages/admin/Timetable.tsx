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

const SUBJECTS = [
    "Mathematics", "Science", "English", "Hindi", "Social Science",
    "Physical Education", "Computer Science", "Art & Craft", "Music", "Library"
];

const TEACHERS = [
    { id: 1, name: "Mrs. Anita Sharma", subject: "Mathematics" },
    { id: 2, name: "Mr. Rajesh Patel", subject: "Science" },
    { id: 3, name: "Mrs. Priya Kumar", subject: "English" },
    { id: 4, name: "Mr. Suresh Gupta", subject: "Hindi" },
    { id: 5, name: "Mrs. Deepa Nair", subject: "Social Science" },
    { id: 6, name: "Mr. Vikram Singh", subject: "Physical Education" },
    { id: 7, name: "Mrs. Kavya Iyer", subject: "Computer Science" },
    { id: 8, name: "Mr. Arun Ravi", subject: "Art & Craft" },
];

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTIONS: Record<string, string[]> = {
    "Class 5": ["A", "B"],
    "Class 6": ["A", "B"],
    "Class 7": ["A", "B", "C"],
    "Class 8": ["A", "B"],
    "Class 9": ["A", "B"],
    "Class 10": ["A", "B"],
};

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
};

// ─── Seed timetable for Class 5 / Section A ──────────────────────────────────
type SlotKey = string; // "dayIndex-periodNo"
type Slot = { subject: string; teacherId: number };

const seedTimetable = (): Record<SlotKey, Slot> => ({
    "0-1": { subject: "Mathematics", teacherId: 1 },
    "0-2": { subject: "English", teacherId: 3 },
    "0-3": { subject: "Science", teacherId: 2 },
    "0-4": { subject: "Hindi", teacherId: 4 },
    "0-5": { subject: "Social Science", teacherId: 5 },
    "0-6": { subject: "Physical Education", teacherId: 6 },
    "0-7": { subject: "Computer Science", teacherId: 7 },
    "0-8": { subject: "Art & Craft", teacherId: 8 },

    "1-1": { subject: "English", teacherId: 3 },
    "1-2": { subject: "Mathematics", teacherId: 1 },
    "1-3": { subject: "Hindi", teacherId: 4 },
    "1-4": { subject: "Science", teacherId: 2 },
    "1-5": { subject: "Art & Craft", teacherId: 8 },
    "1-6": { subject: "Mathematics", teacherId: 1 },
    "1-7": { subject: "Social Science", teacherId: 5 },
    "1-8": { subject: "English", teacherId: 3 },

    "2-1": { subject: "Science", teacherId: 2 },
    "2-2": { subject: "Social Science", teacherId: 5 },
    "2-3": { subject: "Mathematics", teacherId: 1 },
    "2-4": { subject: "English", teacherId: 3 },
    "2-5": { subject: "Hindi", teacherId: 4 },
    "2-6": { subject: "Physical Education", teacherId: 6 },
    "2-7": { subject: "Computer Science", teacherId: 7 },
    "2-8": { subject: "Science", teacherId: 2 },

    "3-1": { subject: "Hindi", teacherId: 4 },
    "3-2": { subject: "Computer Science", teacherId: 7 },
    "3-3": { subject: "Social Science", teacherId: 5 },
    "3-4": { subject: "Mathematics", teacherId: 1 },
    "3-5": { subject: "Science", teacherId: 2 },
    "3-6": { subject: "English", teacherId: 3 },
    "3-7": { subject: "Hindi", teacherId: 4 },
    "3-8": { subject: "Mathematics", teacherId: 1 },

    "4-1": { subject: "Social Science", teacherId: 5 },
    "4-2": { subject: "Science", teacherId: 2 },
    "4-3": { subject: "English", teacherId: 3 },
    "4-4": { subject: "Art & Craft", teacherId: 8 },
    "4-5": { subject: "Mathematics", teacherId: 1 },
    "4-6": { subject: "Hindi", teacherId: 4 },
    "4-7": { subject: "Physical Education", teacherId: 6 },
    "4-8": { subject: "Social Science", teacherId: 5 },

    "5-1": { subject: "Physical Education", teacherId: 6 },
    "5-2": { subject: "Art & Craft", teacherId: 8 },
    "5-3": { subject: "Computer Science", teacherId: 7 },
    "5-4": { subject: "Science", teacherId: 2 },
    "5-5": { subject: "English", teacherId: 3 },
    "5-6": { subject: "Mathematics", teacherId: 1 },
    "5-7": { subject: "Hindi", teacherId: 4 },
    "5-8": { subject: "Computer Science", teacherId: 7 },
});

// ─── Period Edit Modal ────────────────────────────────────────────────────────
const EditPeriodModal = ({
    open, onClose, day, period, time, currentSlot, onSave,
}: {
    open: boolean; onClose: () => void; day: string; period: number; time: string;
    currentSlot: Slot | null;
    onSave: (slot: Slot) => void;
}) => {
    const [subject, setSubject] = useState(currentSlot?.subject ?? "");
    const [teacherId, setTeacherId] = useState(currentSlot?.teacherId ?? 0);
    const [saved, setSaved] = useState(false);

    const filteredTeachers = subject
        ? TEACHERS.filter((t) => t.subject === subject || true) // show all, highlight matching
        : TEACHERS;

    const handleSave = () => {
        if (!subject || !teacherId) return;
        onSave({ subject, teacherId });
        setSaved(true);
    };

    const handleClose = () => { setSaved(false); setSubject(currentSlot?.subject ?? ""); setTeacherId(currentSlot?.teacherId ?? 0); onClose(); };

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
                            <strong>{subject}</strong> assigned to{" "}
                            <strong>{TEACHERS.find((t) => t.id === teacherId)?.name}</strong>.
                        </p>
                        <Button className="mt-2 bg-primary text-primary-foreground" onClick={handleClose}>Done</Button>
                    </div>
                ) : (
                    <div className="px-6 pb-6 pt-4 space-y-4">
                        {/* Subject */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Subject *</label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                                {SUBJECTS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSubject(s)}
                                        className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${subject === s
                                            ? "border-primary bg-primary/8 text-primary ring-1 ring-primary/30"
                                            : "border-border bg-secondary/30 text-foreground hover:bg-secondary"
                                            }`}
                                    >
                                        {s}
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
                                            {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-semibold truncate ${teacherId === t.id ? "text-primary" : "text-foreground"}`}>{t.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{t.subject}</p>
                                        </div>
                                        {t.subject === subject && (
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
                                className={`flex-1 text-primary-foreground ${subject && teacherId ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                                onClick={handleSave}
                                disabled={!subject || !teacherId}
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
    const [selectedClass, setSelectedClass] = useState("Class 5");
    const [selectedSection, setSelectedSection] = useState("A");

    // Dynamically pre-populate templates for all classes and sections
    const [timetables, setTimetables] = useState<Record<string, Record<SlotKey, Slot>>>(() => {
        const initial: Record<string, Record<SlotKey, Slot>> = {};
        Object.entries(SECTIONS).forEach(([className, sections]) => {
            sections.forEach(section => {
                initial[`${className}-${section}`] = seedTimetable();
            });
        });
        return initial;
    });

    const [editModal, setEditModal] = useState<{ day: number; period: number } | null>(null);
    const [clearModal, setClearModal] = useState<{ day: number; period: number } | null>(null);

    const tableKey = `${selectedClass}-${selectedSection}`;
    const timetable = timetables[tableKey] ?? {};
    const hasTimetable = Object.keys(timetable).length > 0;

    const getSlot = (dayIndex: number, periodNo: number): Slot | null =>
        timetable[`${dayIndex}-${periodNo}`] ?? null;

    const saveSlot = (dayIndex: number, periodNo: number, slot: Slot) => {
        setTimetables((prev) => ({
            ...prev,
            [tableKey]: { ...prev[tableKey], [`${dayIndex}-${periodNo}`]: slot },
        }));
        setEditModal(null);
    };

    const clearSlot = (dayIndex: number, periodNo: number) => {
        setTimetables((prev) => {
            const updated = { ...prev[tableKey] };
            delete updated[`${dayIndex}-${periodNo}`];
            return { ...prev, [tableKey]: updated };
        });
        setClearModal(null);
    };

    const createBlankTimetable = () => {
        setTimetables((prev) => ({ ...prev, [tableKey]: {} }));
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
                            {CLASSES.map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => { setSelectedClass(cls); setSelectedSection(SECTIONS[cls][0]); }}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${selectedClass === cls
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                                        }`}
                                >
                                    {cls}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Section:</span>
                        <div className="flex gap-1.5">
                            {(SECTIONS[selectedClass] ?? []).map((sec) => (
                                <button
                                    key={sec}
                                    onClick={() => setSelectedSection(sec)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${selectedSection === sec
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    {sec}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                {hasTimetable && (
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-foreground">{selectedClass} – Section {selectedSection}</span>
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
                )}

                {/* No timetable state */}
                {!hasTimetable ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">No timetable yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {selectedClass} – Section {selectedSection} doesn't have a timetable. Create one to get started.
                                </p>
                            </div>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={createBlankTimetable}>
                                <Plus className="mr-2 h-4 w-4" /> Create Timetable
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Timetable Grid */
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
                            <CardTitle className="text-sm font-semibold">
                                {selectedClass} – Section {selectedSection} · Weekly Schedule
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setTimetables((p) => ({ ...p, [tableKey]: {} }))}>
                                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Clear All
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
                                                        const colorCls = slot ? (SUBJECT_COLORS[slot.subject] ?? "bg-gray-100 text-gray-800 border-gray-200") : "";
                                                        const teacher = slot ? TEACHERS.find((t) => t.id === slot.teacherId) : null;

                                                        return (
                                                            <td key={day} className="border-b border-r border-border px-1.5 py-1.5 last:border-r-0">
                                                                <AnimatePresence mode="wait">
                                                                    {slot ? (
                                                                        <motion.div
                                                                            key="filled"
                                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                                            className={`group relative rounded-lg border px-2 py-1.5 ${colorCls} cursor-pointer`}
                                                                            onClick={() => setEditModal({ day: dayIndex, period: periodNo })}
                                                                        >
                                                                            <p className="text-[11px] font-bold leading-tight truncate">{slot.subject}</p>
                                                                            <div className="mt-0.5 flex items-center gap-1">
                                                                                <User className="h-2.5 w-2.5 shrink-0" />
                                                                                <p className="text-[10px] truncate opacity-80">
                                                                                    {teacher?.name.split(" ").slice(-1)[0]}
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
                {hasTimetable && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Subject Legend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(SUBJECT_COLORS).map(([subj, cls]) => (
                                    <span key={subj} className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${cls}`}>{subj}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Staff Overview */}
                {hasTimetable && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Assigned Staff — {selectedClass} Section {selectedSection}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {TEACHERS.map((teacher) => {
                                    const slots = Object.values(timetable).filter((s) => s.teacherId === teacher.id);
                                    if (slots.length === 0) return null;
                                    return (
                                        <div key={teacher.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                                {teacher.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">{teacher.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{teacher.subject}</p>
                                                <Badge variant="secondary" className="mt-0.5 text-[10px]">{slots.length} period{slots.length !== 1 ? "s" : ""}</Badge>
                                            </div>
                                        </div>
                                    );
                                })}
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
