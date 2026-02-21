import { motion } from "framer-motion";
import { Construction } from "lucide-react";

const PlaceholderPage = ({ title }: { title: string }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 rounded-xl bg-secondary p-4">
      <Construction className="h-8 w-8 text-muted-foreground" />
    </div>
    <h1 className="text-xl font-bold text-foreground">{title}</h1>
    <p className="mt-1 text-sm text-muted-foreground">This section is coming soon in Phase 2.</p>
  </motion.div>
);

export const AssignmentsPage = () => <PlaceholderPage title="Teacher Assignments" />;
export const AnalyticsPage = () => <PlaceholderPage title="Analytics Dashboard" />;
export const SettingsPage = () => <PlaceholderPage title="Settings" />;
