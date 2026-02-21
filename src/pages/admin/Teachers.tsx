import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Mail, Phone, Edit, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const teachersData = [
  { id: 1, name: "Mrs. Anita Sharma", phone: "+91 98765 43210", email: "anita.sharma@school.edu", subjects: ["Mathematics"], classes: ["8A", "9B"], status: "active" },
  { id: 2, name: "Mr. Rajesh Patel", phone: "+91 98765 43211", email: "rajesh.patel@school.edu", subjects: ["Science"], classes: ["10A", "10B"], status: "active" },
  { id: 3, name: "Mrs. Priya Kumar", phone: "+91 98765 43212", email: "priya.kumar@school.edu", subjects: ["English"], classes: ["7A", "7B", "7C"], status: "active" },
  { id: 4, name: "Mr. Suresh Gupta", phone: "+91 98765 43213", email: "suresh.gupta@school.edu", subjects: ["Hindi"], classes: ["6A", "6B"], status: "inactive" },
  { id: 5, name: "Mrs. Deepa Nair", phone: "+91 98765 43214", email: "deepa.nair@school.edu", subjects: ["Social Science"], classes: ["8B", "9A"], status: "active" },
  { id: 6, name: "Mr. Vikram Singh", phone: "+91 98765 43215", email: "vikram.singh@school.edu", subjects: ["Physical Education"], classes: ["All"], status: "active" },
];

const TeachersPage = () => {
  const [search, setSearch] = useState("");
  const filtered = teachersData.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground">{teachersData.length} teachers registered</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import CSV</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Teacher</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Teacher</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
                <div className="space-y-2"><Label>Email</Label><Input placeholder="teacher@school.edu" /></div>
              </div>
              <DialogFooter><Button>Add Teacher</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teachers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Name</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell">Contact</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:table-cell">Subjects</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground sm:table-cell">Classes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                            {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {teacher.email}</div>
                        <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {teacher.phone}</div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-sm text-muted-foreground">{teacher.classes.join(", ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={teacher.status === "active" ? "default" : "secondary"} className="text-xs">
                        {teacher.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeachersPage;
