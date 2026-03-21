-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE priority_level AS ENUM ('normal', 'emergency');
CREATE TYPE attachment_parent AS ENUM ('homework', 'announcement', 'doubt');
CREATE TYPE notification_type AS ENUM ('homework', 'announcement', 'doubt_reply', 'daily_summary');

-- Schools
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    academic_year TEXT,
    daily_summary_time TIME DEFAULT '18:00',
    sms_fallback_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT,
    avatar_url TEXT,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "order" INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sections
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    department TEXT,
    status teacher_status,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    admission_no TEXT NOT NULL,
    name TEXT NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Parents
CREATE TABLE parents (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    father_name TEXT,
    mother_name TEXT,
    primary_guardian TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Student Parents
CREATE TABLE student_parents (
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    parent_name TEXT,
    primary_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (student_id, parent_id)
);

-- Teacher Assignments
CREATE TABLE teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (teacher_id, class_id, section_id, subject_id, academic_year)
);

-- Homework
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    priority priority_level,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority priority_level,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_type attachment_parent,
    parent_id UUID NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INT,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Acknowledgments
CREATE TABLE acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (homework_id, parent_id, student_id)
);

-- Doubts
CREATE TABLE doubts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Doubt Replies
CREATE TABLE doubt_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doubt_id UUID REFERENCES doubts(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Parent Notification Preferences
CREATE TABLE parent_notification_preferences (
    parent_id UUID PRIMARY KEY REFERENCES parents(id) ON DELETE CASCADE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    sms_backup BOOLEAN DEFAULT false,
    emergency_only BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    body TEXT,
    type notification_type,
    reference_id UUID,
    sent_at TIMESTAMPTZ DEFAULT now(),
    delivered BOOLEAN
);

-- OTP Codes
CREATE TABLE otp_codes (
    phone TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT false
);

-- Daily Summary Log
CREATE TABLE daily_summary_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    summary_data JSONB,
    sent_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles in school"
  ON profiles FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid() AND p.role = 'admin' AND p.school_id = profiles.school_id
    )
  );

CREATE POLICY "Parents read homework for children"
  ON homework FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN students s ON sp.student_id = s.id
      WHERE sp.parent_id = auth.uid()
        AND s.class_id = homework.class_id
        AND s.section_id = homework.section_id
    )
  );
