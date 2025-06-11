import { GoogleGenAI, GenerateContentResponse, Candidate, GroundingChunkWeb } from "@google/genai";
import { GeminiAnalysisResult } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not found.");
    throw new Error("Gemini API Key not configured. Please set the API_KEY environment variable.");
  }
  return apiKey;
};

// Ensure API key is available or throw an error early
let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: getApiKey() });
} catch (e: any) {
  console.error("Failed to initialize GoogleGenAI:", e.message);
  // You might want to have a fallback or a way to signal this error to the UI globally
}


const parseJsonFromString = <T,>(jsonString: string): T | null => {
  let cleanJsonString = jsonString.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanJsonString.match(fenceRegex);
  if (match && match[2]) {
    cleanJsonString = match[2].trim();
  }
  try {
    return JSON.parse(cleanJsonString) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original string:", jsonString);
    return null; // Or throw e, or return a custom error object
  }
};


export const analyzeStickerContent = async (description: string, imageUrl?: string): Promise<GeminiAnalysisResult> => {
  if (!ai) throw new Error("Gemini AI SDK not initialized.");

  // For this example, we are primarily focusing on text analysis.
  // If imageUrl is provided, a multimodal model and different prompt structure would be needed.
  // This is a simplified version.

  const prompt = `
    Analyze the following sticker content. The sticker is described as: "${description}".
    Optionally, consider it might have an image associated (though image data is not directly processed in this text-only request).

    Provide your analysis in JSON format with the following fields:
    - "summary": A brief one-sentence summary of the sticker's theme.
    - "suggestedTags": An array of 3-5 relevant lowercase keyword tags.
    - "sentiment": Overall sentiment conveyed by the description ('Positive', 'Neutral', 'Negative').
    - "safetyRating": A conceptual safety rating ('Safe', 'Caution', 'Unsafe'). For example, if description implies violence, it's 'Unsafe'. Default to 'Safe'.
    
    Example for a "Cute happy cat sticker":
    {
      "summary": "A charming sticker featuring a joyful and adorable cat.",
      "suggestedTags": ["cat", "cute", "happy", "animal", "pet"],
      "sentiment": "Positive",
      "safetyRating": "Safe"
    }

    Now, analyze this content:
    Description: "${description}"
    ${imageUrl ? `(Image associated: ${imageUrl} - note: analyze based on description for now)` : ''}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // For tasks like this, enabling thinking is usually better for quality.
        // If low latency was critical (e.g. game AI), you might disable it.
        // thinkingConfig: { thinkingBudget: 0 } // Disable thinking for lower latency
      }
    });

    const parsedResult = parseJsonFromString<Partial<GeminiAnalysisResult>>(response.text);
    
    if (!parsedResult) {
        return { error: "Failed to parse analysis from Gemini response." };
    }
    
    const candidate: Candidate | undefined = response.candidates?.[0];
    const sources: GroundingChunkWeb[] = candidate?.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter((web): web is GroundingChunkWeb => web !== undefined) || [];

    return { ...parsedResult, sources };

  } catch (error: any) {
    console.error('Error calling Gemini API for content analysis:', error);
    return { error: error.message || 'Unknown error analyzing content.' };
  }
};


export const generateStickerDescription = async (stickerName: string, keywords?: string): Promise<string> => {
  if (!ai) throw new Error("Gemini AI SDK not initialized.");

  const prompt = `
    Generate a catchy and appealing product description for a sticker.
    Sticker Name: "${stickerName}"
    ${keywords ? `Keywords/Themes: "${keywords}"` : ""}

    The description should be 1-2 sentences long, highlighting its appeal.
    Be creative and engaging. Do not include the sticker name in the description itself unless it flows very naturally.
    Focus on what makes the sticker desirable.

    Example for Sticker Name: "Cosmic Voyager", Keywords: "space, astronaut, adventure":
    "Embark on an interstellar journey! This vibrant sticker captures the thrill of exploration, perfect for adventurers and dreamers."

    Now, generate a description for:
    Sticker Name: "${stickerName}"
    ${keywords ? `Keywords/Themes: "${keywords}"` : ""}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error: any) {
    console.error('Error calling Gemini API for description generation:', error);
    throw new Error(error.message || 'Unknown error generating description.');
  }
};

// Example of using Google Search Grounding (conceptual, adjust prompt as needed)
export const getInfoWithGoogleSearch = async (query: string): Promise<GeminiAnalysisResult> => {
  if (!ai) throw new Error("Gemini AI SDK not initialized.");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL, // Or a model that explicitly supports search well
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        // DO NOT add responseMimeType: "application/json" when using googleSearch tool
      },
    });

    const textResponse = response.text;
    const candidate: Candidate | undefined = response.candidates?.[0];
    const sources: GroundingChunkWeb[] = candidate?.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter((web): web is GroundingChunkWeb => web !== undefined) || [];
        
    return { summary: textResponse, sources };

  } catch (error: any)
  {
    console.error('Error calling Gemini API with Google Search:', error);
    return { error: error.message || 'Unknown error with Google Search grounding.' };
  }
};