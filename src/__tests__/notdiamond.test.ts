import 'dotenv/config';
import {
  Message,
  ModelSelectOptions,
  ModelSelectSuccessResponse,
  NotDiamond,
  NotDiamondErrorResponse,
  NotDiamondOptions,
  Provider,
  Tool,
} from '../notdiamond';

const messages: Message[] = [{ content: 'What is 12x12?', role: 'user' }];
const llmProviders: Provider[] = [
  {
    provider: 'openai',
    model: 'gpt-4o-2024-05-13',
  },
  {
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
  },
];
const tools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'add',
      description: 'Adds a and b.',
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
  {
    type: 'function',
    function: {
      name: 'multiply',
      description: 'Multiplies a and b.',
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

describe('NotDiamond', () => {
  const apiKey = process.env.NOTDIAMOND_API_KEY ?? 'test-api-key';
  const notDiamondOptions: NotDiamondOptions = { apiKey };
  const notDiamond = new NotDiamond(notDiamondOptions);

  describe('modelSelect should choose the best provider', () => {
    it('should return success response', async () => {
      const options: ModelSelectOptions = {
        messages,
        llmProviders: llmProviders,
        tradeoff: 'latency',
        timeout: 10,
        default: llmProviders[0],
      };

      const response = (await notDiamond.modelSelect(
        options,
      )) as ModelSelectSuccessResponse;
      expect(response.providers).toBeDefined();
      expect(response.session_id).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: ModelSelectOptions = {
        messages,
        llmProviders,
        tradeoff: 'latency',
        timeout: 3,
        default: 1,
      };

      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error occurred' }),
        } as Response),
      );

      const response = (await notDiamond.modelSelect(
        options,
      )) as NotDiamondErrorResponse;
      expect(response.detail).toBe('Error occurred');
    });
  });

  describe('modelSelect should use tools', () => {
    it('should return success response', async () => {
      const options: ModelSelectOptions = {
        messages: [
          {
            role: 'system',
            content: 'You are a mathematician with tools at your disposal.',
          },
          { role: 'user', content: 'What is 234 + 82234?' },
        ],
        llmProviders,
        tools,
      };

      const response = (await notDiamond.modelSelect(
        options,
      )) as ModelSelectSuccessResponse;
      expect(response.providers).toBeDefined();
      expect(response.session_id).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: ModelSelectOptions = {
        messages,
        llmProviders,
        tools,
        tradeoff: 'latency',
      };

      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error occurred' }),
        } as Response),
      );

      const response = (await notDiamond.modelSelect(
        options,
      )) as NotDiamondErrorResponse;
      expect(response.detail).toBe('Error occurred');
    });
  });
});
