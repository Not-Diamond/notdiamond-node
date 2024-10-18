export const SupportedProvider = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  MISTRAL: 'mistral',
  PERPLEXITY: 'perplexity',
  TOGETHER: 'together',
} as const;

export const SupportedModel = {
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_3_5_TURBO_0125: 'gpt-3.5-turbo-0125',
  GPT_4: 'gpt-4',
  GPT_4_0613: 'gpt-4-0613',
  GPT_4_1106_PREVIEW: 'gpt-4-1106-preview',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_4_TURBO_PREVIEW: 'gpt-4-turbo-preview',
  GPT_4_TURBO_2024_04_09: 'gpt-4-turbo-2024-04-09',
  GPT_4O_2024_05_13: 'gpt-4o-2024-05-13',
  GPT_4O_2024_08_06: 'gpt-4o-2024-08-06',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI_2024_07_18: 'gpt-4o-mini-2024-07-18',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4_0125_PREVIEW: 'gpt-4-0125-preview',
  O1_PREVIEW: 'o1-preview',
  O1_PREVIEW_2024_09_12: 'o1-preview-2024-09-12',
  O1_MINI: 'o1-mini',
  O1_MINI_2024_09_12: 'o1-mini-2024-09-12',
  CLAUDE_2_1: 'claude-2.1',
  CLAUDE_3_OPUS_20240229: 'claude-3-opus-20240229',
  CLAUDE_3_SONNET_20240229: 'claude-3-sonnet-20240229',
  CLAUDE_3_5_SONNET_20240620: 'claude-3-5-sonnet-20240620',
  CLAUDE_3_HAIKU_20240307: 'claude-3-haiku-20240307',
  GEMINI_PRO: 'gemini-pro',
  GEMINI_1_PRO_LATEST: 'gemini-1.0-pro-latest',
  GEMINI_15_PRO_LATEST: 'gemini-1.5-pro-latest',
  GEMINI_15_PRO_EXP_0801: 'gemini-1.5-pro-exp-0801',
  GEMINI_15_FLASH_LATEST: 'gemini-1.5-flash-latest',
  COMMAND_R: 'command-r',
  COMMAND_R_PLUS: 'command-r-plus',
  MISTRAL_LARGE_LATEST: 'mistral-large-latest',
  MISTRAL_LARGE_2407: 'mistral-large-2407',
  MISTRAL_LARGE_2402: 'mistral-large-2402',
  MISTRAL_MEDIUM_LATEST: 'mistral-medium-latest',
  MISTRAL_SMALL_LATEST: 'mistral-small-latest',
  CODESTRAL_LATEST: 'codestral-latest',
  OPEN_MISTRAL_7B: 'open-mistral-7b',
  OPEN_MIXTRAL_8X7B: 'open-mixtral-8x7b',
  OPEN_MIXTRAL_8X22B: 'open-mixtral-8x22b',
  MISTRAL_7B_INSTRUCT_V0_2: 'Mistral-7B-Instruct-v0.2',
  MIXTRAL_8X7B_INSTRUCT_V0_1: 'Mixtral-8x7B-Instruct-v0.1',
  MIXTRAL_8X22B_INSTRUCT_V0_1: 'Mixtral-8x22B-Instruct-v0.1',
  LLAMA_3_70B_CHAT_HF: 'Llama-3-70b-chat-hf',
  LLAMA_3_8B_CHAT_HF: 'Llama-3-8b-chat-hf',
  QWEN2_72B_INSTRUCT: 'Qwen2-72B-Instruct',
  LLAMA_3_1_8B_INSTRUCT_TURBO: 'Meta-Llama-3.1-8B-Instruct-Turbo',
  LLAMA_3_1_70B_INSTRUCT_TURBO: 'Meta-Llama-3.1-70B-Instruct-Turbo',
  LLAMA_3_1_405B_INSTRUCT_TURBO: 'Meta-Llama-3.1-405B-Instruct-Turbo',
  LLAMA_3_1_SONAR_LARGE_128K_ONLINE: 'llama-3.1-sonar-large-128k-online',
} as const;

