import { GoogleGenAI } from "@google/genai";
import { QuoteResult, QuoteRequest, OPTIONAL_COVERS } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiChatResponse = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!ai) return "AI service is not configured. Please check your API key.";

  try {
    const model = 'gemini-1.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [{
          text: `
                You are a helpful, professional, and knowledgeable insurance agent for "Rommaana Home Insurance".
                Your goal is to explain home insurance concepts clearly to customers in Saudi Arabia.
                
                Key Product Rules (Use these to answer):
                - We cover Owners and Tenants.
                - We offer 4 tiers of schemes (A, B, C, D) based on coverage limits.
                - Coverage includes Building (for owners) and Contents.
                - Optional extras: Jewellery, Paintings, Emergency Purchase, Alternative Accommodation.
                
                Keep answers concise (under 100 words unless detailed explanation is asked).
                Do not invent pricing. If asked for a price, tell them to use the Quote Calculator on the left.
            `
        }]
      },
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model,
      contents: contents,
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the AI agent right now. Please try again.";
  }
};

export const generateQuoteSummary = async (request: QuoteRequest, result: QuoteResult): Promise<string> => {
  if (!ai) return "AI Summary unavailable.";

  try {
    const optionsList = request.selectedOptions.map(o => OPTIONAL_COVERS[o]).join(", ");
    const prompt = `
            Generate a friendly, persuasive 2-sentence summary for a customer who just received a home insurance quote.
            
            Details:
            - Type: ${request.userType}
            - Plan: ${result.schemeName}
            - Extras: ${optionsList || 'None'}
            - Total Premium: SAR ${result.totalPremium}
            
            The tone should be reassuring and professional. Mention that Rommaana Insurance provides peace of mind.
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text || "Protect your home with confidence.";
  } catch (e) {
    console.error("Gemini Summary Error:", e);
    return "Thank you for choosing Rommaana.";
  }
}