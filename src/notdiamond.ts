/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export interface NotDiamondOptions {
  apiKey: string;
}

export interface Provider {
  provider: string;
  model: string;
}

export interface NotDiamondErrorResponse {
  detail: string;
}

export interface Tool {
  type: string;
  functions: Record<string, string>;
}
export interface HashModelSelectOptions {
  messages: {
    content: string;
    role: 'user' | 'assistant' | 'system';
  }[];
  llmProviders: Provider[];
  tools?: Tool[];
  maxModelDepth?: number;
  preferenceWeights?: {
    quality: number;
    cost: number;
    latency?: number;
    preference_id?: string;
  };
}

export interface HashModelSelectSuccessResponse {
  providers: Provider[];
  session_id: string;
}

export interface Feedback {
  accuracy: number;
}

export interface FeedbackOptions {
  sessionId: string;
  feedback: Feedback;
  provider: Provider;
}

export interface FeedbackSuccessResponse {
  session_id: string;
  feedback: Feedback;
}

export interface LatencyOptions {
  sessionId: string;
  feedback: Feedback;
  provider: Provider;
}

export interface LatencySuccessResponse {
  session_id: string;
  tokens_per_second: number;
}

export class NotDiamond {
  private apiKey: string;
  private baseUrl: string = 'https://not-diamond-server.onrender.com';

  constructor(options: NotDiamondOptions) {
    this.apiKey = options.apiKey;
  }

  private getAuthHeader(): string {
    return `Bearer ${this.apiKey}`;
  }

  private async postRequest<T>(
    url: string,
    body: object,
  ): Promise<T | NotDiamondErrorResponse> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeader(),
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { detail: errorData.detail };
      }

      return await response.json();
    } catch (error) {
      return { detail: 'An unexpected error occurred.' };
    }
  }

  async hashModelSelect(
    options: HashModelSelectOptions,
  ): Promise<HashModelSelectSuccessResponse | NotDiamondErrorResponse> {
    const url = `${this.baseUrl}/v2/optimizer/hashModelSelect`;
    return this.postRequest<HashModelSelectSuccessResponse>(url, {
      messages: options.messages,
      preference_weights: options.preferenceWeights,
      llm_providers: options.llmProviders,
      max_model_depth: options.maxModelDepth,
      tools: options.tools,
    });
  }

  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    const url = `${this.baseUrl}/v1/report/metrics/feedback`;
    return this.postRequest<FeedbackSuccessResponse>(url, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }

  async latency(
    options: LatencyOptions,
  ): Promise<LatencySuccessResponse | NotDiamondErrorResponse> {
    const url = `${this.baseUrl}/v1/report/metrics/latency`;
    return this.postRequest<LatencySuccessResponse>(url, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }
}
