import 'dotenv/config';
import {
  FeedbackOptions,
  FeedbackSuccessResponse,
  HashModelSelectOptions,
  HashModelSelectSuccessResponse,
  LatencyOptions,
  LatencySuccessResponse,
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
  { provider: 'google', model: 'gemini-1.5-pro' },
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

  describe('feedback', () => {
    it('should return success response', async () => {
      const options: FeedbackOptions = {
        sessionId: 'session-id',
        feedback: { accuracy: 0.5 },
        provider: { provider: 'openai', model: 'gpt-4' },
      };

      const response = (await notDiamond.feedback(
        options,
      )) as FeedbackSuccessResponse;
      expect(response.session_id).toBeDefined();
      expect(response.feedback).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: FeedbackOptions = {
        sessionId: 'session-id-1',
        feedback: { accuracy: 0.5 },
        provider: { provider: 'openai', model: 'gpt-4' },
      };

      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error occurred' }),
        } as Response),
      );

      const response = (await notDiamond.feedback(
        options,
      )) as NotDiamondErrorResponse;
      expect(response.detail).toBe('Error occurred');
    });
  });

  describe('latency', () => {
    it('should return success response', async () => {
      const options: LatencyOptions = {
        sessionId: 'session-id-1',
        feedback: { accuracy: 0.5 },
        provider: { provider: 'openai', model: 'gpt-4' },
      };

      const response = (await notDiamond.latency(
        options,
      )) as LatencySuccessResponse;
      expect(response.session_id).toBeDefined();
      expect(response.tokens_per_second).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: LatencyOptions = {
        sessionId: 'session-id-1',
        feedback: { accuracy: 0.5 },
        provider: { provider: 'openai', model: 'gpt-4' },
      };

      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error occurred' }),
        } as Response),
      );

      const response = (await notDiamond.latency(
        options,
      )) as NotDiamondErrorResponse;
      expect(response.detail).toBe('Error occurred');
    });
  });
});
