import { useState } from "react";
import { motion } from "framer-motion";
import {
    Lock, Bell, Palette, Globe, Shield, Save, Eye, EyeOff, SlidersHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
};

const AccountSettings = () => {
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [saved, setSaved] = useState<string | null>(null);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weekly: false,
        login: true,
    });
    const [language, setLanguage] = useState("en");
    const [theme, setTheme] = useState("light");

    const handleSave = (section: string) => {
        setSaved(section);
        setTimeout(() => setSaved(null), 2500);
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Page Header */}
            <motion.div variants={item}>
                <div className="rounded-xl bg-primary px-6 py-5 text-primary-foreground">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                            <SlidersHorizontal className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Account Settings</h1>
                            <p className="text-sm text-blue-100">Manage your password, notifications, and preferences</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Change Password */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Lock className="h-4 w-4 text-primary" /> Change Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Current Password", show: showOldPass, toggle: () => setShowOldPass(!showOldPass) },
                            { label: "New Password", show: showNewPass, toggle: () => setShowNewPass(!showNewPass) },
                            { label: "Confirm New Password", show: showConfirmPass, toggle: () => setShowConfirmPass(!showConfirmPass) },
                        ].map((field) => (
                            <div key={field.label}>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
                                <div className="relative">
                                    <input
                                        type={field.show ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={field.toggle}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between pt-1">
                            {saved === "password" && (
                                <span className="text-xs font-medium text-green-600">✓ Password updated successfully</span>
                            )}
                            {saved !== "password" && <span />}
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                size="sm"
                                onClick={() => handleSave("password")}
                            >
                                <Save className="mr-2 h-3.5 w-3.5" /> Update Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Bell className="h-4 w-4 text-primary" /> Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { key: "email" as const, label: "Email Notifications", desc: "Receive alerts via email" },
                            { key: "push" as const, label: "Push Notifications", desc: "Browser push alerts" },
                            { key: "weekly" as const, label: "Weekly Summary", desc: "Weekly school activity digest" },
                            { key: "login" as const, label: "Login Alerts", desc: "Alert on new sign-in to your account" },
                        ].map((n) => (
                            <div key={n.key} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                                </div>
                                <button
                                    onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                                    className={`relative h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${notifications[n.key] ? "bg-primary" : "bg-secondary border border-border"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[n.key] ? "translate-x-4" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-end pt-1">
                            <Button
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => handleSave("notifications")}
                            >
                                <Save className="mr-2 h-3.5 w-3.5" />
                                {saved === "notifications" ? "Saved ✓" : "Save Preferences"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Language */}
                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Globe className="h-4 w-4 text-primary" /> Language & Region
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Display Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="ta">Tamil</option>
                                    <option value="te">Telugu</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Timezone</label>
                                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                                    <option>UTC</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleSave("language")}>
                                    <Save className="mr-2 h-3.5 w-3.5" />
                                    {saved === "language" ? "Saved ✓" : "Save"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Appearance */}
                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Palette className="h-4 w-4 text-primary" /> Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
                            <div className="grid grid-cols-3 gap-2">
                                {["light", "dark", "system"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`rounded-lg border px-3 py-2.5 text-xs font-medium capitalize transition-colors ${theme === t
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleSave("appearance")}>
                                    <Save className="mr-2 h-3.5 w-3.5" />
                                    {saved === "appearance" ? "Saved ✓" : "Save"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Security */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Shield className="h-4 w-4 text-primary" /> Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                                Enable
                            </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">Active Sessions</p>
                                <p className="text-xs text-muted-foreground">1 active session — Chrome, Windows</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                                Revoke All
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AccountSettings;
