import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { stateSchema } from '../state/schema';

export function createEmailGeneratorNode(model: ChatOpenAI) {
  return {
    id: 'email-generator',
    description: 'Generates a welcome email for new users of Endpoint.',
    async run(state: z.infer<typeof stateSchema>) {
      console.log('✉️ [email-generator] Current State:', JSON.stringify(state, null, 2));

      const prompt = state.feedback
        ? `Revise the welcome email for Endpoint based on this feedback: "${state.feedback}".`
        : `
Write a welcome email from Endpoint (https://www.endpoint.com/) for a new user. 
Thank them and highlight Endpoint’s benefits. 
Keep it professional and appropriate for a business environment.`.trim();

      const response = await model.invoke([{ role: 'user', content: prompt }]);

      return {
        ...state,
        emailContent: response.content,
      };
    },
    ends: ['text-verifier'],
  };
}
