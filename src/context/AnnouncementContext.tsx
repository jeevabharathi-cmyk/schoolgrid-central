import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "emergency";
  class_id?: string;
  author_id?: string;
  created_at: string;
};

interface AnnouncementContextType {
  announcements: Announcement[];
  loading: boolean;
  postAnnouncement: (announcement: Partial<Announcement>) => Promise<{ data: Announcement | null; error: string | null }>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<{ data: Announcement | null; error: string | null }>;
  deleteAnnouncement: (id: string) => Promise<{ success: boolean; error: string | null }>;
  refreshAnnouncements: () => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider = ({ children }: { children: ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, user } = useAuth();

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) return;

    fetchAnnouncements();

    const channel = supabase
      .channel('public:announcements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchAnnouncements]);

  const postAnnouncement = async (announcement: Partial<Announcement>): Promise<{ data: Announcement | null; error: string | null }> => {
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        ...announcement,
        author_id: user?.id, // Use logged in admin's ID
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    setAnnouncements((prev) => [data, ...prev]);
    return { data, error: null };
  };

  const updateAnnouncement = async (id: string, announcement: Partial<Announcement>): Promise<{ data: Announcement | null; error: string | null }> => {
    const { data, error } = await supabase
      .from("announcements")
      .update(announcement)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    setAnnouncements((prev) => prev.map((ann) => (ann.id === id ? data : ann)));
    return { data, error: null };
  };

  const deleteAnnouncement = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    return { success: true, error: null };
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        loading,
        postAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        refreshAnnouncements: fetchAnnouncements,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error("useAnnouncements must be used within an AnnouncementProvider");
  }
  return context;
};
