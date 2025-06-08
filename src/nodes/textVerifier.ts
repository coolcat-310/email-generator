import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { loadApprovedEmails } from '../utility/loadApprovedEmails';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';

export function createTextVerifierNode(model: ChatOpenAI) {
  return {
    id: 'text-verifier',
    description: 'Verifies that the email content meets business tone and grammar standards by comparing to approved examples.',
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
      console.log('🕵️ [text-verifier] Reviewing State:', JSON.stringify(state, null, 2));

      const examples = loadApprovedEmails();

      const approvedEmailExamples = examples
        .map((ex) => `Subject: ${ex.subject}\n\n${ex.email}`)
        .join('\n\n---\n\n');

      const verifyPrompt = `
Review the following email for grammar, clarity, and business tone.
First, familiarize yourself with these approved examples to understand the style, tone, and language used:

${approvedEmailExamples}

---
Now review this draft:
${state.emailContent}
---

If the draft meets the standards observed in the approved examples, reply ONLY with "APPROVED".

If the draft does not meet the standard, list specific improvements that should be made. Do NOT rewrite the entire email.
`;

      const response = await model.invoke([{ role: 'user', content: verifyPrompt }]);

      const rawOutput = typeof response.content === 'string' ? response.content.trim() : '';

      const isApproved = rawOutput.toUpperCase().includes('APPROVED');

      if (isApproved) {
        console.log('✅ [text-verifier] Approved email content.');
        console.log('📬 Final Email:\n', state.emailContent);
        return { ...state, approved: true };
      }

      console.log('📝 [text-verifier] Suggested Improvements:', rawOutput);
      return {
        ...state,
        approved: false,
        feedback: rawOutput,
      };
    }
  ),
    ends: ['email-generator', 'html-renderer'],
  };
}
