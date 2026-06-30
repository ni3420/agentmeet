"use client";

import { Loader2, Bot, Terminal, ShieldAlert, Cpu } from "lucide-react";
import { useGetAllAgents } from "@/features/agents/api/use-get-all-agents";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AgentsList() {
  const { data: agents, isLoading, isError } = useGetAllAgents();
  console.log(agents)

  if (isLoading) {
    return (
      <div className="h-48 w-full flex flex-col items-center justify-center bg-card border border-border rounded-2xl gap-y-2 select-none">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-xs font-semibold text-muted-foreground tracking-tight animate-pulse">
          Streaming active cluster nodes...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-48 w-full flex flex-col items-center justify-center bg-destructive/5 border border-destructive/15 rounded-2xl p-4 text-center select-none">
        <ShieldAlert className="h-5 w-5 text-destructive mb-1.5" />
        <h3 className="text-xs font-bold text-destructive tracking-tight">Data Stream Desynchronization</h3>
        <p className="text-[11px] text-destructive/80 max-w-xs mt-0.5">
          Failed to accurately establish dynamic connections with agent runtime parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-xs select-none">
      <Table>
        <TableHeader className="bg-muted/40 border-b border-border/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px] text-xs font-bold text-foreground h-11 px-4">Agent Identifier</TableHead>
            <TableHead className="text-xs font-bold text-foreground h-11 px-4">System Instructions</TableHead>
            <TableHead className="w-[120px] text-xs font-bold text-foreground h-11 px-4 text-right">Status State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!agents?.data || agents.data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-y-1.5">
                  <Cpu className="h-5 w-5 text-muted-foreground/60 stroke-[1.8]" />
                  <div className="text-xs font-bold text-foreground tracking-tight">No Cluster Deployments</div>
                  <p className="text-[11px] text-muted-foreground/80 max-w-xs leading-normal">
                    No autonomous configurations assigned to this tenant framework layout.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            agents?.data.map((agent) => (
              <TableRow 
                key={agent.id} 
                className="border-b border-border/40 hover:bg-muted/20 transition-colors duration-150"
              >
                <TableCell className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Bot size={14} className="stroke-[2]" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-foreground tracking-tight truncate max-w-[160px]">
                      <Terminal size={11} className="text-muted-foreground/70 shrink-0" />
                      <span>{agent.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-left">
                  <p className="text-xs text-muted-foreground/90 font-medium line-clamp-2 max-w-xl leading-relaxed">
                    {agent.instructions}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  {/* <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight border capitalize select-none bg-muted/60 text-foreground border-border/80">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      agent.status === "active" && "bg-emerald-500 animate-pulse",
                      agent.status === "idle" && "bg-amber-500",
                      agent.status === "failed" && "bg-destructive"
                    )} />
                    {agent.status}
                  </span> */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}