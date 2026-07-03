import {z} from "zod"


export const createAgentSchema = z.object({
  name: z
    .string()
    .min(2, "Agent name must be at least 2 characters")
    .max(32, "Agent name cannot exceed 32 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Name can only contain letters, numbers, hyphens, and underscores"),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters")
    .max(1000, "Instructions cannot exceed 1000 characters"),
});

export const agentSchema=z.object({
            id: z.string(),
            name: z.string(),
            userId: z.string(),
            instructions: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
})

