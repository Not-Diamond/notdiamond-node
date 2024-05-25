import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://not-diamond-server.onrender.com';
const HASH_MODEL_SELECT_URL = `${BASE_URL}/v2/optimizer/hashModelSelect`;
const FEEDBACK_URL = `${BASE_URL}/v1/report/metrics/feedback`;
const LATENCY_URL = `${BASE_URL}/v1/report/metrics/latency`;

export interface NotDiamondOptions {
  apiKey?: string;
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
export interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

export interface HashModelSelectOptions {
  messages: Message[];
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

  constructor(options: NotDiamondOptions = {}) {
    this.apiKey = options.apiKey || process.env.NOTDIAMOND_API_KEY || '';
  }

  private getAuthHeader(): string {
    const authHeader = `Bearer ${this.apiKey}`;
    return authHeader;
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
        const errorData = (await response.json()) as NotDiamondErrorResponse;
        return { detail: errorData.detail };
      }

      const responseData = (await response.json()) as T;
      return responseData;
    } catch (error) {
      return { detail: 'An unexpected error occurred.' };
    }
  }

  async hashModelSelect(
    options: HashModelSelectOptions,
  ): Promise<HashModelSelectSuccessResponse | NotDiamondErrorResponse> {
    return this.postRequest<HashModelSelectSuccessResponse>(
      HASH_MODEL_SELECT_URL,
      {
        messages: options.messages,
        llm_providers: options.llmProviders,
        ...(options.preferenceWeights && {
          preference_weights: options.preferenceWeights,
        }),
        ...(options.maxModelDepth && {
          max_model_depth: options.maxModelDepth,
        }),
        ...(options.tools && { tools: options.tools }),
      },
    );
  }

  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    return this.postRequest<FeedbackSuccessResponse>(FEEDBACK_URL, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }

  async latency(
    options: LatencyOptions,
  ): Promise<LatencySuccessResponse | NotDiamondErrorResponse> {
    return this.postRequest<LatencySuccessResponse>(LATENCY_URL, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }
}
