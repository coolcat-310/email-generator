import { z } from 'zod';

/**
 * Injects metadata into node execution lifecycle for observability/tracing.
 */
export function withMetadata<T extends z.ZodTypeAny>(
  nodeName: string,
  schema: T,
  fn: (input: z.infer<T>) => Promise<Record<string, any>>
) {
  return async (input: Record<string, any>) => {
    const start = Date.now();
    const validated = schema.safeParse(input);

    if (!validated.success) {
      console.error(`❌ [${nodeName}] Validation failed:`, validated.error.format());
      throw new Error(`Invalid input to ${nodeName}`);
    }

    console.log(`🚀 [${nodeName}] Starting with input:`, validated.data);

    try {
      const output = await fn(validated.data);
      const end = Date.now();
      console.log(`✅ [${nodeName}] Completed in ${end - start}ms`);
      return { ...output, __meta__: { node: nodeName, duration: end - start } };
    } catch (err) {
      console.error(`💥 [${nodeName}] Error:`, err);
      throw err;
    }
  };
}
