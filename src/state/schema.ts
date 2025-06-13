import { z } from 'zod';

export const stateSchema = z.object({
  userInput: z.string().optional(),
  brandName: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
  hydratedEmail: z.string().optional(),
  taskName: z.string().optional(),
  subject: z.string().optional(),
  emailContent: z.string().optional(),
  logo: z.string().optional(),
  emailSignature: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  textColor: z.string().optional(),
  mutedTextColor: z.string().optional(),
  borderColor: z.string().optional(),
});

export const taskSchema = z.object({
  taskName: z.string(),
  subject: z.string(),
  emailContent: z.string(),
});
