/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import {
  BaseChatModel,
  BaseChatModelCallOptions,
} from '@langchain/core/language_models/chat_models';
import {
  BaseMessageChunk,
  AIMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import axios from 'axios';

/**
 * MoonshotAI model for LangChain.
 */
export class ChatMoonshotAI extends BaseChatModel<BaseChatModelCallOptions> {
  _generate(
    messages: BaseMessage[],
    options: this['ParsedCallOptions'],
    runManager?: CallbackManagerForLLMRun,
  ): Promise<ChatResult> {
    throw new Error(
      'Method not implemented.' +
        JSON.stringify(messages) +
        JSON.stringify(options) +
        JSON.stringify(runManager),
    );
  }
  private apiKey: string;
  private model: string;

  constructor({ apiKey, model }: { apiKey: string; model: string }) {
    super({});
    this.apiKey = apiKey;
    this.model = model;
  }

  _llmType(): string {
    return 'moonshotai';
  }

  /**
   * Invokes the MoonshotAI model.
   * @param messages The messages to send to the model.
   * @returns The results of the model.
   */
  async invoke(messages: BaseMessageChunk[]): Promise<any> {
    try {
      const { data } = await axios.post<{
        choices: [{ message: { content: string } }];
      }>(
        'https://api.moonshot.ai/v1/chat/completions',
        {
          model: this.model,
          messages: messages.map((m) => {
            const type = m._getType();
            let role: string;
            if (type === 'human') {
              role = 'user';
            } else if (type === 'ai') {
              role = 'assistant';
            } else {
              role = type;
            }
            return {
              role,
              content: m.content,
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return new AIMessage(data.choices[0].message.content);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`MoonshotAI API error: ${error.response.statusText}`);
      }
      throw error;
    }
  }
}
