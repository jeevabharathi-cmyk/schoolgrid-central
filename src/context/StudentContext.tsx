import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type Student = {
  id: string;
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

// Shape from the "Add Student" form
export type NewStudent = {
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
  loading: boolean;
  enrollStudent: (student: NewStudent) => Promise<{ error: string | null }>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<{ error: string | null }>;
  deleteStudent: (id: string) => Promise<{ error: string | null }>;
  assignParent: (studentId: string, parentId: string) => Promise<{ error: string | null }>;
  refreshStudents: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching students:", error.message);
      setStudents([]);
    } else {
      setStudents(
        (data || []).map((s: any) => ({
          id: s.id,
          name: s.name || "",
          admNo: s.admission_no || "",
          class: s.class_name || "",
          section: s.section || "",
          parent: s.parent_name || "",
          email: s.parent_email || "",
          phone: s.parent_phone || "",
          dob: s.dob || "",
          address: s.address || "",
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      fetchStudents();
    }
  }, [session, fetchStudents]);

  const enrollStudent = async (newStudent: NewStudent): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from("students")
      .insert({
        name: newStudent.name,
        admission_no: newStudent.admNo || `ADM${Date.now().toString().slice(-6)}`,
        class_name: newStudent.class,
        section: newStudent.section,
        parent_name: newStudent.parent,
        parent_phone: newStudent.phone || null,
        parent_email: newStudent.email || null,
        dob: newStudent.dob || null,
        address: newStudent.address || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error enrolling student:", error);
      return { error: error.message };
    }

    if (data) {
      setStudents((prev) => [
        {
          id: data.id,
          name: data.name || "",
          admNo: data.admission_no || "",
          class: data.class_name || "",
          section: data.section || "",
          parent: data.parent_name || "",
          email: data.parent_email || "",
          phone: data.parent_phone || "",
          dob: data.dob || "",
          address: data.address || "",
        },
        ...prev,
      ]);
    }

    return { error: null };
  };

  const updateStudent = async (id: string, updates: Partial<Student>): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from("students")
      .update({
        name: updates.name,
        admission_no: updates.admNo,
        class_name: updates.class,
        section: updates.section,
        parent_name: updates.parent,
        parent_phone: updates.phone,
        parent_email: updates.email,
        dob: updates.dob,
        address: updates.address,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating student:", error);
      return { error: error.message };
    }

    if (data) {
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? {
          ...s,
          name: data.name || "",
          admNo: data.admission_no || "",
          class: data.class_name || "",
          section: data.section || "",
          parent: data.parent_name || "",
          email: data.parent_email || "",
          phone: data.parent_phone || "",
          dob: data.dob || "",
          address: data.address || "",
        } : s))
      );
    }
    return { error: null };
  };

  const deleteStudent = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      console.error("Error deleting student:", error);
      return { error: error.message };
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
    return { error: null };
  };

  const assignParent = async (studentId: string, parentId: string): Promise<{ error: string | null }> => {
    // Check if link already exists
    const { data: existing } = await supabase
      .from("student_parents")
      .select("*")
      .eq("student_id", studentId)
      .eq("parent_id", parentId)
      .single();

    if (existing) {
      return { error: "Parent already assigned to this student" };
    }

    const { error } = await supabase
      .from("student_parents")
      .insert({ student_id: studentId, parent_id: parentId });

    if (error) {
      console.error("Error linking parent:", error);
      return { error: error.message };
    }

    return { error: null };
  };

  return (
    <StudentContext.Provider value={{
      students,
      loading,
      enrollStudent,
      updateStudent,
      deleteStudent,
      assignParent,
      refreshStudents: fetchStudents
    }}>
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
