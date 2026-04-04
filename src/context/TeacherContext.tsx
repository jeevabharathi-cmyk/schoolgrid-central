import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type Teacher = {
  id: string;
  teacher_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  subjects: string[];
  classes: string[];
  status: "active" | "inactive";
  department: string | null;
  address: string | null;
  joining_date: string | null;
  school_id: string | null;
  classId?: string;
  sectionId?: string;
};

// Shape coming from the "Add Teacher" form
export type NewTeacher = {
  name: string;
  teacher_id?: string;
  phone: string;
  email: string;
  subjects: string[];
  classes: string[];
  status: "active" | "inactive";
  address?: string;
  joiningDate?: string;
  classId?: string;
  sectionId?: string;
};

interface TeacherContextType {
  teachers: Teacher[];
  loading: boolean;
  addTeacher: (teacher: NewTeacher) => Promise<{ error: string | null; data?: Teacher }>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<{ error: string | null }>;
  deleteTeacher: (id: string) => Promise<{ error: string | null }>;
  importTeachers: (teachersData: any[]) => Promise<{ error: string | null; count: number }>;
  refreshTeachers: () => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching teachers:", error.message);
      setTeachers([]);
    } else {
      setTeachers(
        (data || []).map((t: any) => ({
          id: t.id,
          teacher_id: t.teacher_id,
          full_name: t.full_name,
          phone: t.phone || "",
          email: t.email || "",
          subjects: t.subjects || [],
          classes: t.classes || [],
          status: t.status || "active",
          department: t.department,
          address: t.address,
          joining_date: t.joining_date,
          school_id: t.school_id,
          classId: t.class_id,
          sectionId: t.section_id,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) return;

    fetchTeachers();

    const channel = supabase
      .channel('public:teachers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teachers'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const t = payload.new;
            setTeachers((prev) => {
              if (prev.some(item => item.id === t.id)) return prev;
              return [{
                id: t.id,
                teacher_id: t.teacher_id,
                full_name: t.full_name,
                phone: t.phone || "",
                email: t.email || "",
                subjects: t.subjects || [],
                classes: t.classes || [],
                status: t.status || "active",
                department: t.department,
                address: t.address,
                joining_date: t.joining_date,
                school_id: t.school_id,
                classId: t.class_id,
                sectionId: t.section_id,
              }, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const t = payload.new as any;
            setTeachers((prev) =>
              prev.map((item) => (item.id === t.id ? { ...item, ...t } : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setTeachers((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchTeachers]);

  const addTeacher = async (newTeacher: NewTeacher): Promise<{ error: string | null; data?: Teacher }> => {
    // Get the admin user's school_id
    const schoolId = session?.user?.user_metadata?.school_id || null;

    // Generate next Teacher ID (TECH-XXXX)
    let nextTeacherId = "TECH-0001";
    const { data: lastTeacher } = await supabase
      .from("teachers")
      .select("teacher_id")
      .not("teacher_id", "is", null)
      .order("teacher_id", { ascending: false })
      .limit(1);

    if (lastTeacher && lastTeacher.length > 0 && lastTeacher[0].teacher_id) {
      const lastIdMatch = lastTeacher[0].teacher_id.match(/TECH-(\d+)/);
      if (lastIdMatch) {
        const nextNum = parseInt(lastIdMatch[1]) + 1;
        nextTeacherId = `TECH-${nextNum.toString().padStart(4, "0")}`;
      }
    }

    const { data, error } = await supabase
      .from("teachers")
      .insert({
        teacher_id: nextTeacherId,
        full_name: newTeacher.name,
        phone: newTeacher.phone,
        email: newTeacher.email || null,
        subjects: newTeacher.subjects,
        classes: newTeacher.classes,
        status: newTeacher.status || "active",
        address: newTeacher.address || null,
        joining_date: newTeacher.joiningDate || null,
        school_id: schoolId,
        class_id: newTeacher.classId || null,
        section_id: newTeacher.sectionId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding teacher:", error);
      return { error: error.message };
    }

    // Add to local state immediately
    let createdTeacher: Teacher | undefined;
    if (data) {
      createdTeacher = {
        id: data.id,
        teacher_id: data.teacher_id,
        full_name: data.full_name,
        phone: data.phone || "",
        email: data.email || "",
        subjects: data.subjects || [],
        classes: data.classes || [],
        status: data.status || "active",
        department: data.department,
        address: data.address,
        joining_date: data.joining_date,
        school_id: data.school_id,
        classId: data.class_id,
        sectionId: data.section_id,
      };
      setTeachers((prev) => [createdTeacher!, ...prev]);
    }

    return { error: null, data: createdTeacher };
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from("teachers")
      .update({
        full_name: updates.full_name,
        phone: updates.phone,
        email: updates.email,
        subjects: updates.subjects,
        classes: updates.classes,
        status: updates.status,
        department: updates.department,
        address: updates.address,
        joining_date: updates.joining_date,
        class_id: updates.classId,
        section_id: updates.sectionId,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating teacher:", error);
      return { error: error.message };
    }

    if (data) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    }
    return { error: null };
  };

  const deleteTeacher = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting teacher:", error);
      return { error: error.message };
    }
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    return { error: null };
  };

  const importTeachers = async (teachersData: any[]): Promise<{ error: string | null; count: number }> => {
    const schoolId = session?.user?.user_metadata?.school_id || null;
    
    // Generate sequential IDs for bulk import
    let startingNum = 1;
    const { data: lastTeacher } = await supabase
      .from("teachers")
      .select("teacher_id")
      .not("teacher_id", "is", null)
      .order("teacher_id", { ascending: false })
      .limit(1);

    if (lastTeacher && lastTeacher.length > 0 && lastTeacher[0].teacher_id) {
      const lastIdMatch = lastTeacher[0].teacher_id.match(/TECH-(\d+)/);
      if (lastIdMatch) {
        startingNum = parseInt(lastIdMatch[1]) + 1;
      }
    }

    const teachersToInsert = teachersData.map((t, index) => ({
      teacher_id: `TECH-${(startingNum + index).toString().padStart(4, "0")}`,
      full_name: t.full_name || t.name,
      phone: t.phone || null,
      email: t.email || null,
      subjects: typeof t.subjects === "string" ? t.subjects.split(",").map((s: string) => s.trim()) : (Array.isArray(t.subjects) ? t.subjects : []),
      classes: typeof t.classes === "string" ? t.classes.split(",").map((c: string) => c.trim()) : (Array.isArray(t.classes) ? t.classes : []),
      status: t.status || "active",
      address: t.address || null,
      joining_date: t.joining_date || null,
      school_id: schoolId
    }));

    const { data, error } = await supabase
      .from("teachers")
      .insert(teachersToInsert)
      .select();

    if (error) {
      console.error("Error importing teachers:", error);
      return { error: error.message, count: 0 };
    }

    if (data) {
      fetchTeachers();
      return { error: null, count: data.length };
    }

    return { error: null, count: 0 };
  };

  return (
    <TeacherContext.Provider value={{ teachers, loading, addTeacher, updateTeacher, deleteTeacher, importTeachers, refreshTeachers: fetchTeachers }}>
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
