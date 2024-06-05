import {
  FeedbackSuccessResponse,
  HashModelSelectSuccessResponse,
  NotDiamond,
} from '../notdiamond';

const notDiamond = new NotDiamond({
  apiKey: process.env.NOTDIAMOND_API_KEY,
});

async function main() {
  try {
    const hashModelSelectResult = await performHashModelSelect();
    if (!hashModelSelectResult) return;

    const { session_id } = hashModelSelectResult;

    await provideFeedback(session_id);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

async function performHashModelSelect(): Promise<HashModelSelectSuccessResponse | null> {
  const result = await notDiamond.hashModelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4' },
      { provider: 'openai', model: 'gpt-3.5-turbo' },
      { provider: 'anthropic', model: 'claude-3-opus-20240229' },
      { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
    ],
    tradeoff: 'cost',
    preferenceId: '96d43605-d2d2-4ace-a87a-5edb3c368667',
    maxModelDepth: 2,
  });

  if ('detail' in result) {
    console.error(result.detail);
    return null;
  }

  const { providers, session_id } = result;
  console.log({ providers, session_id });
  return result;
}

async function provideFeedback(
  sessionId: string,
): Promise<FeedbackSuccessResponse | null> {
  const result = await notDiamond.feedback({
    sessionId,
    feedback: { accuracy: 1 },
    provider: { provider: 'openai', model: 'gpt-4' },
  });

  if ('detail' in result) {
    console.error(result.detail);
    return null;
  }

  const { session_id: feedbackSessionId } = result;
  console.log({ feedbackSessionId });
  return result;
}

void main();
