import {z} from "zod"

export const createMeetingSchema = z.object({
  name: z.string().min(1, "Meeting name is required"),
  agentId: z.string().min(1, "Associated Agent ID is required"),
  instructions: z.string().min(1, "Instructions parameter context required"),
});

export const updateMeetingSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["upcoming", "active", "complete"]).optional(),
  startedAt: z.string().datetime().nullable().optional(),
  endedAt: z.string().datetime().nullable().optional(),
  transcriptUrl: z.string().url().nullable().optional(),
  recordingUrl: z.string().url().nullable().optional(),
  summary: z.string().nullable().optional(),
  instructions: z.string().optional(),
});


export const formSchema = z.object({
  name: z.string().min(1, "Meeting title is required"),
  agentId: z.string().min(1, "Please select an evaluation agent"),
});
