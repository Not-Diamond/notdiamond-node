describe('Unit testing', () => {
  it('should working', () => {
    expect('AZERTY').toBe('AZERTY');
  });
});

import {
  FeedbackOptions,
  FeedbackSuccessResponse,
  HashModelSelectOptions,
  HashModelSelectSuccessResponse,
  LatencyOptions,
  LatencySuccessResponse,
  NotDiamond,
  NotDiamondErrorResponse,
  NotDiamondOptions,
} from '../notdiamond.js';

describe('NotDiamond', () => {
  const apiKey = 'test-api-key';
  const notDiamondOptions: NotDiamondOptions = { apiKey };
  const notDiamond = new NotDiamond(notDiamondOptions);

  describe('hashModelSelect', () => {
    it('should return success response', async () => {
      const options: HashModelSelectOptions = {
        messages: [{ content: 'Hello', role: 'user' }],
        llmProviders: [{ provider: 'provider1', model: 'model1' }],
        preferenceWeights: { quality: 1, cost: 1 },
      };

      const response = (await notDiamond.hashModelSelect(
        options,
      )) as HashModelSelectSuccessResponse;
      expect(response.providers).toBeDefined();
      expect(response.session_id).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: HashModelSelectOptions = {
        messages: [{ content: 'Hello', role: 'user' }],
        llmProviders: [{ provider: 'provider1', model: 'model1' }],
        preferenceWeights: { quality: 1, cost: 1 },
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
        feedback: { accuracy: 5 },
        provider: { provider: 'provider1', model: 'model1' },
      };

      const response = (await notDiamond.feedback(
        options,
      )) as FeedbackSuccessResponse;
      expect(response.session_id).toBeDefined();
      expect(response.feedback).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: FeedbackOptions = {
        sessionId: 'session-id',
        feedback: { accuracy: 5 },
        provider: { provider: 'provider1', model: 'model1' },
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
        sessionId: 'session-id',
        feedback: { accuracy: 5 },
        provider: { provider: 'provider1', model: 'model1' },
      };

      const response = (await notDiamond.latency(
        options,
      )) as LatencySuccessResponse;
      expect(response.session_id).toBeDefined();
      expect(response.tokens_per_second).toBeDefined();
    });

    it('should return error response on failure', async () => {
      const options: LatencyOptions = {
        sessionId: 'session-id',
        feedback: { accuracy: 5 },
        provider: { provider: 'provider1', model: 'model1' },
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
