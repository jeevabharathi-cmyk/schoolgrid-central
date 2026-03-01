import React from "react";
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    Circle,
    Bell
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export type UserRole = "SUPER ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export interface ProfileDropdownProps {
    user: {
        name: string;
        email: string;
        role: UserRole;
        avatar: string; // initials
        school: string;
        academicYear: string;
        lastLogin: string;
        status: "Active" | "Inactive";
    };
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-secondary/50 focus:outline-none">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                        <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                            {user.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 text-left hidden sm:flex">
                        <span className="text-sm font-semibold text-foreground">{user.name.split(' ')[0]}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[320px] p-0 overflow-hidden rounded-2xl border-border/40 shadow-2xl">
                {/* Header - Role-Based Color or Blue from Image */}
                <div className="bg-primary px-5 py-6 text-primary-foreground">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary-foreground/20 shadow-lg">
                            <AvatarFallback className="bg-primary-foreground/10 text-xl font-bold text-primary-foreground">
                                {user.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                            <h3 className="text-base font-bold leading-tight">{user.name}</h3>
                            <p className="text-xs text-primary-foreground/80 font-medium">{user.email}</p>
                            <Badge variant="secondary" className="mt-1.5 bg-primary-foreground/10 text-[10px] font-black uppercase text-primary-foreground border-none hover:bg-primary-foreground/20">
                                {user.role}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-4 bg-card">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">School</p>
                            <p className="text-xs font-semibold text-foreground truncate">{user.school}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Academic Year</p>
                            <p className="text-xs font-semibold text-foreground">{user.academicYear}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Last Login</p>
                            <p className="text-xs font-semibold text-foreground">{user.lastLogin}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Status</p>
                            <div className="flex items-center gap-1.5">
                                <Circle className={`h-1.5 w-1.5 fill-current ${user.status === "Active" ? "text-success" : "text-muted-foreground"}`} />
                                <span className={`text-xs font-semibold ${user.status === "Active" ? "text-success" : "text-muted-foreground"}`}>
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenuSeparator className="bg-border/40" />

                    {/* Actions */}
                    <div className="space-y-1 py-1">
                        <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary transition-colors group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">View Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary transition-colors group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10">
                                <Settings className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">Account Settings</span>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-border/40" />

                    <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-destructive/10 text-destructive transition-colors group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive/20">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">Logout</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
