
import { ChatOpenAI } from '@langchain/openai';
import { Ollama } from '@langchain/ollama';
import { z } from 'zod';
import { stateSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';
import { loadApprovedEmails } from '../utility/loadApprovedEmails';

const taskPrompt = 'tell me a joke';

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

			Generate a task based on the following context: 'be creative and think outside the box.'
			`.trim();

		const response = await model.invoke([{ role: 'user', content: taskPrompt }]);
		const taskContent = typeof response === 'string' ? response : response.content;
		return {
			...state,
			task: taskContent,
		};
	} catch (err) {
		console.error('Task generation failed:', err);
		// either rethrow or return a fallback state
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
		ends: [],
	}
}

