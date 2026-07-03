"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMeeting } from "../api/use-create-meeting";
import { Loader2, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllAgents } from "@/features/agents/api/use-get-all-agents";
import {agentSchema} from "@/features/agents/schema/schema"
import {formSchema} from "../schema/schema"
type AgentsDataType=z.infer<typeof agentSchema>
type FormValues = z.infer<typeof formSchema>;

 type MeetingFormProps={
  close?:()=>void
}

export default function MeetingForm({close}:MeetingFormProps) {
  const { mutate: createMeeting, isPending: isCreating } = useCreateMeeting();

  const { data: agentsData, isLoading: isLoadingAgents } = useGetAllAgents()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      agentId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const selectedAgent = agentsData?.data.find(
  (item) => item.id === values.agentId
);
console.log(selectedAgent)
    const data= {
        name: values.name,
        agentId: values.agentId,
        instructions:selectedAgent?.instructions as string
      }
    createMeeting(
     {json: data},
      {
        onSuccess: () => {
          toast.success("Meeting room context provisioned cleanly");
          close?.()
          reset();
        },
        onError: () => {
          toast.error("Failed to generate infrastructure space pipeline");
        },
      }
    );
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card border border-border rounded-xl shadow-sm select-none">
      <div className="flex items-center gap-x-2 pb-5 border-b border-border mb-5">
        <CalendarPlus className="size-5 text-primary" />
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Schedule Assessment
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Meeting Title
          </label>
          <Input
            placeholder="e.g., Senior Backend System Design"
            disabled={isCreating}
            className="h-9 text-sm bg-background/50"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Assign AI Agent
          </label>
          <select
            disabled={isCreating || isLoadingAgents}
            className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            {...register("agentId")}
          >
            <option value="" className="bg-popover text-muted-foreground">
              {isLoadingAgents ? "Loading pipeline..." : "Select specialized model"}
            </option>
            {agentsData?.data?.map((agent: AgentsDataType) => (
              <option 
                key={agent.id} 
                value={agent.id}
                className="bg-popover text-foreground"
              >
                {agent.name}
              </option>
            ))}
          </select>
          {errors.agentId && (
            <p className="text-[11px] text-destructive font-medium">{errors.agentId.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isCreating}
          className="w-full h-9 mt-2 text-sm font-medium shadow-xs"
        >
          {isCreating && <Loader2 className="mr-2 size-4 animate-spin" />}
          Initialize Environment
        </Button>
      </form>
    </div>
  );
}