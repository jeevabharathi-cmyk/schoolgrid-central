import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Send, Smartphone } from "lucide-react";

const NotificationsPage = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
      <p className="text-sm text-muted-foreground">Configure how and when notifications are sent</p>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Clock className="h-4 w-4 text-primary" /> Daily Summary</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Summary Time</Label><Input type="time" defaultValue="18:00" /></div>
          <p className="text-xs text-muted-foreground">Parents receive a daily homework summary at this time.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-4 w-4 text-primary" /> SMS Fallback</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Enable SMS</p><p className="text-xs text-muted-foreground">Send SMS when push fails (₹0.50/SMS)</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" /> Quiet Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Enable Quiet Hours</p><p className="text-xs text-muted-foreground">No notifications during this window</p></div>
            <Switch />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1"><Label className="text-xs">Start</Label><Input type="time" defaultValue="22:00" /></div>
            <div className="flex-1 space-y-1"><Label className="text-xs">End</Label><Input type="time" defaultValue="07:00" /></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Send className="h-4 w-4 text-primary" /> Test</CardTitle></CardHeader>
        <CardContent><Button variant="outline">Send Test Notification</Button></CardContent>
      </Card>
    </div>
  </motion.div>
);

export default NotificationsPage;
