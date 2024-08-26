import * as dotenv from 'dotenv';
import { version as SDK_VERSION } from '../package.json';
dotenv.config();

const DEFAULT_TIMEOUT = 5;

export interface NotDiamondOptions {
  apiKey?: string;
  apiUrl?: string;
}

export interface Provider {
  provider: string;
  model: string;
  contextLength?: number;
  inputPrice?: number;
  outputPrice?: number;
  latency?: number;
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
  private apiUrl: string;

  constructor(options: NotDiamondOptions = {}) {
    this.apiKey = options.apiKey || process.env.NOTDIAMOND_API_KEY || '';
    this.apiUrl =
      options.apiUrl ||
      process.env.NOTDIAMOND_API_URL ||
      'https://not-diamond-server.onrender.com';
    console.log('NotDiamond initialized with apiKey:', this.apiKey);
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
          'User-Agent': `TS-SDK/${SDK_VERSION}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as NotDiamondErrorResponse;
        return { detail: errorData.detail };
      }

      return (await response.json()) as T;
    } catch (error) {
      return { detail: 'An unexpected error occurred.' };
    }
  }

  async modelSelect(
    options: ModelSelectOptions,
  ): Promise<ModelSelectSuccessResponse | NotDiamondErrorResponse> {
    const requestBody = {
      messages: options.messages,
      llm_providers: options.llmProviders.map((provider) => ({
        provider: provider.provider,
        model: provider.model,
        ...(provider.contextLength !== undefined && {
          context_length: provider.contextLength,
        }),
        ...(provider.inputPrice !== undefined && {
          input_price: provider.inputPrice,
        }),
        ...(provider.outputPrice !== undefined && {
          output_price: provider.outputPrice,
        }),
        ...(provider.latency !== undefined && { latency: provider.latency }),
      })),
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
      ...(options.timeout
        ? { timeout: options.timeout }
        : {
            timeout: DEFAULT_TIMEOUT,
          }),
      ...(options.default && { default: options.default }),
    };
    return this.postRequest<ModelSelectSuccessResponse>(
      `${this.apiUrl}/v2/modelRouter/modelSelect`,
      requestBody,
    );
  }

  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    console.log('Calling feedback with options:', options);
    return this.postRequest<FeedbackSuccessResponse>(
      `${this.apiUrl}/v2/report/metrics/feedback`,
      {
        session_id: options.sessionId,
        feedback: options.feedback,
        provider: options.provider,
      },
    );
  }
}
