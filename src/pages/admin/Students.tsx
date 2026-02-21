import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const studentsData = [
  { id: 1, name: "Aarav Mehta", admNo: "2024001", class: "8", section: "A", parent: "Mr. Sunil Mehta" },
  { id: 2, name: "Ishita Reddy", admNo: "2024002", class: "8", section: "A", parent: "Mrs. Lakshmi Reddy" },
  { id: 3, name: "Rohan Desai", admNo: "2024003", class: "10", section: "B", parent: "Mr. Amit Desai" },
  { id: 4, name: "Priya Joshi", admNo: "2024004", class: "7", section: "C", parent: "Mrs. Sunita Joshi" },
  { id: 5, name: "Arjun Kapoor", admNo: "2024005", class: "9", section: "A", parent: "Mr. Raj Kapoor" },
  { id: 6, name: "Sneha Verma", admNo: "2024006", class: "6", section: "B", parent: "Mr. Vikram Verma" },
  { id: 7, name: "Karan Shah", admNo: "2024007", class: "10", section: "A", parent: "Mrs. Meena Shah" },
  { id: 8, name: "Ananya Iyer", admNo: "2024008", class: "5", section: "A", parent: "Mr. Ramesh Iyer" },
];

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const filtered = studentsData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search);
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">{studentsData.length} students enrolled</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import CSV</Button>
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Student</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or admission no..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {["5", "6", "7", "8", "9", "10"].map((c) => (
              <SelectItem key={c} value={c}>Class {c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Adm. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Class</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground sm:table-cell">Section</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell">Parent</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{student.admNo}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">Class {student.class}</Badge></td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{student.section}</td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{student.parent}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">View</Button>
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

export default StudentsPage;
