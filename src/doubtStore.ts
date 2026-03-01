// doubtStore.ts
// Homework-linked Doubt Discussion Module.
// Manages doubt submissions from students and teacher replies.
// Uses the same pub/sub singleton pattern as homeworkStore.

export type DoubtStatus = "Pending" | "Answered";

export type Doubt = {
    id: string;             // e.g. "DBT-001"
    homeworkId: string;     // e.g. "HW-8A-001"
    studentId: string;      // e.g. "APP-2024-001"
    studentName: string;
    question: string;
    timestamp: string;      // "11:34 AM"
    status: DoubtStatus;
    teacherReply: string | null;
    replyTimestamp: string | null;
    teacherId: string | null; // e.g. "TCH-2024-001"
};

// Each homework post registered in the system with its unique ID and metadata
export type HomeworkPost = {
    id: string;
    title: string;
    class: string;
    subject: string;
};

// ── Registered homework posts ────────────────────────────────────────────────
// These match the homework cards shown in ParentApp and recentPosts in TeacherApp.
const homeworkPosts: HomeworkPost[] = [
    { id: "HW-8A-001", title: "Chapter 5 Exercises", class: "8A", subject: "Mathematics" },
    { id: "HW-8A-002", title: "Read Chapter 3", class: "8A", subject: "Science" },
    { id: "HW-8A-003", title: "Essay on Environment", class: "8A", subject: "English" },
    { id: "HW-5B-001", title: "Learn poem", class: "5B", subject: "Hindi" },
    { id: "HW-5B-002", title: "Draw water cycle", class: "5B", subject: "EVS" },
    { id: "HW-9B-001", title: "Unit Test Announcement", class: "9B", subject: "Mathematics" },
    { id: "HW-10A-001", title: "Assignment: Trigonometry", class: "10A", subject: "Mathematics" },
];

// ── In-memory store ──────────────────────────────────────────────────────────
let doubts: Doubt[] = [];
let doubtCounter = 1;

// ── Pub / Sub ────────────────────────────────────────────────────────────────
const listeners: Array<() => void> = [];

export function subscribe(fn: () => void): () => void {
    listeners.push(fn);
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
    };
}

function notify() {
    listeners.forEach((fn) => fn());
}

function nowTime(): string {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function nextId(): string {
    return `DBT-${String(doubtCounter++).padStart(3, "0")}`;
}

// ── Queries ──────────────────────────────────────────────────────────────────

/** Get homework ID by class + subject (used by ParentApp). */
export function getHomeworkId(cls: string, subject: string): string | null {
    return homeworkPosts.find((p) => p.class === cls && p.subject === subject)?.id ?? null;
}

/** Get full metadata for a homework by ID. */
export function getHomeworkPost(id: string): HomeworkPost | null {
    return homeworkPosts.find((p) => p.id === id) ?? null;
}

/** All doubts for one homework, in chronological order. */
export function getDoubtsForHomework(homeworkId: string): Doubt[] {
    return doubts.filter((d) => d.homeworkId === homeworkId);
}

/** Count of Pending doubts for a homework (for teacher notification badge). */
export function getPendingCount(homeworkId: string): number {
    return doubts.filter((d) => d.homeworkId === homeworkId && d.status === "Pending").length;
}

/** Full snapshot of all doubts (for reactive state). */
export function getAllDoubts(): Doubt[] {
    return [...doubts];
}

// ── Mutations ────────────────────────────────────────────────────────────────

/**
 * Student submits a doubt under a specific homework.
 * Records Student ID, Homework ID, question text, and exact timestamp.
 */
export function submitDoubt(params: {
    homeworkId: string;
    studentId: string;   // APP-2024-001 etc.
    studentName: string;
    question: string;
}): Doubt {
    const doubt: Doubt = {
        id: nextId(),
        homeworkId: params.homeworkId,
        studentId: params.studentId,
        studentName: params.studentName,
        question: params.question,
        timestamp: nowTime(),
        status: "Pending",
        teacherReply: null,
        replyTimestamp: null,
        teacherId: null,
    };
    doubts = [...doubts, doubt];
    notify();
    return doubt;
}

/**
 * Teacher posts a reply to a doubt.
 * Updates status to "Answered", logs Teacher ID and exact reply timestamp.
 */
export function replyToDoubt(doubtId: string, teacherId: string, reply: string): void {
    doubts = doubts.map((d) =>
        d.id === doubtId
            ? {
                ...d,
                status: "Answered" as DoubtStatus,
                teacherReply: reply,
                replyTimestamp: nowTime(),
                teacherId,
            }
            : d
    );
    notify();
}
