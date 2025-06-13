import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';

export function createEmailHydrationNode() {
  return {
    id: 'email-hydration',
    description: 'Hydrates the layout template by replacing {{variables}} with state values and saves to file.',
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
        console.log("📩 [email-hydration] Hydrating email template...");

        const layoutPath = path.resolve("src/resources/layout.html");
        const hydratedPath = path.resolve(`src/results/hydrated-layout-${state.brandName}.html`);

        const layoutTemplate = await fs.readFile(layoutPath, "utf8");

        // Build key-value dictionary of all placeholders
        const replacements: Record<string, string> = {
          content: state.emailContent ?? "(no content provided)",
          brandName: state.brandName ?? "",
          emailSignature: state.emailSignature ?? "",
          logo: state.logo ?? "",
          primaryColor: state.primaryColor ?? "#000000",
          secondaryColor: state.secondaryColor ?? "#ffffff",
          textColor: state.textColor ?? "#000000",
          mutedTextColor: state.mutedTextColor ?? "#666666",
          borderColor: state.borderColor ?? "#cccccc",
        };

        let hydratedHtml = layoutTemplate;

        // Generic replace for all placeholders
        for (const [key, value] of Object.entries(replacements)) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          hydratedHtml = hydratedHtml.replace(regex, value);
        }

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
