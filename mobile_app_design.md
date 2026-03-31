# Mobile Application Design: Teacher & Parent Portal

This document outlines the UI/UX, color palette, workflows, and session details for the SchoolGrid Central mobile application, built for Teachers and Parents.

## 🎨 Design System & Color Palette

The application follows a premium, modern design with a clean interface and vibrant accents.

| Element | HSL / Hex | Description |
| :--- | :--- | :--- |
| **Primary** | `hsl(221, 83%, 53%)` / `#2563EB` | Base action color, buttons, active tabs. |
| **Success** | `hsl(142, 71%, 45%)` / `#22C55E` | Status indicators, completed tasks, profile active pulse. |
| **Warning** | `hsl(38, 92%, 50%)` / `#F59E0B` | Notifications, urgent alerts, unread announcements. |
| **Info** | `hsl(199, 89%, 48%)` / `#0EA5E9` | Informational badges, secondary actions. |
| **Background** | `hsl(220, 20%, 97%)` / `#F1F5F9` | Main app background (Soft Light Gray). |
| **Card/Surface** | `hsl(0, 0%, 100%)` / `#FFFFFF` | Content containers, navigation bars. |
| **Sidebar/Deep** | `hsl(222, 47%, 11%)` / `#0F172A` | Navigation backgrounds and high-contrast elements. |
| **Accent (Light Blue)** | `hsl(221, 83%, 96%)` / `#EFF6FF` | Background for highlighted items, active state overlays. |

**Typography**: Inter (Modern Sans-serif) - used for its legibility and clean stroke weights.

---

## 👨‍🏫 Teacher Portal

### Pages & Sessions
1. **Home (Dashboard)**
   - **Greeting Session**: Personalized "Good morning, Mrs. Sharma 👋" with avatar and role.
   - **"Your Classes" Session**: Horizontal/Vertical cards showing assigned classes (e.g., Class 8A), subjects (Mathematics), and schedules.
   - **"Recent Posts & Status" Session**: Feed of recent homework/announcements. Each entry shows:
     - Badge (Pending doubts count).
     - Student Status: Viewed (Eye icon) and Acknowledged (CheckCircle icon) timestamps.
2. **History**
   - **Post History Feed**: Scrollable list of past homework and announcements with class name and time ago.
3. **Profile**
   - **User Identity Session**: Large avatar, name, and designation.
   - **Session Info Card**: School name, Academic Year, Last Login (timestamp), and Live Status (Pulse indicator).
   - **Contact Details**: Phone, Email, Classes, and Teacher ID.
   - **Logout Action**: Prominent logout button.

### Key Workflows
- **Post Homework**: FAB (+) -> Title, Description, Due Date, File Picker -> Submit.
- **Resolve Doubts**: Tap "Doubts" badge on a post -> Scrollable doubt list from students -> Type reply -> Notify parent instantly.

---

## 👨‍👩‍👦‍👦 Parent Portal

### Pages & Sessions
1. **Home (Parent Dashboard)**
   - **Child Switcher**: Tab bar to toggle between linked children (e.g., Aarav vs. Ishita).
   - **"Today's Homework" Session**: Detailed cards for each subject.
     - **Status Actions**: "Acknowledge" button (turns to "✓ Done" badge when clicked).
     - **"Ask a Doubt" Workflow**: Opens a direct text input to query the teacher.
   - **Quick Announcement Session**: Highlighted card showing unread news (e.g., "2 unread announcements").
2. **News (Announcements)**
   - **School Feed**: Chronological list of school-wide news (Annual Day, PTM, Sports Day).
3. **History**
   - **Homework Archive**: Filtered historical view of homework assigned to the selected child.
4. **Profile**
   - **Parent Identity Session**: Name and Role (Parent).
   - **Linked Children Session**: Cards for each child with their class and individual avatars.
   - **Account Settings**: School info and logout.

### Key Workflows
- **Homework Acknowledgment**: Reading homework details -> Tapping "Acknowledge" to inform teacher.
- **Submit Doubt**: Click "Ask a Doubt" on a specific homework -> Type question -> View teacher reply inline once answered.

---

## 🛠 Mobile App Sessions (Common)
- **Status Bar**: Mocked system status (Time, Signal, Battery).
- **Navigation Bar**: Bottom-fixed menu with icons (Home, News/History, Profile).
- **Notification Center**: Bell icon in header for real-time alerts.
- **Help Center**: Quick floating support access for platform assistance.
