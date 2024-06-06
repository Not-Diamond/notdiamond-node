# NotDiamond Node API Library

This library provides convenient access to the NotDiamond model routing API from TypeScript or JavaScript.

To use the API, you will need to sign up for a NotDiamond account and obtain an API key. [You can sign up here.](https://app.notdiamond.ai)

To learn how to use the NotDiamond API, check out our [API Reference and Documentation.](https://notdiamond.readme.io/v0.1.0-beta/docs/getting-started)

## Installation

```sh
npm install notdiamond
```

You can import in Deno via:

```ts
import { NotDiamond } from 'https://deno.land/x/notdiamond@v1.0.0/mod.ts';
```

## Usage

The full API of this library can be found in `api.md` file along with many code examples. The code below shows how to get started using the chat completions API.

```ts
import { NotDiamond } from 'notdiamond';

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
    tradeoff: 'cost',
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
```
