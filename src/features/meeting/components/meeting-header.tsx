"use client";

import { Search, SlidersHorizontal, Plus} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {agentSchema} from "@/features/agents/schema/schema"
import z from "zod";
import { useGetAllAgents } from "@/features/agents/api/use-get-all-agents";
import MeetingDialogBox from "./meeting-dialog.box";

type AgentDataType=z.infer<typeof agentSchema >

interface MeetingHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  agentFilter: string;
  onAgentChange: (value: string) => void;
}

export default function MeetingHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  agentFilter,
  onAgentChange,
}: MeetingHeaderProps) {
  const { data: agentsData, isLoading: isLoadingAgents } = useGetAllAgents()
  return (
    <div className="w-full space-y-4 border-b border-border pb-5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            My Assessment Rooms
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit, pipeline, and filter active real-time media rooms.
          </p>
        </div>
            <MeetingDialogBox/>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
          <Input
            placeholder="Search meetings by workspace name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs bg-background/40 border-border focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-x-1.5 text-xs font-medium text-muted-foreground mr-1">
            <SlidersHorizontal className="size-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background/40 text-xs shadow-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Live Now</option>
            <option value="complete">Completed</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => onAgentChange(e.target.value)}
            disabled={isLoadingAgents}
            className="h-9 px-3 rounded-md border border-input bg-background/40 text-xs shadow-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer outline-hidden disabled:opacity-50 max-w-[160px]"
          >
            <option value="all">All AI Agents</option>
            {agentsData?.data?.map((agent: AgentDataType) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>

          {(search || statusFilter !== "all" || agentFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange("");
                onStatusChange("all");
                onAgentChange("all");
              }}
              className="h-9 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}