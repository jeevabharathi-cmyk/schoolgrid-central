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
  enrollmentDate?: string;
  classId?: string;
  sectionId?: string;
  isLinked?: boolean;
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
  enrollmentDate?: string;
  classId?: string;
  sectionId?: string;
};

interface StudentContextType {
  students: Student[];
  loading: boolean;
  enrollStudent: (student: NewStudent) => Promise<{ error: string | null }>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<{ error: string | null }>;
  deleteStudent: (id: string) => Promise<{ error: string | null }>;
  assignParent: (studentId: string, parentId: string) => Promise<{ error: string | null }>;
  unassignParent: (studentId: string, parentId: string) => Promise<{ error: string | null }>;
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
      .select("*, student_parents(parent_id)")
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
          enrollmentDate: s.enrollment_date || (s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : ""),
          classId: s.class_id || "",
          sectionId: s.section_id || "",
          isLinked: s.student_parents && s.student_parents.length > 0,
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
                enrollmentDate: s.enrollment_date || (s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : ""),
                classId: s.class_id || "",
                sectionId: s.section_id || "",
                isLinked: false, // New students are never linked immediately
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
                enrollmentDate: s.enrollment_date || (s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : ""),
                classId: s.class_id || "",
                sectionId: s.section_id || "",
                // Keep the current link status on generic updates unless we implement 
                // link sensing in real-time
                isLinked: item.isLinked, 
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
        class_id: newStudent.classId || null,
        section_id: newStudent.sectionId || null,
        // enrollment_date: newStudent.enrollmentDate || null, // Temporarily disabled while column is missing
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
          enrollmentDate: data.enrollment_date || (data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ""),
          classId: data.class_id || "",
          sectionId: data.section_id || "",
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
        class_id: updates.classId,
        section_id: updates.sectionId,
        // enrollment_date: updates.enrollmentDate, // Temporarily disabled while column is missing
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
          enrollmentDate: data.enrollment_date || (data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ""),
          classId: data.class_id || "",
          sectionId: data.section_id || "",
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
    // 0. Check if student already has a parent (Enforce one parent rule)
    const { data: existingAnyLink, error: checkError } = await supabase
      .from("student_parents")
      .select("parent_id")
      .eq("student_id", studentId)
      .maybeSingle();

    if (existingAnyLink) {
      return { error: "This student is already assigned to a parent. Unassign them first to link to a different parent." };
    }

    // 1. Fetch parent profile first (to get details and verify it's a valid parent)
    const { data: parentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", parentId)
      .single();

    if (profileError || !parentProfile) {
      return { error: "Parent profile not found" };
    }

    // 2. Try to link directly first (if the parent record already exists in the 'parents' table)
    const { data: existingLink } = await supabase
      .from("student_parents")
      .select("*")
      .eq("student_id", studentId)
      .eq("parent_id", parentId)
      .maybeSingle();

    if (existingLink) {
      return { error: "Parent already assigned to this student" };
    }

    const { error: directLinkError } = await supabase
      .from("student_parents")
      .insert({ student_id: studentId, parent_id: parentId });

    if (directLinkError) {
      // If it failed because the parent record doesn't exist in the 'parents' table (FK violation)
      // we try to initialize it.
      if (directLinkError.code === '23503') {
        const { error: createParentError } = await supabase
          .from("parents")
          .insert({
            id: parentId,
            father_name: parentProfile.full_name
          });

        if (createParentError) {
          console.error("Error creating parent record:", createParentError);
          return { error: `Database RLS Error: Could not initialize parent record. Please run the SQL fix in the Implementation Plan. (${createParentError.message})` };
        }

        // Retry the link after initialization
        const { error: retryLinkError } = await supabase
          .from("student_parents")
          .insert({ student_id: studentId, parent_id: parentId });

        if (retryLinkError) {
          return { error: `Failed to link after initialization: ${retryLinkError.message}` };
        }
      } else {
        return { error: `Linking failed: ${directLinkError.message}` };
      }
    }

    // 3. Sync parent info back to students table for mobile app consistency
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
      phone: parentProfile.phone,
      isLinked: true
    } : s));

    return { error: null };
  };

  const unassignParent = async (studentId: string, parentId: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("student_parents")
      .delete()
      .eq("student_id", studentId)
      .eq("parent_id", parentId);

    if (error) {
      console.error("Error unassigning parent:", error);
      return { error: error.message };
    }

    // Update local state isLinked status
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, isLinked: false, parent: "", email: "", phone: "" } : s))
    );

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
      // enrollment_date: s.enrollmentDate || s.enrollment_date || null,
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
      unassignParent,
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
