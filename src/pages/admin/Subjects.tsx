import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const subjectsData = [
  { id: 1, name: "Mathematics", code: "MATH" },
  { id: 2, name: "Science", code: "SCI" },
  { id: 3, name: "English", code: "ENG" },
  { id: 4, name: "Hindi", code: "HIN" },
  { id: 5, name: "Social Science", code: "SST" },
  { id: 6, name: "Computer Science", code: "CS" },
  { id: 7, name: "Physical Education", code: "PE" },
  { id: 8, name: "Art & Craft", code: "ART" },
];

const SubjectsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = subjectsData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground">{subjectsData.length} subjects configured</p>
        </div>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Subject</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search subjects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((subject) => (
                <tr key={subject.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{subject.name}</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{subject.code}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubjectsPage;
