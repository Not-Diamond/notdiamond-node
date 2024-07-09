import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://not-diamond-server.onrender.com';
const MODEL_SELECT_URL = `${BASE_URL}/v2/optimizer/modelSelect`;
const FEEDBACK_URL = `${BASE_URL}/v2/report/metrics/feedback`;

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

export interface ToolFunction {
  description?: string;
  name: string;
  parameters?: Record<string, unknown>;
}
export interface Tool {
  type: string;
  function: ToolFunction;
}
export interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

export interface ModelSelectOptions {
  messages: Message[];
  llmProviders: Provider[];
  tools?: Tool[];
  maxModelDepth?: number;
  tradeoff?: 'cost' | 'latency';
  preferenceId?: string;
  hashContent?: boolean;
  timeout?: number;
  default?: Provider | number | string;
}

export interface ModelSelectSuccessResponse {
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

export class NotDiamond {
  private apiKey: string;

  constructor(options: NotDiamondOptions = {}) {
    this.apiKey = options.apiKey || process.env.NOTDIAMOND_API_KEY || '';
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
        const errorData = (await response.json()) as NotDiamondErrorResponse;
        console.error('Error response data:', errorData);
        return { detail: errorData.detail };
      }

      const responseData = (await response.json()) as T;
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return { detail: 'An unexpected error occurred.' };
    }
  }

  async modelSelect(
    options: ModelSelectOptions,
  ): Promise<ModelSelectSuccessResponse | NotDiamondErrorResponse> {
    console.log('Calling modelSelect with options:', options);
    const requestBody = {
      messages: options.messages,
      llm_providers: options.llmProviders,
      ...(options.tradeoff && {
        tradeoff: options.tradeoff,
      }),
      ...(options.maxModelDepth && {
        max_model_depth: options.maxModelDepth,
      }),
      ...(options.tools && { tools: options.tools }),
      ...(options.hashContent !== undefined && {
        hash_content: options.hashContent,
      }),
      ...(options.preferenceId && { preference_id: options.preferenceId }),
      ...(options.timeout && { timeout: options.timeout }),
      ...(options.default && { default: options.default }),
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    return this.postRequest<ModelSelectSuccessResponse>(
      MODEL_SELECT_URL,
      requestBody,
    );
  }

  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    console.log('Calling feedback with options:', options);
    return this.postRequest<FeedbackSuccessResponse>(FEEDBACK_URL, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }
}
