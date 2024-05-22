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
  private baseUrl: string = 'https://not-diamond-server.onrender.com';

  constructor(options: NotDiamondOptions) {
    this.apiKey = options.apiKey;
    console.log('NotDiamond initialized with apiKey:', this.apiKey);
  }

  private getAuthHeader(): string {
    const authHeader = `Bearer ${this.apiKey}`;
    console.log('Generated auth header:', authHeader);
    return authHeader;
  }

  private async postRequest<T>(
    url: string,
    body: object,
  ): Promise<T | NotDiamondErrorResponse> {
    console.log('Sending POST request to URL:', url);
    console.log('Request body:', body);
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

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        return { detail: errorData.detail };
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return { detail: 'An unexpected error occurred.' };
    }
  }

  async hashModelSelect(
    options: HashModelSelectOptions,
  ): Promise<HashModelSelectSuccessResponse | NotDiamondErrorResponse> {
    const url = `${this.baseUrl}/v2/optimizer/hashModelSelect`;
    console.log('Calling hashModelSelect with options:', options);
    return this.postRequest<HashModelSelectSuccessResponse>(url, {
      messages: options.messages,
      llm_providers: options.llmProviders,
      ...(options.preferenceWeights && {
        preference_weights: options.preferenceWeights,
      }),
      ...(options.maxModelDepth && { max_model_depth: options.maxModelDepth }),
      ...(options.tools && { tools: options.tools }),
    });
  }

  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    const url = `${this.baseUrl}/v1/report/metrics/feedback`;
    console.log('Calling feedback with options:', options);
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
    console.log('Calling latency with options:', options);
    return this.postRequest<LatencySuccessResponse>(url, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }
}
