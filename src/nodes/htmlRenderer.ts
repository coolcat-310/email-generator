import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';

export function createHtmlRendererNode(model: ChatOpenAI) {
  return {
    id: 'html-renderer',
    description: 'Converts approved email content into styled HTML using Endpoint branding and saves it.',
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
        console.log('🎨 [html-renderer] Converting email to HTML...');

        const htmlPrompt = `
Convert the following welcome email into professional, production-ready HTML formatted with **nested tables** for maximum compatibility with Microsoft Outlook and other email clients.

- Use brand colors from https://www.endpoint.com/ (e.g., navy blue: #087EA8, white: #f7f7f7, light gray: #757575).
- Use the Endpoint logo from: https://cdn.prod.website-files.com/629dd25ce5542b0c7b8f8047/62bc58ec1f862550e79fed3d_Endpoint_Logo_Registered_Primary_200.svg
- Use **nested HTML tables** instead of CSS grid/flexbox.
- Do not include any text before or after the HTML output.
- Ensure the footer includes the current year dynamically (e.g., © 2025 Endpoint).
- Ensure the email renders well on mobile devices.

Email:
---
${state.emailContent}
        `;

        const response = await model.invoke([{ role: 'user', content: htmlPrompt }]);

        const htmlOutput = typeof response.content === 'string'
          ? response.content.trim().replace(/^```html|```$/g, '')
          : '';

        const outputDir = path.resolve('src/results');
        const outputPath = path.join(outputDir, 'email.html');

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, htmlOutput, 'utf8');

        console.log('✅ [html-renderer] HTML saved to:', outputPath);

        return {
          ...state,
          html: htmlOutput,
        };
      }
    ),
    ends: [], // final node, it implicitly routes to __end__ after execution
  };
}
