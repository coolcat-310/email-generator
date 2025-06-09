import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';

const _welcomeEmailPrompt = `
Write a welcome email from Endpoint (https://www.endpoint.com/) for a new user. 
Thank them and highlight Endpoint’s benefits. 
Keep it professional and appropriate for a business environment.`.trim();

const _marketingEmailPrompt = `Write a marketing email for Endpoint (https://www.endpoint.com/) to promote our new features.`;

export function createEmailGeneratorNode(model: ChatOpenAI) {
  return {
    id: 'email-generator',
    description: 'Generates a welcome email for new users of Endpoint.',
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
      console.log('✉️ [email-generator] Current State:', JSON.stringify(state, null, 2));

      const prompt = state.feedback
        ? `Revise the email for Endpoint based on this feedback: "${state.feedback}".`
        : _welcomeEmailPrompt;

      const response = await model.invoke([{ role: 'user', content: prompt }]);

      return {
        ...state,
        emailContent: response.content,
      };
    }
  ),
    ends: ['text-verifier'],
  };
}
