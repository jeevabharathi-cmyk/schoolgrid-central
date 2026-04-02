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
  importStudents: (studentsData: any[]) => Promise<{ error: string | null; count: number }>;
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
    if (!session) return;

    fetchStudents();

    const channel = supabase
      .channel('public:students')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const s = payload.new;
            setStudents((prev) => {
              if (prev.some(item => item.id === s.id)) return prev;
              return [{
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
              }, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const s = payload.new as any;
            setStudents((prev) =>
              prev.map((item) => (item.id === s.id ? {
                ...item,
                name: s.name || "",
                admNo: s.admission_no || "",
                class: s.class_name || "",
                section: s.section || "",
                parent: s.parent_name || "",
                email: s.parent_email || "",
                phone: s.parent_phone || "",
                dob: s.dob || "",
                address: s.address || "",
              } : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setStudents((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    // 1. Fetch parent profile first (to get details and verify it's a valid parent)
    const { data: parentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", parentId)
      .single();

    if (profileError || !parentProfile) {
      return { error: "Parent profile not found" };
    }

    // 2. Ensure record exists in the 'parents' table (required for foreign key)
    const { data: parentRecord } = await supabase
      .from("parents")
      .select("id")
      .eq("id", parentId)
      .single();

    if (!parentRecord) {
      // Create empty parent record if missing
      const { error: createParentError } = await supabase
        .from("parents")
        .insert({
          id: parentId,
          father_name: parentProfile.full_name // Defaulting full_name to father_name for initial setup
        });

      if (createParentError) {
        console.error("Error creating parent record:", createParentError);
        return { error: `Could not initialize parent record: ${createParentError.message}` };
      }
    }

    // 3. Check if link already exists in student_parents
    const { data: existing } = await supabase
      .from("student_parents")
      .select("*")
      .eq("student_id", studentId)
      .eq("parent_id", parentId)
      .single();

    if (existing) {
      return { error: "Parent already assigned to this student" };
    }

    // 4. Create the link
    const { error: linkError } = await supabase
      .from("student_parents")
      .insert({ student_id: studentId, parent_id: parentId });

    if (linkError) {
      console.error("Error linking parent:", linkError);
      return { error: linkError.message };
    }

    // 5. Sync parent info back to students table for mobile app consistency
    await supabase
      .from("students")
      .update({
        parent_name: parentProfile.full_name,
        parent_email: parentProfile.email,
        parent_phone: parentProfile.phone,
      })
      .eq("id", studentId);
    
    // Update local state
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      parent: parentProfile.full_name,
      email: parentProfile.email,
      phone: parentProfile.phone
    } : s));

    return { error: null };
  };

  const importStudents = async (studentsData: any[]): Promise<{ error: string | null; count: number }> => {
    const studentsToInsert = studentsData.map(s => ({
      name: s.name || s.full_name,
      admission_no: s.admission_no || s.admNo || s.adm_no || `ADM${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      class_name: s.class || s.className || s.class_name,
      section: s.section,
      parent_name: s.parent || s.parent_name || s.parentName,
      parent_phone: s.phone || s.parent_phone || s.parentPhone || null,
      parent_email: s.email || s.parent_email || s.parentEmail || null,
      dob: s.dob || null,
      address: s.address || null,
    }));

    const { data, error } = await supabase
      .from("students")
      .insert(studentsToInsert)
      .select();

    if (error) {
      console.error("Error importing students:", error);
      return { error: error.message, count: 0 };
    }

    if (data) {
      fetchStudents();
      return { error: null, count: data.length };
    }

    return { error: null, count: 0 };
  };

  return (
    <StudentContext.Provider value={{
      students,
      loading,
      enrollStudent,
      updateStudent,
      deleteStudent,
      assignParent,
      importStudents,
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
