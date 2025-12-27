
import { GoogleGenAI, Type } from "@google/genai";
import { Book, Level, Word } from "../types";

export async function generateWords(book: Book, level: Level, count: number): Promise<Word[]> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a list of ${count} English vocabulary words from the novel "${book}".
    The words should be suitable for an "${level}" level English learner.
    For each word, provide the following information in a JSON format:
    1. 'word': The English word itself.
    2. 'pronunciation': The phonetic spelling (IPA).
    3. 'translation': A simple Chinese translation.

    Return the response as a JSON array of objects.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: {
                type: Type.STRING,
                description: 'The English word.',
              },
              pronunciation: {
                type: Type.STRING,
                description: 'The phonetic spelling (IPA).',
              },
              translation: {
                type: Type.STRING,
                description: 'A simple Chinese translation.',
              },
            },
            required: ["word", "pronunciation", "translation"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedWords = JSON.parse(jsonString);

    if (!Array.isArray(parsedWords)) {
        throw new Error("API did not return a valid array.");
    }

    return parsedWords.map((w, index) => ({
      ...w,
      id: `${w.word}-${index}`,
    }));

  } catch (error) {
    console.error("Error generating words with Gemini:", error);
    if(error instanceof Error && error.message.includes('json')){
       throw new Error("Failed to parse the word list from the AI. Please try again.");
    }
    throw new Error("Could not generate word list. Please check your API key and network connection.");
  }
}
