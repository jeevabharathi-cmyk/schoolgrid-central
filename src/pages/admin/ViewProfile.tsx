import { motion } from "framer-motion";
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Camera,
    BookOpen, Users, GraduationCap, TrendingUp
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

const stats = [
    { label: "Teachers", value: "48", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Students", value: "1,247", icon: GraduationCap, color: "text-success", bg: "bg-success/10" },
    { label: "Classes", value: "24", icon: BookOpen, color: "text-warning", bg: "bg-warning/10" },
    { label: "Engagement", value: "87%", icon: TrendingUp, color: "text-info", bg: "bg-info/10" },
];

const ViewProfile = () => {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header Banner */}
            <motion.div variants={item}>
                <div className="relative overflow-hidden rounded-xl bg-primary px-6 py-8 text-primary-foreground">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
                    <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white shadow-inner ring-4 ring-white/30">
                                AD
                            </div>
                            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-md hover:shadow-lg transition-shadow">
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">Administrator</h1>
                            <p className="mt-0.5 text-sm text-blue-100">admin@school.edu</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">
                                    <Shield className="h-3 w-3" /> Super Admin
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">
                                    <MapPin className="h-3 w-3" /> Delhi Public School
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label} className="border-border/50 transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className={`rounded-lg p-2.5 ${s.bg} ${s.color}`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                                <p className="text-lg font-bold text-foreground">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <User className="h-4 w-4 text-primary" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Full Name", value: "Admin User", icon: User },
                                { label: "Email Address", value: "admin@school.edu", icon: Mail },
                                { label: "Phone Number", value: "+91 98765 43210", icon: Phone },
                                { label: "Location", value: "New Delhi, India", icon: MapPin },
                                { label: "Joined", value: "April 1, 2022", icon: Calendar },
                            ].map((field) => (
                                <div key={field.label} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <field.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-muted-foreground">{field.label}</p>
                                        <p className="truncate text-sm font-medium text-foreground">{field.value}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Role & Permissions */}
                <motion.div variants={item}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Shield className="h-4 w-4 text-primary" /> Role & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                                <p className="text-xs text-muted-foreground">Current Role</p>
                                <p className="mt-0.5 text-sm font-bold text-primary">Super Administrator</p>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Access Permissions</p>
                            {[
                                "Manage Teachers & Staff",
                                "Manage Students & Enrollment",
                                "Configure School Settings",
                                "View Analytics & Reports",
                                "Send Notifications",
                                "Manage Classes & Subjects",
                            ].map((perm) => (
                                <div key={perm} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                    <span className="text-sm text-foreground">{perm}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ViewProfile;
