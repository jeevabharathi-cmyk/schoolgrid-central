# Flutter Implementation Guide: SchoolGrid Central Mobile App

A technical roadmap for building the cross-platform mobile application (iOS, Android, Windows) using Flutter, matching the exact UI/UX and workflows defined in `mobile_app_design.md`.

## 🏗 Project Architecture
- **State Management**: `Provider` or `Riverpod` for reactive UI updates across portals.
- **Routing**: `go_router` for deep linking and seamless navigation between portals.
- **Backend Integration**: RESTful API calls matching the existing React application's logic.
- **Storage**: `flutter_secure_storage` for local sessions and tokens.

---

## 🎨 Theme Configuration

```dart
// main.dart - Theme Data
ThemeData schoolGridTheme = ThemeData(
  primaryColor: Color(0xFF2563EB), // hsl(221, 83%, 53%)
  scaffoldBackgroundColor: Color(0xFFF1F5F9), // hsl(220, 20%, 97%)
  fontFamily: 'Inter',
  colorScheme: ColorScheme.light(
    primary: Color(0xFF2563EB),
    secondary: Color(0xFFEFF6FF), // hsl(221, 83%, 96%)
    surface: Colors.white,
    error: Color(0xFFDC2626), // hsl(0, 84%, 60%)
    success: Color(0xFF22C55E), // hsl(142, 71%, 45%)
  ),
  cardTheme: CardTheme(
    elevation: 2,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    color: Colors.white,
  ),
);
```

---

## 📱 Implementation Phase Workflow

### Phase 1: Core Layout & Authentication
- [ ] Initialize Flutter project and add dependencies (`flutter_svg`, `lucide_icons`, `google_fonts`).
- [ ] Implement `LoginScreen` with role selection (Admin, Teacher, Parent).
- [ ] Setup `AuthService` to handle session persistence.

### Phase 2: Teacher Portal Development
- [ ] **Home View**: Implement `ClassCard` component and `HomeworkStatusList`.
- [ ] **Post Homework**: Create `PostHomeworkModal` with fields for title, description, and file attachment using `file_picker`.
- [ ] **Doubt Resolution**: Implement `DoubtReplyDialog` with reactive updates from the doubt stream.

### Phase 3: Parent Portal Development
- [ ] **Home View**: Implement `ChildSwitcher` tab bar.
- [ ] **Homework Interaction**: Create `HomeworkCard` with "Acknowledge" functionality and inline "Ask a Doubt" action.
- [ ] **Announcements**: Build the `NewsList` with card-based layouts.

### Phase 4: Shared Components & Polishing
- [ ] **Profile View**: Design shared session information cards and status pulse indicators.
- [ ] **Help Center**: Implement a floating action overlay for support.
- [ ] **Animations**: Add subtle transitions using `TransitionPage` and `AnimatedSwitcher`.

---

## 🚀 Deployment Strategy
- **Android**: Generate AAB (App Bundle) for Play Store.
- **iOS**: Archive via Xcode for App Store Connect.
- **Windows**: Build `.msix` package for desktop distribution.

---

## 🔒 Security & Performance
- Use `CachedNetworkImage` for avatars and attachments.
- Implement SSL Pinning for secure API communication.
- Optimize widget tree to ensure 60fps scrolling on low-end devices.
