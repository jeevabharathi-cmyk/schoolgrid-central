import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const classesData = [
  { id: 1, name: "Class 5", sections: ["A", "B"] },
  { id: 2, name: "Class 6", sections: ["A", "B"] },
  { id: 3, name: "Class 7", sections: ["A", "B", "C"] },
  { id: 4, name: "Class 8", sections: ["A", "B"] },
  { id: 5, name: "Class 9", sections: ["A", "B"] },
  { id: 6, name: "Class 10", sections: ["A", "B"] },
];

const ClassesPage = () => {
  const [selected, setSelected] = useState<number | null>(1);
  const selectedClass = classesData.find((c) => c.id === selected);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes & Sections</h1>
          <p className="text-sm text-muted-foreground">Manage your school's class structure</p>
        </div>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Class</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-3 pt-0">
            {classesData.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelected(cls.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  selected === cls.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="font-medium">{cls.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={selected === cls.id ? "outline" : "secondary"} className={`text-xs ${selected === cls.id ? "border-primary-foreground/30 text-primary-foreground" : ""}`}>
                    {cls.sections.length} sections
                  </Badge>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">
              {selectedClass ? `${selectedClass.name} — Sections` : "Select a class"}
            </CardTitle>
            {selectedClass && <Button size="sm" variant="outline"><Plus className="mr-1 h-3.5 w-3.5" /> Add Section</Button>}
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedClass.sections.map((section) => (
                  <div key={section} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Section {section}</p>
                      <p className="text-xs text-muted-foreground">{selectedClass.name} — {section}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a class from the left panel to manage its sections.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ClassesPage;
