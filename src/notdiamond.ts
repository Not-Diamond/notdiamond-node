import * as dotenv from 'dotenv';
import packageJson from '../package.json' assert { type: 'json' };
import { callLLM } from './features/create';
import { callLLMStream } from './features/create';
import {
  Provider,
  SupportedProvider,
  SupportedModel,
} from './constants/providers';
import axios from 'axios';
import { z } from 'zod'; // Assuming zod is imported for the new responseModel field

const SDK_VERSION = packageJson.version;
dotenv.config();

const DEFAULT_TIMEOUT = 5;

const BASE_URL = 'https://not-diamond-server.onrender.com';

export interface NotDiamondOptions {
  apiKey?: string;
  apiUrl?: string;
  llmKeys?: Partial<
    Record<(typeof SupportedProvider)[keyof typeof SupportedProvider], string>
  >;
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
  previousSession?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  responseModel?: z.ZodType<any>;
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
  private modelSelectUrl: string;
  private feedbackUrl: string;
  private createUrl: string;
  private llmKeys: Record<string, string>;

  constructor(options: NotDiamondOptions = {}) {
    this.apiKey = options.apiKey || process.env.NOTDIAMOND_API_KEY || '';
    this.apiUrl = options.apiUrl || process.env.NOTDIAMOND_API_URL || BASE_URL;
    this.llmKeys = options.llmKeys || {};
    this.modelSelectUrl = `${this.apiUrl}/v2/modelRouter/modelSelect`;
    this.feedbackUrl = `${this.apiUrl}/v2/report/metrics/feedback`;
    this.createUrl = `${this.apiUrl}/v2/preferences/userPreferenceCreate`;
  }

  private getAuthHeader(): string {
    return `Bearer ${this.apiKey}`;
  }

  private async postRequest<T>(
    url: string,
    body: object,
  ): Promise<T | NotDiamondErrorResponse> {
    try {
      const response = await axios.post(url, body, {
        headers: {
          Authorization: this.getAuthHeader(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': `TS-SDK/${SDK_VERSION}`,
        },
      });

      return response.data as T;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { detail: 'An error occurred.' };
      }
      console.error('error', error);
      return { detail: 'An unexpected error occurred.' };
    }
  }

  /**
   * Selects the best model for the given messages.
   * @param options The options for the model.
   * @returns The results of the model.
   */
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
        ...(provider.isCustom !== undefined && {
          is_custom: provider.isCustom,
        }),
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
      ...(options.previousSession && {
        previous_session: options.previousSession,
      }),
      ...(options.responseModel && {
        response_model: options.responseModel,
      }),
    };
    return this.postRequest<ModelSelectSuccessResponse>(
      this.modelSelectUrl,
      requestBody,
    );
  }

  /**
   * Sends feedback to the NotDiamond API.
   * @param options The options for the feedback.
   * @returns The results of the feedback.
   */
  async feedback(
    options: FeedbackOptions,
  ): Promise<FeedbackSuccessResponse | NotDiamondErrorResponse> {
    return this.postRequest<FeedbackSuccessResponse>(this.feedbackUrl, {
      session_id: options.sessionId,
      feedback: options.feedback,
      provider: options.provider,
    });
  }

  /**
   * Creates a preference id.
   * @returns The preference id.
   */
  async createPreferenceId(): Promise<string | NotDiamondErrorResponse> {
    const response = await this.postRequest<{ preference_id: string }>(
      this.createUrl,
      {},
    );

    if ('preference_id' in response) {
      return response.preference_id;
    }

    throw new Error('Invalid response: preference_id not found');
  }

  /**
   *
   * @param options The options for the model.
   * @returns A promise that resolves to the results of the model.
   */
  private async acreate(options: ModelSelectOptions) {
    const selectedModel = await this.modelSelect(options);
    const { providers } = selectedModel as ModelSelectSuccessResponse;
    const content = await callLLM(providers[0], options, this.llmKeys);

    return { content, providers };
  }

  /**
   *
   * @param options The options for the model.
   * @param callback Optional callback function to handle the result.
   * @returns A promise that resolves to the results of the model or a callback function
   */
  create(
    options: ModelSelectOptions,
    callback?: (
      error: Error | null,
      result?: { content: string; providers: Provider[] },
    ) => void,
  ) {
    const promise = this.acreate(options);

    if (callback) {
      promise
        .then((result) => callback(null, result))
        .catch((error) => callback(error as Error));
    } else {
      return promise;
    }
  }

  /**
   * Streams the results of the model asynchronously.
   * @param options The options for the model.
   * @returns A promise that resolves to an object containing the provider and an AsyncIterable of strings.
   */
  private async astream(
    options: ModelSelectOptions,
  ): Promise<{ provider: Provider; stream: AsyncIterable<string> }> {
    const selectedModel = await this.modelSelect(options);
    const { providers } = selectedModel as ModelSelectSuccessResponse;

    const stream = await Promise.resolve(
      callLLMStream(
        providers?.[0] || {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
        },
        options,
        this.llmKeys,
      ),
    );
    return {
      provider: providers?.[0] || {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
      },
      stream,
    };
  }

  /**
   * Streams the results of the model.
   * @param options The options for the model.
   * @param callback Optional callback function to handle each chunk of the stream.
   * @returns A promise that resolves to an object containing the provider and an AsyncIterable of strings or a callback function
   */
  stream(
    options: ModelSelectOptions,
    callback?: (
      error: Error | null,
      result?: { provider: Provider; chunk?: string },
    ) => void,
  ) {
    if (!options.llmProviders || options.llmProviders.length === 0) {
      throw new Error('No LLM providers specified');
    }

    const promise = this.astream(options);

    if (callback) {
      promise
        .then(async ({ provider, stream }) => {
          for await (const chunk of stream) {
            callback(null, { provider, chunk });
          }
        })
        .catch((error) => callback(error as Error));
    } else {
      return promise;
    }
  }
}

export { SupportedProvider, SupportedModel };
