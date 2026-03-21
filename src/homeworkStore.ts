// homeworkStore.ts
// Shared singleton store — acts as a bridge between ParentApp and TeacherApp.
// Tracks viewed timestamp AND acknowledged timestamp per student + subject.

export type SubjectAck = {
    subject: string;
    acknowledgedAt: string | null; // e.g. "4:12 PM"
};

export type ViewStatus = {
    viewed: boolean;
    viewedAt: string | null;       // time homework list was first opened
    acknowledged: boolean;         // true if at least one subject acknowledged
    acknowledgedAt: string | null; // time of the FIRST acknowledge action
    subjectAcks: SubjectAck[];     // per-subject acknowledgement records
};

type Store = {
    [childId: number]: ViewStatus;
};

const store: Store = {
    1: { viewed: false, viewedAt: null, acknowledged: false, acknowledgedAt: null, subjectAcks: [] },
    2: { viewed: false, viewedAt: null, acknowledged: false, acknowledgedAt: null, subjectAcks: [] },
};

// Listeners that get called whenever state changes (so TeacherApp can re-render)
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

/** Called by ParentApp as soon as homework cards are rendered for a child. */
export function markViewed(childId: number): void {
    if (!store[childId]) return;
    if (store[childId].viewed) return; // already recorded — don't overwrite timestamp
    store[childId] = { ...store[childId], viewed: true, viewedAt: nowTime() };
    notify();
}

/**
 * Called when a parent taps "Acknowledge" on a specific subject homework.
 * Records the exact timestamp for that subject. Also sets the top-level
 * acknowledged + acknowledgedAt on first ack.
 */
export function markAcknowledged(childId: number, subject: string): void {
    if (!store[childId]) return;

    const existing = store[childId].subjectAcks.find((a) => a.subject === subject);
    if (existing) return; // already acknowledged this subject — no overwrite

    const time = nowTime();
    const newAck: SubjectAck = { subject, acknowledgedAt: time };
    const updatedAcks = [...store[childId].subjectAcks, newAck];

    // First-ever acknowledge sets the top-level time
    const firstAck = !store[childId].acknowledged;

    store[childId] = {
        ...store[childId],
        acknowledged: true,
        acknowledgedAt: firstAck ? time : store[childId].acknowledgedAt,
        subjectAcks: updatedAcks,
    };
    notify();
}

/** Check if a specific subject is acknowledged for a child. */
export function isSubjectAcknowledged(childId: number, subject: string): boolean {
    return store[childId]?.subjectAcks.some((a) => a.subject === subject) ?? false;
}

/** Read the current status for a child. */
export function getStatus(childId: number): ViewStatus {
    return (
        store[childId] ?? {
            viewed: false,
            viewedAt: null,
            acknowledged: false,
            acknowledgedAt: null,
            subjectAcks: [],
        }
    );
}

/** Read the full store snapshot (for Teacher dashboard). */
export function getAllStatuses(): Store {
    return { ...store };
}
