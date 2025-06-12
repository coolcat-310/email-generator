import { z } from "zod";

export const stateSchema = z.object({
  userInput: z.string().optional(),
  brandName: z.string().optional(),
  emailContent: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
  task: z.string().optional(),
  hydratedEmail: z.string().optional(),
  logo: z.string().optional(),
  emailSignature: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});