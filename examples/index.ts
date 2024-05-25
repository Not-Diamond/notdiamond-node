import { NotDiamond } from '../src/notdiamond';

const notDiamond = new NotDiamond({
  apiKey: process.env.NOTDIAMOND_API_KEY,
});

async function main() {
  const result = await notDiamond.hashModelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4' },
      { provider: 'openai', model: 'gpt-3.5-turbo' },
      { provider: 'anthropic', model: 'claude-3-opus-20240229' },
      { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
    ],
    preferenceWeights: { quality: 0.7, cost: 0.1, latency: 0.2 },
    maxModelDepth: 2,
  });
  if ('detail' in result) {
    // There was an error
    console.error(result.detail);
    return;
  }
  const { providers, session_id } = result;
  console.log({ providers, session_id });
}

void main();
