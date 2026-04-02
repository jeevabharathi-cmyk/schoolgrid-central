import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type Section = {
  id: string;
  class_id: string;
  name: string;
};

export type ClassItem = {
  id: string;
  name: string;
  order: number;
  sections: Section[];
};

interface ClassContextType {
  classes: ClassItem[];
  loading: boolean;
  addClass: (name: string, order?: number) => Promise<{ data: ClassItem | null; error: string | null }>;
  addSection: (classId: string, name: string) => Promise<{ data: Section | null; error: string | null }>;
  updateSection: (id: string, name: string) => Promise<{ error: string | null }>;
  deleteSection: (id: string) => Promise<{ error: string | null }>;
  deleteClass: (id: string) => Promise<{ error: string | null }>;
  updateClass: (id: string, name: string, order?: number) => Promise<{ error: string | null }>;
  refreshClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    // Fetch classes and sections in parallel or joined
    const { data: classesData, error: classesError } = await supabase
      .from("classes")
      .select("*")
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    const { data: sectionsData, error: sectionsError } = await supabase
      .from("sections")
      .select("*")
      .order("name", { ascending: true });

    if (classesError || sectionsError) {
      console.error("Error fetching classes/sections:", classesError || sectionsError);
    } else {
      const formattedClasses = (classesData || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        order: c.order || 0,
        sections: (sectionsData || []).filter((s: any) => s.class_id === c.id),
      }));
      setClasses(formattedClasses);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) return;

    fetchClasses();

    const classChannel = supabase
      .channel('public:classes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, () => {
        fetchClasses();
      })
      .subscribe();

    const sectionChannel = supabase
      .channel('public:sections')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sections' }, () => {
        fetchClasses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(classChannel);
      supabase.removeChannel(sectionChannel);
    };
  }, [session, fetchClasses]);

  const addClass = async (name: string, order?: number): Promise<{ data: ClassItem | null; error: string | null }> => {
    const { data, error } = await supabase
      .from("classes")
      .insert({ name, order: order || 0 })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    const newClass: ClassItem = { id: data.id, name: data.name, order: data.order || 0, sections: [] };
    setClasses((prev) => [...prev, newClass]);
    return { data: newClass, error: null };
  };

  const addSection = async (classId: string, name: string): Promise<{ data: Section | null; error: string | null }> => {
    const { data, error } = await supabase
      .from("sections")
      .insert({ class_id: classId, name })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    const newSection: Section = { id: data.id, class_id: data.class_id, name: data.name };
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, sections: [...c.sections, newSection] } : c
      )
    );
    return { data: newSection, error: null };
  };

  const updateSection = async (id: string, name: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("sections")
      .update({ name })
      .eq("id", id);

    if (error) return { error: error.message };

    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => (s.id === id ? { ...s, name } : s)),
      }))
    );
    return { error: null };
  };

  const deleteSection = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) return { error: error.message };

    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.filter((s) => s.id !== id),
      }))
    );
    return { error: null };
  };

  const deleteClass = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) return { error: error.message };

    setClasses((prev) => prev.filter((c) => c.id !== id));
    return { error: null };
  };

  const updateClass = async (id: string, name: string, order?: number): Promise<{ error: string | null }> => {
    const updateData: any = { name };
    if (order !== undefined) updateData.order = order;

    const { error } = await supabase
      .from("classes")
      .update(updateData)
      .eq("id", id);

    if (error) return { error: error.message };

    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name, order: order ?? c.order } : c))
    );
    return { error: null };
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        loading,
        addClass,
        addSection,
        updateSection,
        deleteSection,
        deleteClass,
        updateClass,
        refreshClasses: fetchClasses,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error("useClasses must be used within a ClassProvider");
  }
  return context;
};