export const ProviderModelMap = {
  [SupportedProvider.OPENAI]: [
    SupportedModel.GPT_3_5_TURBO,
    SupportedModel.GPT_3_5_TURBO_0125,
    SupportedModel.GPT_4,
    SupportedModel.GPT_4_0613,
    SupportedModel.GPT_4_1106_PREVIEW,
    SupportedModel.GPT_4_TURBO,
    SupportedModel.GPT_4_TURBO_PREVIEW,
    SupportedModel.GPT_4_TURBO_2024_04_09,
    SupportedModel.GPT_4O_2024_05_13,
    SupportedModel.GPT_4O_2024_08_06,
    SupportedModel.GPT_4O,
    SupportedModel.GPT_4O_MINI_2024_07_18,
    SupportedModel.GPT_4O_MINI,
    SupportedModel.GPT_4_0125_PREVIEW,
    SupportedModel.O1_PREVIEW,
    SupportedModel.O1_PREVIEW_2024_09_12,
    SupportedModel.O1_MINI,
    SupportedModel.O1_MINI_2024_09_12,
  ],
  [SupportedProvider.ANTHROPIC]: [
    SupportedModel.CLAUDE_2_1,
    SupportedModel.CLAUDE_3_OPUS_20240229,
    SupportedModel.CLAUDE_3_SONNET_20240229,
    SupportedModel.CLAUDE_3_5_SONNET_20240620,
    SupportedModel.CLAUDE_3_HAIKU_20240307,
  ],
  [SupportedProvider.GOOGLE]: [
    SupportedModel.GEMINI_PRO,
    SupportedModel.GEMINI_1_PRO_LATEST,
    SupportedModel.GEMINI_15_PRO_LATEST,
    SupportedModel.GEMINI_15_PRO_EXP_0801,
    SupportedModel.GEMINI_15_FLASH_LATEST,
  ],
  [SupportedProvider.MISTRAL]: [
    SupportedModel.MISTRAL_LARGE_LATEST,
    SupportedModel.MISTRAL_LARGE_2407,
    SupportedModel.MISTRAL_LARGE_2402,
    SupportedModel.MISTRAL_MEDIUM_LATEST,
    SupportedModel.MISTRAL_SMALL_LATEST,
    SupportedModel.CODESTRAL_LATEST,
    SupportedModel.OPEN_MISTRAL_7B,
    SupportedModel.OPEN_MIXTRAL_8X7B,
    SupportedModel.OPEN_MIXTRAL_8X22B,
  ],
  [SupportedProvider.PERPLEXITY]: [
    SupportedModel.LLAMA_3_1_SONAR_LARGE_128K_ONLINE,
  ],
  [SupportedProvider.TOGETHER]: [
    SupportedModel.MISTRAL_7B_INSTRUCT_V0_2,
    SupportedModel.MIXTRAL_8X7B_INSTRUCT_V0_1,
    SupportedModel.MIXTRAL_8X22B_INSTRUCT_V0_1,
    SupportedModel.LLAMA_3_70B_CHAT_HF,
    SupportedModel.LLAMA_3_8B_CHAT_HF,
    SupportedModel.QWEN2_72B_INSTRUCT,
    SupportedModel.LLAMA_3_1_8B_INSTRUCT_TURBO,
    SupportedModel.LLAMA_3_1_70B_INSTRUCT_TURBO,
    SupportedModel.LLAMA_3_1_405B_INSTRUCT_TURBO,
  ],
} as const;

type ProviderModelMapType = typeof ProviderModelMap;
type SupportedProviderType = keyof ProviderModelMapType;
type ModelForProvider<T extends SupportedProviderType> =
  ProviderModelMapType[T][number];

export interface Provider<
  T extends SupportedProviderType = SupportedProviderType,
> {
  provider: T;
  model: ModelForProvider<T>;
  contextLength?: number;
  inputPrice?: number;
  outputPrice?: number;
  latency?: number;
  isCustom?: boolean;
}
