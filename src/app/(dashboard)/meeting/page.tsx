import MeetingDataTable from "@/features/meeting/components/meeting-data-table";
import { Sparkles } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-neutral-50/30 dark:to-neutral-950/20 antialiased selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-border to-transparent" />
        
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-6 sm:p-8 shadow-xs">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent)] opacity-[0.03] pointer-events-none" />
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3" />
              Production Workspace Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interview Command Core
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deploy, coordinate, and orchestrate automated AI technical review rooms. Monitor transcript logs and infrastructure statuses down to the second.
            </p>
          </div>
        </div>

        <div className="bg-card/40 border border-border rounded-2xl p-4 sm:p-6 backdrop-blur-xs shadow-xs transition-all duration-300 hover:border-border/80">
          <MeetingDataTable />
        </div>

      </div>
    </div>
  );
}