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
Convert the following welcome email into professional, production-ready HTML.

- Use brand colors from https://www.endpoint.com/ (e.g., navy blue: #002855, white: #ffffff, light gray: #e5e5e5).
- Use the Endpoint logo from: https://www.endpoint.com/images/logos/endpoint-logo.svg
- Do not include any text before or after the HTML output.
- Ensure the footer includes the current year dynamically (e.g., © 2025 Endpoint).
- Ensure this email renders well on mobile.

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
    ends: [], // final node
  };
}
