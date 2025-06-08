import { ZodSchema } from 'zod';

export function withValidation<TInput extends object, TOutput extends object>(
  schema: ZodSchema<TInput>,
  run: (input: TInput) => Promise<TOutput>
): (input: unknown) => Promise<TOutput> {
  return async (input: unknown) => {
    const result = schema.safeParse(input);
    if (!result.success) {
      console.error("❌ Input validation failed:", result.error.format());
      throw new Error("Invalid input state for node");
    }
    return run(result.data);
  };
}
