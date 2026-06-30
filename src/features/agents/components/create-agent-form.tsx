"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Bot, Terminal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateAgents } from "../api/use-create-agents";
import { createAgentSchema } from "../schema/schema";

type CreateAgentValues = z.infer<typeof createAgentSchema>;

export default function CreateAgentForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAgentValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      instructions: "",
    },
  });
  const {mutate}=useCreateAgents()

  const onSubmit = async (data: CreateAgentValues) => {
    try {
      mutate(data)
      toast.success(`Autonomous agent "${data.name}" successfully deployed`);
      reset();
    } catch (error) {
      toast.error("Failed to initialize system runtime parameters");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs select-none">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shrink-0">
          <Bot size={20} className="stroke-[1.8]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-bold text-foreground tracking-tight">Create Autonomous Agent</h2>
          <p className="text-xs text-muted-foreground truncate">Configure system prompts, variables, and models</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-bold text-foreground tracking-tight">
            Agent Name
          </Label>
          <div className="relative flex items-center">
            <Terminal className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none stroke-[2]" />
            <Input
              id="name"
              type="text"
              placeholder="e.g., support-triage-bot"
              disabled={isSubmitting}
              {...register("name")}
              className="h-9.5 pl-9 text-xs font-medium border-border/80 bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-1"
            />
          </div>
          {errors.name && (
            <p className="text-[11px] font-semibold text-destructive tracking-tight animate-in fade-in-50 duration-150">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructions" className="text-xs font-bold text-foreground tracking-tight">
            Instructions
          </Label>
          <Textarea
            id="instructions"
            placeholder="Define your agent's personality, boundary parameters, task rules, response constraints, and operational goals..."
            disabled={isSubmitting}
            {...register("instructions")}
            className="min-h-[140px] text-xs font-medium border-border/80 bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-1 resize-none leading-relaxed"
          />
          {errors.instructions && (
            <p className="text-[11px] font-semibold text-destructive tracking-tight animate-in fade-in-50 duration-150">
              {errors.instructions.message}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9.5 px-4 rounded-xl font-bold text-xs gap-x-2 transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Initializing Runtime Core...
              </>
            ) : (
              <>
                <Sparkles size={13} className="stroke-[2.5]" />
                create Agent 
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}