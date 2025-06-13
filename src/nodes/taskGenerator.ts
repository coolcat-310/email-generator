import { ChatOpenAI } from '@langchain/openai';
import { Ollama } from '@langchain/ollama';
import { z } from 'zod';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { stateSchema, taskSchema } from '../state/schema';
import { withValidation } from '../utility/withValidation';
import { loadApprovedEmails } from '../utility/loadApprovedEmails';

const parser = StructuredOutputParser.fromZodSchema(taskSchema);

const context = 'John Does is missing contact information and needs to log into application to complete his personal information.';

async function generateTask(
  model: ChatOpenAI | Ollama,
  state: z.infer<typeof stateSchema>
) {
  try {
    const examples = loadApprovedEmails();
    const approvedEmailExamples = examples
      .map((ex) => `Task Name: ${ex.taskName}\nSubject: ${ex.subject}\nEmail: ${ex.email}`)
      .join('\n\n---\n\n');

    const formatInstructions = parser.getFormatInstructions();

    const prompt = `
      Here are approved email examples:

      ${approvedEmailExamples}

      Now generate a new task based on the following context: "${context}".

      ${formatInstructions}
      `.trim();

    const response = await model.invoke([{ role: 'user', content: prompt }]);

    let rawContent: string;
    if (typeof response === 'string') {
      rawContent = response;
    } else if ('content' in response && typeof response.content === 'string') {
      rawContent = response.content;
    } else {
      throw new Error("Unexpected response format from model.invoke");
    }

    const parsed = await parser.parse(rawContent);

    return {
      ...state,
      taskName: parsed.taskName,
      subject: parsed.subject,
      emailContent: parsed.emailContent
    };
  } catch (err) {
    console.error('Task generation failed:', err);
    throw new Error('Could not generate task');
  }
}

export function createTaskGeneratorNode(model: ChatOpenAI | Ollama) {
  return {
    id: 'task-generator',
    description: 'Generates a structured task with subject and email content.',
    run: withValidation(
      stateSchema,
      (state) => generateTask(model, state)
    ),
    ends: ['email-hydration'],
  };
}
