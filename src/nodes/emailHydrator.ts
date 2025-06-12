import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';

export function createEmailHydrationNode() {
  return {
    id: 'email-hydration',
    description: 'Hydrates the layout template by replacing {{content}} with generated task and saves to file.',
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
        console.log("📩 [email-hydration] Hydrating email template...");

        const layoutPath = path.resolve("src/resources/layout.html");
        const hydratedPath = path.resolve("src/results/hydrated-layout.html");

        const layoutTemplate = await fs.readFile(layoutPath, "utf8");
        const content = state.task ?? "(no content provided)";

        // Perform replacements
        let hydratedHtml = layoutTemplate.replace(/{{\s*content\s*}}/g, content);
        hydratedHtml = hydratedHtml.replace(/{{\s*brandName\s*}}/g, state.brandName ?? "");
        hydratedHtml = hydratedHtml.replace(/{{\s*emailSignature\s*}}/g, state.emailSignature ?? "");
        hydratedHtml = hydratedHtml.replace(/{{\s*logo\s*}}/g, state.logo ?? "");


        // Write hydrated file to output location
        await fs.writeFile(hydratedPath, hydratedHtml, "utf8");
        console.log(`✅ [email-hydration] Hydrated HTML saved to: ${hydratedPath}`);

        return {
          ...state,
          hydratedEmail: hydratedHtml,
        };
      }
    ),
    ends: [],
  }
}
