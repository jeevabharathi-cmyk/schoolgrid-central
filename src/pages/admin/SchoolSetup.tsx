import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SchoolSetup = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">School Setup</h1>
      <p className="text-sm text-muted-foreground">Configure your school profile and branding</p>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">School Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>School Name</Label><Input defaultValue="Delhi Public School" /></div>
          <div className="space-y-2"><Label>Address</Label><Input defaultValue="Sector 24, Gurugram, Haryana" /></div>
          <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue="admin@dps.edu" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 124 456 7890" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>School Logo</Label>
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
              Click to upload logo
            </div>
          </div>
          <div className="space-y-2">
            <Label>Primary Colour</Label>
            <div className="flex items-center gap-2">
              <input type="color" defaultValue="#2563EB" className="h-9 w-9 cursor-pointer rounded border-0" />
              <Input defaultValue="#2563EB" className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <Button>Save Changes</Button>
  </motion.div>
);

export default SchoolSetup;
