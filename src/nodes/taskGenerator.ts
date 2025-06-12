
import { ChatOpenAI } from '@langchain/openai';
import { Ollama } from '@langchain/ollama';
import { z } from 'zod';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';
import { loadApprovedEmails } from '../utility/loadApprovedEmails';
import { extractEmailSection } from '../utility/extractEmailSection';
import { normalizeContent } from '../utility/normalizeContent';

const context = 'John Does is missing contact information and needs to log into the BrandName, Endpoint, application to complete his personal information.';

async function generateTask(
  model: ChatOpenAI | Ollama,
  state: z.infer<typeof stateSchema>
) {
  try {
    const examples = loadApprovedEmails();
    const approvedEmailExamples = examples
      .map((ex) => `Subject: ${ex.subject}\n\n${ex.email}`)
      .join('\n\n---\n\n');

    const prompt = `
      Here are approved email examples:
      ${approvedEmailExamples}

      Generate a task based on the following context: ${context}
    `.trim();

    const response = await model.invoke([{ role: 'user', content: prompt }]);

    let taskContent: string;

    if (typeof response === 'string') {
      taskContent = response;
    } else if ('content' in response && typeof response.content === 'string') {
      taskContent = response.content;
    } else {
      throw new Error("Unexpected response format from model.invoke");
    }

    const normalizedContent = normalizeContent(taskContent);
    const extractedContent = extractEmailSection(normalizedContent);

    return {
      ...state,
      task: extractedContent,
    };
  } catch (err) {
    console.error('Task generation failed:', err);
    throw new Error('Could not generate task');
  }
}


export function createTaskGeneratorNode (model: ChatOpenAI | Ollama) {
	return {
		id: 'task-generator',
		description: 'Generates a task based on the provided context.',
		run: withValidation(
			stateSchema,
			(state) => generateTask(model, state)
		),
		ends: ['email-hydration'],
	}
}

