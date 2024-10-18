/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { Message, ModelSelectOptions } from '../notdiamond';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatPerplexity } from '../models/perplexity';
import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import { Provider, SupportedProvider } from '../constants/providers';
import { ZodType, ZodTypeDef } from 'zod';

/**
 * Gets the LangChain model for a given provider.
 * @param provider The provider to get the model for.
 * @param llmKeys The LLM keys to use.
 * @param responseModel The response model to use.
 *
 * @returns The LangChain model.
 */
function getLangChainModel(
  provider: Provider,
  llmKeys: Record<string, string>,
  responseModel: ZodType<any, ZodTypeDef, any> | undefined,
): BaseChatModel {
  const { OPENAI, ANTHROPIC, GOOGLE, MISTRAL, PERPLEXITY, TOGETHER } =
    SupportedProvider;

  console.log(provider);

  switch (provider.provider) {
    case OPENAI:
      if (responseModel) {
        return new ChatOpenAI({
          modelName: provider.model,
          apiKey: llmKeys.openai || process.env.OPENAI_API_KEY,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatOpenAI({
        modelName: provider.model,
        apiKey: llmKeys.openai || process.env.OPENAI_API_KEY,
      });
    case ANTHROPIC:
      if (responseModel) {
        return new ChatAnthropic({
          modelName: provider.model,
          anthropicApiKey: llmKeys.anthropic || process.env.ANTHROPIC_API_KEY,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatAnthropic({
        modelName: provider.model,
        anthropicApiKey: llmKeys.anthropic || process.env.ANTHROPIC_API_KEY,
      });
    case GOOGLE:
      if (responseModel) {
        return new ChatGoogleGenerativeAI({
          modelName: provider.model,
          apiKey: llmKeys.google || process.env.GOOGLE_API_KEY,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatGoogleGenerativeAI({
        modelName: provider.model,
        apiKey: llmKeys.google || process.env.GOOGLE_API_KEY,
      });
    case MISTRAL:
      if (responseModel) {
        return new ChatMistralAI({
          modelName: provider.model,
          apiKey: llmKeys.mistral || process.env.MISTRAL_API_KEY,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatMistralAI({
        modelName: provider.model,
        apiKey: llmKeys.mistral || process.env.MISTRAL_API_KEY,
      });
    case PERPLEXITY:
      if (responseModel) {
        return new ChatPerplexity({
          apiKey: llmKeys.perplexity || process.env.PPLX_API_KEY || '',
          model: provider.model,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatPerplexity({
        apiKey: llmKeys.perplexity || process.env.PPLX_API_KEY || '',
        model: provider.model,
      });
    case TOGETHER:
      if (responseModel) {
        return new ChatTogetherAI({
          apiKey: process.env.TOGETHER_API_KEY || llmKeys.together,
          model: provider.model,
        }).withStructuredOutput(responseModel) as unknown as BaseChatModel;
      }
      return new ChatTogetherAI({
        apiKey: process.env.TOGETHER_API_KEY || llmKeys.together,
        model: provider.model,
      });
    default:
      throw new Error(`Unsupported provider: ${provider.provider as string}`);
  }
}

/**
 * Calls the LLM model and returns the results.
 * @param provider The provider to use.
 * @param options The options for the model.
 * @param llmKeys The LLM keys to use.
 *
 * @returns The results of the model.
 */
export async function callLLM(
  provider: Provider,
  options: ModelSelectOptions,
  llmKeys: Record<string, string>,
): Promise<string> {
  const model = getLangChainModel(provider, llmKeys, options.responseModel);
  const langChainMessages = options.messages.map(convertToLangChainMessage);

  const response = await model.invoke(langChainMessages);
  return extractContent(response);
}

/**
 * Converts a NotDiamond message to a LangChain message.
 * @param msg The NotDiamond message to convert.
 * @returns The LangChain message.
 */
function convertToLangChainMessage(msg: Message) {
  switch (msg.role) {
    case 'user':
      return new HumanMessage(msg.content);
    case 'assistant':
      return new AIMessage(msg.content);
    case 'system':
      return new SystemMessage(msg.content);
    default:
      return new HumanMessage(msg.content);
  }
}

/**
 * Calls the LLM model and streams the results.
 * @param provider The provider to use.
 * @param options The options for the model.
 * @param llmKeys The LLM keys to use.
 *
 * @returns A generator that yields the results of the model.
 */
export async function* callLLMStream(
  provider: Provider,
  options: ModelSelectOptions,
  llmKeys: Record<string, string>,
): AsyncGenerator<string> {
  const model = getLangChainModel(provider, llmKeys, options.responseModel);
  const langChainMessages = options.messages.map(convertToLangChainMessage);

  const stream = await model.stream(langChainMessages);

  for await (const chunk of stream) {
    yield extractContent(chunk);
  }
}

/**
 * Extracts the content from a response object.
 * @param response The response object to extract content from.
 * @returns The content as a string.
 */
function extractContent(response: BaseMessage | { content: string }): string {
  if ('content' in response) {
    return typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  }
  return typeof response === 'string' ? response : JSON.stringify(response);
}
