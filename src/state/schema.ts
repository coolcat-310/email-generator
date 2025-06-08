import { z } from "zod";

export const stateSchema = z.object({
  userInput: z.string().optional(),
  emailContent: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
});