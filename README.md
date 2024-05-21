# NotDiamond Node API Library

This library provides convenient access to the NotDiamond model routing API from TypeScript or JavaScript.

It is generated from our OpenAPI specification with Stainless.

To learn how to use the NotDiamond API, check out our API Reference and Documentation.

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

### TO DELETE

A simple node boilerplate made in typescript using swc which generates `cjs` and `esm` modules.

## Clone repository and install dependencies

```sh
git clone https://github.com/maxgfr/typescript-swc-starter # For cloning the repository
cd typescript-swc-starter # To navigate to the repository root
yarn # Install dependencies
```

:warning: You have to use at least `node@20` to run this project.

## Commands

```sh
yarn dev # For running the code in development thanks to swc and nodemon

yarn test # For running unit test
yarn test:watch # For watching unit test

yarn lint # For linting the code
yarn lint:fix # For linting the code and fix issues

yarn bundle # For generating bundling in cjs and esm

yarn start:cjs # For running the code builded in cjs
yarn start:esm # For running the code builded in esm
```

## Publish to npm

Set `NPM_TOKEN` in your Github actions secret, and that's it :)

![Alt Text](https://raw.githubusercontent.com/maxgfr/typescript-swc-starter/main/.github/assets/token.png)

To test this package, just do that :

```ts
import { sayHello } from 'typescript-swc-starter';
sayHello();
```
