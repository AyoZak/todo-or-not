import { GoogleGenerativeAI } from "@google/generative-ai";

interface RateLimiter {
  requests: number[];
  dailyRequests: number;
  lastReset: number;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private primaryModel = "gemini-2.0-flash-exp";
  private fallbackModel = "gemini-2.0-flash-lite";
  private rateLimiter: RateLimiter = {
    requests: [],
    dailyRequests: 0,
    lastReset: Date.now()
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyADEnJLZoS93f0ef1PHNFItfnr219fTBt4";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private checkRateLimit(): { canProceed: boolean; useFallback: boolean } {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    // Reset daily counter if needed
    if (now - this.rateLimiter.lastReset > oneDay) {
      this.rateLimiter.dailyRequests = 0;
      this.rateLimiter.lastReset = now;
    }

    // Clean old requests (older than 1 minute)
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      timestamp => now - timestamp < oneMinute
    );

    // Check daily limit
    if (this.rateLimiter.dailyRequests >= 50) {
      return { canProceed: false, useFallback: false };
    }

    // Check per-minute limit for primary model
    if (this.rateLimiter.requests.length >= 9) {
      return { canProceed: true, useFallback: true };
    }

    return { canProceed: true, useFallback: false };
  }

  async enhanceTask(taskText: string, enhancementType: string): Promise<string> {
    const { canProceed, useFallback } = this.checkRateLimit();

    if (!canProceed) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    const modelName = useFallback ? this.fallbackModel : this.primaryModel;
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const prompts = {
      "general": `Rewrite this text to be clear and professional. Do not include any explanations, options, or additional text. Return only the rewritten version:\n\n"${taskText}"`,
      "spec": `As a product manager, convert this into a technical specification with requirements and acceptance criteria. Return only the specification, no explanations:\n\n"${taskText}"`,
      "bug": `As an IT specialist, format this as a bug report with steps to reproduce, expected vs actual behavior. Return only the bug report, no explanations:\n\n"${taskText}"`,
      "prompt": `Convert this into an optimized AI prompt. Return only the prompt, no explanations:\n\n"${taskText}"`
    };

    const prompt = prompts[enhancementType as keyof typeof prompts] || prompts["general"];

    try {
      // Track the request
      this.rateLimiter.requests.push(Date.now());
      this.rateLimiter.dailyRequests++;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to enhance task. Please try again.");
    }
  }
}

export const geminiService = new GeminiService();