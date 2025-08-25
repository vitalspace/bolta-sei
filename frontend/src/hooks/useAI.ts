import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { writable } from 'svelte/store';

interface AIContext {
  type: 'clan_naming' | 'game_guide' | 'purchase_advisor' | 'general';
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  isStreaming: boolean;
  error?: string;
}

class AIService {
  private cerebras: Cerebras;
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_CEREBRAS_API_KEY || '';
    this.model = import.meta.env.VITE_CEREBRAS_MODEL || 'gpt-oss-120b';
    
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.error('❌ CEREBRAS_API_KEY not properly configured!');
    }
    
    this.cerebras = new Cerebras({
      apiKey: this.apiKey
    });
  }

  private getContextPrompt(context: AIContext['type'], userInput?: string): string {
    const prompts = {
      clan_naming: `You are a creative AI assistant specialized in generating epic clan names for a cyberpunk metaverse game. 

Your task is to suggest clan names and acronyms that are:
- Futuristic and cyberpunk-themed
- Memorable and impactful
- Suitable for gaming communities
- Between 3-20 characters for names
- 2-5 characters for acronyms

Always respond in JSON format with this structure:
{
  "suggestions": [
    {
      "name": "Clan Name",
      "acronym": "ACR",
      "description": "Brief description of the clan theme"
    }
  ]
}

Provide 3-5 suggestions per request. Make them diverse in style and theme.`,
      
      game_guide: `You are a helpful game guide AI for a cyberpunk metaverse. Help players understand game mechanics, strategies, and provide tips for better gameplay. Be concise but informative.`,
      
      purchase_advisor: `You are a metaverse purchase advisor AI. Help users make informed decisions about virtual assets, properties, and items. Consider value, utility, and market trends in your recommendations.`,
      
      general: `You are a helpful AI assistant. Provide clear, concise, and accurate responses to user queries.`
    };

    return prompts[context] || prompts.general;
  }

  async generateResponse(
    context: AIContext,
    userMessage: string,
    onStream?: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        throw new Error('API key not configured. Please update your .env file with a valid CEREBRAS_API_KEY.');
      }

      const systemPrompt = context.systemPrompt || this.getContextPrompt(context.type, userMessage);
      
      const stream = await this.cerebras.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        model: this.model,
        stream: true,
        max_completion_tokens: context.maxTokens || 1000,
        temperature: context.temperature || 0.8,
        top_p: 1
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          if (onStream) {
            onStream(content);
          }
        }
      }

      return {
        content: fullContent,
        isStreaming: false
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: '',
        isStreaming: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateClanSuggestions(preferences?: string): Promise<any[]> {
    const userMessage = preferences 
      ? `Generate clan name suggestions based on these preferences: ${preferences}`
      : 'Generate diverse cyberpunk clan name suggestions for a metaverse game';

    const response = await this.generateResponse(
      { type: 'clan_naming' },
      userMessage
    );

    if (response.error) {
      throw new Error(response.error);
    }

    try {
      const parsed = JSON.parse(response.content);
      const suggestions = parsed.suggestions || [];
      return suggestions;
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return [
        {
          name: 'Neon Phantoms',
          acronym: 'NP',
          description: 'Stealthy cyberpunk warriors'
        },
        {
          name: 'Digital Rebels',
          acronym: 'DR',
          description: 'Fighting against the system'
        },
        {
          name: 'Chrome Syndicate',
          acronym: 'CS',
          description: 'Elite tech-enhanced collective'
        }
      ];
    }
  }
}

// Singleton instance
const aiService = new AIService();

export function useAI() {
  const response = writable<AIResponse>({ content: '', isStreaming: false });
  const isLoading = writable(false);

  const generateResponse = async (
    context: AIContext,
    message: string,
    onStream?: (chunk: string) => void
  ) => {
    isLoading.set(true);
    response.set({ content: '', isStreaming: true });

    try {
      const result = await aiService.generateResponse(context, message, (chunk) => {
        response.update(current => ({
          ...current,
          content: current.content + chunk
        }));
        if (onStream) onStream(chunk);
      });

      response.set(result);
      return result;
    } catch (error) {
      const errorResponse = {
        content: '',
        isStreaming: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      response.set(errorResponse);
      return errorResponse;
    } finally {
      isLoading.set(false);
    }
  };

  const generateClanSuggestions = async (preferences?: string) => {
    isLoading.set(true);
    try {
      return await aiService.generateClanSuggestions(preferences);
    } catch (error) {
      throw error;
    } finally {
      isLoading.set(false);
    }
  };

  return {
    response,
    isLoading,
    generateResponse,
    generateClanSuggestions
  };
}

export type { AIContext, AIResponse };