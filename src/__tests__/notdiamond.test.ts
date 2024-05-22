import 'dotenv/config';
import {
  HashModelSelectOptions,
  HashModelSelectSuccessResponse,
  Message,
  NotDiamond,
  NotDiamondErrorResponse,
  NotDiamondOptions,
  Provider,
} from '../notdiamond';

const messages: Message[] = [{ content: 'What is 12x12?', role: 'user' }];
const llmProviders: Provider[] = [
  { provider: 'openai', model: 'gpt-4' },
  { provider: 'anthropic', model: 'claude-3-opus-20240229' },
];

const preferenceWeights = { quality: 0.7, cost: 0.1, latency: 0.2 };
describe('NotDiamond', () => {
  const apiKey = process.env.NOTDIAMOND_API_KEY ?? 'test-api-key';
  const notDiamondOptions: NotDiamondOptions = { apiKey };
  const notDiamond = new NotDiamond(notDiamondOptions);

  describe('hashModelSelect', () => {
    it('should return success response', async () => {
      const options: HashModelSelectOptions = {
        messages,
        llmProviders: llmProviders,
        preferenceWeights,
      };

      const response = (await notDiamond.hashModelSelect(
        options,
      )) as HashModelSelectSuccessResponse;
      expect(response.providers).toBeDefined();
      expect(response.session_id).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: HashModelSelectOptions = {
        messages,
        llmProviders,
        preferenceWeights,
      };

      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error occurred' }),
        } as Response),
      );

      const response = (await notDiamond.hashModelSelect(
        options,
      )) as NotDiamondErrorResponse;
      expect(response.detail).toBe('Error occurred');
    });
  });
});
