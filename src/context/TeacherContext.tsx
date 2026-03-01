import React, { createContext, useContext, useState, ReactNode } from "react";

export type Teacher = {
    id: number;
    name: string;
    phone: string;
    email: string;
    subjects: string[];
    classes: string[];
    status: "active" | "inactive";
    address?: string;
    joiningDate?: string;
};

interface TeacherContextType {
    teachers: Teacher[];
    addTeacher: (teacher: Omit<Teacher, "id">) => void;
}

const initialTeachers: Teacher[] = [
    { id: 1, name: "Mrs. Anita Sharma", phone: "+91 98765 43210", email: "anita.sharma@school.edu", subjects: ["Mathematics"], classes: ["8A", "9B"], status: "active" },
    { id: 2, name: "Mr. Rajesh Patel", phone: "+91 98765 43211", email: "rajesh.patel@school.edu", subjects: ["Science"], classes: ["10A", "10B"], status: "active" },
    { id: 3, name: "Mrs. Priya Kumar", phone: "+91 98765 43212", email: "priya.kumar@school.edu", subjects: ["English"], classes: ["7A", "7B", "7C"], status: "active" },
    { id: 4, name: "Mr. Suresh Gupta", phone: "+91 98765 43213", email: "suresh.gupta@school.edu", subjects: ["Hindi"], classes: ["6A", "6B"], status: "inactive" },
    { id: 5, name: "Mrs. Deepa Nair", phone: "+91 98765 43214", email: "deepa.nair@school.edu", subjects: ["Social Science"], classes: ["8B", "9A"], status: "active" },
    { id: 6, name: "Mr. Vikram Singh", phone: "+91 98765 43215", email: "vikram.singh@school.edu", subjects: ["Physical Education"], classes: ["All"], status: "active" },
];

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

    const addTeacher = (newTeacher: Omit<Teacher, "id">) => {
        const teacherWithId = {
            ...newTeacher,
            id: Math.max(0, ...teachers.map(t => t.id)) + 1,
        };
        setTeachers((prev) => [teacherWithId, ...prev]);
    };

    return (
        <TeacherContext.Provider value={{ teachers, addTeacher }}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeachers = () => {
    const context = useContext(TeacherContext);
    if (context === undefined) {
        throw new Error("useTeachers must be used within a TeacherProvider");
    }
    return context;
};
