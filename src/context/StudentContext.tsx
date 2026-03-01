import React, { createContext, useContext, useState, ReactNode } from "react";

export type Student = {
    id: number;
    name: string;
    admNo: string;
    class: string;
    section: string;
    parent: string;
    email?: string;
    phone?: string;
    dob?: string;
    address?: string;
};

interface StudentContextType {
    students: Student[];
    enrollStudent: (student: Omit<Student, "id">) => void;
}

const initialStudents: Student[] = [
    { id: 1, name: "Aarav Mehta", admNo: "2024001", class: "8", section: "A", parent: "Mr. Sunil Mehta" },
    { id: 2, name: "Ishita Reddy", admNo: "2024002", class: "8", section: "A", parent: "Mrs. Lakshmi Reddy" },
    { id: 3, name: "Rohan Desai", admNo: "2024003", class: "10", section: "B", parent: "Mr. Amit Desai" },
    { id: 4, name: "Priya Joshi", admNo: "2024004", class: "7", section: "C", parent: "Mrs. Sunita Joshi" },
    { id: 5, name: "Arjun Kapoor", admNo: "2024005", class: "9", section: "A", parent: "Mr. Raj Kapoor" },
    { id: 6, name: "Sneha Verma", admNo: "2024006", class: "6", section: "B", parent: "Mr. Vikram Verma" },
    { id: 7, name: "Karan Shah", admNo: "2024007", class: "10", section: "A", parent: "Mrs. Meena Shah" },
    { id: 8, name: "Ananya Iyer", admNo: "2024008", class: "5", section: "A", parent: "Mr. Ramesh Iyer" },
];

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
    const [students, setStudents] = useState<Student[]>(initialStudents);

    const enrollStudent = (newStudent: Omit<Student, "id">) => {
        const studentWithId = {
            ...newStudent,
            id: Math.max(0, ...students.map(s => s.id)) + 1,
        };
        setStudents((prev) => [studentWithId, ...prev]);
    };

    return (
        <StudentContext.Provider value={{ students, enrollStudent }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudents = () => {
    const context = useContext(StudentContext);
    if (context === undefined) {
        throw new Error("useStudents must be used within a StudentProvider");
    }
    return context;
};
