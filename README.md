# NotDiamond Node API Library

This library provides convenient access to the NotDiamond model routing API from TypeScript or JavaScript.

To learn how to use the NotDiamond API, check out our [API Reference and Documentation.](https://notdiamond.readme.io/v0.1.0-beta/docs/getting-started)

## Installation

```sh
npm install notdiamond
```

You can import in Deno via:

```ts
import NotDiamond from 'https://deno.land/x/notdiamond@v1.0.0/mod.ts';
```

## Usage

The full API of this library can be found in `api.md` file along with many code examples. The code below shows how to get started using the chat completions API.

```ts
import NotDiamond from 'notdiamond';

const notdiamond = new NotDiamond();

async function main() {
  const { providers, session_id } = await notdiamond.hashModelSelect({
    messages: [{ content: 'What is 12x12?', role: 'user' }],
    llmProviders: [
      { provider: 'openai', model: 'gpt-4o' },
      { provider: 'anthropic', model: 'claude-3-opus-20240229' },
      { provider: 'google', model: 'gemini-1.5-pro' },
    ],
    preferenceWeights: { quality: 0.7, cost: 0.1, latency: 0.2 },
  });

  console.log(providers);
  console.log(session_id);
}

main();
```
