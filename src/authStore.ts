// authStore.ts
// Manages session information like last login time for Parents and Teachers.

type SessionInfo = {
    lastLogin: string | null;
    status: "Active" | "Inactive";
};

type AuthStore = {
    parent: SessionInfo;
    teacher: SessionInfo;
};

// Initialize with some default "Today" values if not set
const store: AuthStore = {
    parent: { lastLogin: null, status: "Active" },
    teacher: { lastLogin: null, status: "Active" },
};

const listeners: Array<() => void> = [];

export function subscribeAuth(fn: () => void): () => void {
    listeners.push(fn);
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
    };
}

function notify() {
    listeners.forEach((fn) => fn());
}

function nowTimeWithDate(): string {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `Today, ${time}`;
}

/** Sets the login time for a specific role if not already set in this session. */
export function initializeSession(role: "parent" | "teacher"): void {
    if (!store[role].lastLogin) {
        store[role].lastLogin = nowTimeWithDate();
        notify();
    }
}

export function getSession(role: "parent" | "teacher"): SessionInfo {
    return store[role];
}
