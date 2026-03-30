import { GoogleGenAI, Type } from "@google/genai";
import { Term } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function searchAI(query: string): Promise<Term | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Define el siguiente término jurídico: "${query}". Responde estrictamente en formato JSON con los campos: word, definition, etymology, example, synonyms (array), category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            definition: { type: Type.STRING },
            etymology: { type: Type.STRING },
            example: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
          },
          required: ["word", "definition", "example", "synonyms", "category"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      id: `ai-${Date.now()}`,
    };
  } catch (error) {
    console.error("Error searching with AI:", error);
    return null;
  }
}

export async function generateDefinition(word: string): Promise<Partial<Term> | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Proporciona una definición jurídica completa para el término: "${word}". Responde en JSON con: definition, etymology, example, synonyms (array), category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            etymology: { type: Type.STRING },
            example: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
          },
          required: ["definition", "example", "synonyms", "category"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating definition:", error);
    return null;
  }
}

export async function generateResourceAI(codeName: string): Promise<any | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera un objeto JSON para un recurso legal nicaragüense llamado "${codeName}". 
      Debe tener este formato: { "title": string, "description": string, "type": "Code" | "Procedural" | "Constitution", "content": string, "importantArticles": [{ "number": string, "summary": string }] }. 
      Asegúrate de que la información sea verídica para Nicaragua.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["Code", "Procedural", "Constitution"] },
            content: { type: Type.STRING },
            importantArticles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["number", "summary"]
              }
            }
          },
          required: ["title", "description", "type", "content", "importantArticles"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating resource with AI:", error);
    return null;
  }
}

export async function generateOrganizationAI(name: string): Promise<any | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera un objeto JSON para una organización nicaragüense llamada "${name}". 
      Debe tener este formato: { "name": string, "fullName": string, "description": string, "importance": string }. 
      Asegúrate de que la información sea verídica para Nicaragua.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            fullName: { type: Type.STRING },
            description: { type: Type.STRING },
            importance: { type: Type.STRING },
          },
          required: ["name", "fullName", "description", "importance"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating organization with AI:", error);
    return null;
  }
}

export async function generateTerminologyAI(term: string): Promise<any | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera un objeto JSON para un término de terminología legal local nicaragüense llamado "${term}". 
      Debe tener este formato: { "term": string, "definition": string, "context": string }. 
      Asegúrate de que la información sea verídica para Nicaragua.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING },
            context: { type: Type.STRING },
          },
          required: ["term", "definition", "context"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating terminology with AI:", error);
    return null;
  }
}

export async function researchArticlesAI(title: string, topic: string): Promise<any | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Investiga y proporciona artículos clave sobre "${topic}" dentro del recurso legal: "${title}". 
      Responde en formato JSON con una lista de artículos: { "articles": [{ "number": string, "summary": string }] }. 
      Asegúrate de que la información sea verídica para Nicaragua.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["number", "summary"]
              }
            }
          },
          required: ["articles"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error researching articles with AI:", error);
    return null;
  }
}
