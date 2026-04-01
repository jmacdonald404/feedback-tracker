import { Badge } from "@/components/ui/badge";
import { Bug, Lightbulb, Wrench } from "lucide-react";

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  BUG: { label: "Bug", icon: <Bug className="h-3 w-3" />, variant: "destructive" },
  FEATURE: { label: "Feature", icon: <Lightbulb className="h-3 w-3" />, variant: "info" },
  IMPROVEMENT: { label: "Improvement", icon: <Wrench className="h-3 w-3" />, variant: "warning" },
};

export function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] ?? { label: category, icon: null, variant: "secondary" as const };
  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
