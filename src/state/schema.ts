import { z } from "zod";

export const stateSchema = z.object({
  userInput: z.string().optional(),
  emailContent: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
  task: z.string().optional(),
  hydratedEmail: z.string().optional(),
});