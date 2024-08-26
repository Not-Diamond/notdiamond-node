import {
  FeedbackSuccessResponse,
  ModelSelectSuccessResponse,
  NotDiamond,
} from '../notdiamond';

// Initialize the NotDiamond client with an API key
const notDiamond = new NotDiamond({
  apiKey: process.env.NOTDIAMOND_API_KEY,
});

async function main() {
  try {
    const modelSelectResult = await performModelSelect();
    if (!modelSelectResult) return;

    const { session_id } = modelSelectResult;

    await provideFeedback(session_id);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

async function performModelSelect(): Promise<ModelSelectSuccessResponse | null> {
  // Use NotDiamond to select the best model based on the given criteria
  const result = await notDiamond.modelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4' },
      { provider: 'openai', model: 'gpt-3.5-turbo' },
      { provider: 'anthropic', model: 'claude-3-opus-20240229' },
      { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
      { provider: 'google', model: 'gemini-1.5-pro-latest' },
    ],
    tradeoff: 'cost', // Optimize for cost
  });

  if ('detail' in result) {
    console.error(result.detail);
    return null;
  }

  return result;
}

async function provideFeedback(
  sessionId: string,
): Promise<FeedbackSuccessResponse | null> {
  // Provide feedback on the model's performance
  const result = await notDiamond.feedback({
    sessionId,
    feedback: { accuracy: 1 }, // Indicate high accuracy
    provider: { provider: 'openai', model: 'gpt-4' },
  });

  if ('detail' in result) {
    console.error(result.detail);
    return null;
  }

  return result;
}

void main();
