"use client";

import { useState } from "react";
import { useGetMeetings } from "../api/use-get-all-meetings";
import { format } from "date-fns";
import { 
  Video, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import MeetingHeader from "./meeting-header";

type GetMeetingsResponse = InferResponseType<typeof client.api.rpc.meeting.$get>;
type MeetingRowType = GetMeetingsResponse extends { data: infer T } ? (T extends Array<infer U> ? U : never) : never;

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    variant: "secondary" as const,
    icon: Calendar,
    className: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 border-transparent",
  },
  active: {
    label: "Live Now",
    variant: "default" as const,
    icon: Clock,
    className: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 animate-pulse border-transparent",
  },
  complete: {
    label: "Completed",
    variant: "outline" as const,
    icon: CheckCircle2,
    className: "bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/20 border-transparent",
  },
};

export default function MeetingDataTable() {
  const { data, isLoading, error } = useGetMeetings();

  // 1. Reactive Filtering States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="border border-border rounded-xl p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full my-1.5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh] gap-2 text-center border border-border border-dashed rounded-xl bg-card/30 p-6">
        <AlertCircle className="size-8 text-destructive" />
        <h3 className="text-sm font-semibold">Failed to stream room metrics</h3>
        <p className="text-xs text-muted-foreground">Error executing data synchronizations over RPC node</p>
      </div>
    );
  }

  const rawMeetings = data?.data || [];

  // 2. In-Memory Search and Filtering Core Evaluation Logic
  const filteredMeetings = rawMeetings.filter((meeting: MeetingRowType) => {
    const matchesSearch = meeting.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    const matchesAgent = agentFilter === "all" || meeting.agentId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <div className="space-y-4 select-none">
      {/* 3. Drop in the header shell with binding triggers attached */}
      <MeetingHeader 
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        agentFilter={agentFilter}
        onAgentChange={setAgentFilter}
      />

      <div className="flex flex-col">
        <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-x-2">
          <Video className="size-4.5 text-primary" />
          Assessment Sessions
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time status tracking profiles for scheduled environments.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 dark:bg-zinc-900/40">
            <TableRow className="border-border">
              <TableHead className="text-xs font-semibold h-10">Session Workspace</TableHead>
              <TableHead className="text-xs font-semibold h-10">Status</TableHead>
              <TableHead className="text-xs font-semibold h-10 hidden sm:table-cell">Created At</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  No active assessment sessions match your specified filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting: MeetingRowType) => {
                const status = (meeting.status || "upcoming") as keyof typeof statusConfig;
                const config = statusConfig[status] || statusConfig.upcoming;
                const StatusIcon = config.icon;

                return (
                  <TableRow key={meeting.id} className="border-border hover:bg-accent/30 transition-colors group">
                    <TableCell className="font-medium max-w-[180px] truncate py-3">
                      <div className="flex flex-col gap-y-0.5">
                        <span className="text-sm font-medium text-foreground truncate">{meeting.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/70">ID: {meeting.id.slice(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={config.variant} className={config.className}>
                        <StatusIcon className="size-3 mr-1 shrink-0" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell py-3">
                      {meeting.createdAt ? format(new Date(meeting.createdAt), "MMM dd, yyyy • hh:mm a") : "—"}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-3">
                      <Button variant="ghost" size="sm" asChild className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground">
                        <Link href={`/interviews/${meeting.id}`} className="gap-x-1">
                          Join Room
                          <ArrowRight className="size-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}