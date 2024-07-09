# NotDiamond Node API Library

This library provides convenient access to the NotDiamond model routing API from TypeScript or JavaScript. NotDiamond helps you select the best AI model for your specific use case, optimizing for factors like cost, latency, or performance.

## Installation

```sh
npm install notdiamond
```

For Deno users:

```ts
import { NotDiamond } from 'https://deno.land/x/notdiamond@v1.0.0/mod.ts';
```

## Quick Start

To use the API, you need to sign up for a NotDiamond account and obtain an API key. [Sign up here](https://app.notdiamond.ai).

### Basic Usage

Here's a simple example of how to use NotDiamond to select the best model between GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro, while optimizing for latency:

```typescript
import { NotDiamond } from 'notdiamond';

const notDiamond = new NotDiamond({
  apiKey: process.env.NOTDIAMOND_API_KEY,
});

async function basicExample() {
  const result = await notDiamond.modelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4o-2024-05-13' },
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20240620' },
      { provider: 'google', model: 'gemini-1.5-pro-latest' },
    ],
    tradeoff: 'latency',
  });

  if ('detail' in result) {
    console.error('Error:', result.detail);
    return;
  }

  console.log('Selected providers:', result.providers);
  console.log('Session ID:', result.session_id);
}

basicExample();
```

### Advanced Usage with Tools

You can also use NotDiamond with custom tools:

```typescript
import { NotDiamond, Tool } from 'notdiamond';

const notDiamond = new NotDiamond({
  apiKey: process.env.NOTDIAMOND_API_KEY,
});

const tools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'multiply',
      description: 'Multiplies two numbers.',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'integer' },
          b: { type: 'integer' },
        },
        required: ['a', 'b'],
      },
    },
  },
];

async function toolCallingExample() {
  const result = await notDiamond.modelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4-1106-preview' },
      { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
    ],
    tools: tools,
    tradeoff: 'cost',
    maxModelDepth: 2,
  });

  if ('detail' in result) {
    console.error('Error:', result.detail);
    return;
  }

  console.log('Selected providers:', result.providers);
  console.log('Session ID:', result.session_id);
}

toolCallingExample();
```

## API Reference

For a complete API reference and more detailed documentation, please check our [API Documentation](https://notdiamond.readme.io/v0.1.0-beta/docs/getting-started).

## Key Concepts

- **llmProviders**: An array of AI providers and models you want NotDiamond to choose from.
- **tradeoff**: The factor to optimize for (e.g., 'latency', 'cost', 'performance').
- **tools**: Custom functions that the AI can use to perform specific tasks.
- **maxModelDepth**: The maximum number of models to include in the response (for advanced use cases).

## Error Handling

NotDiamond uses typed responses. If there's an error, the response will have a `detail` property with the error message. Always check for this property when handling responses.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Not-Diamond/notdiamond-node) on our GitHub repository.

## License

This library is released under the MIT License.
