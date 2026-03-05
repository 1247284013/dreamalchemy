
import { GoogleGenAI, Type } from "@google/genai";
import { DreamAnalysis, ScenarioId, TransformationRecord, DeepAnalysis, GameSummary } from "../types";
import {
  SELECT_CHARACTERS,
  SELECT_CHARACTER_IDS,
  SELECT_CHARACTER_IMAGE_MAP,
  SELECT_CHARACTER_NAME_MAP
} from "../characterCatalog";

const getApiKey = () =>
  import.meta.env.VITE_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY ||
  'AIzaSyCZwwbtXaqRmL5cT3pGsu80wcaC53EmTqk';

const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in version1/.env.local');
  }
  return new GoogleGenAI({ apiKey });
};

const characterImageMap = SELECT_CHARACTER_IMAGE_MAP as Record<string, string>;

const normalizeCharacterId = (raw: unknown): string => {
  const s = String(raw ?? '').trim().toLowerCase();
  if (!s) return '';
  // normalize spaces/hyphens → underscore, remove punctuation
  const cleaned = s
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');

  const alias: Record<string, string> = {
    'attendance': 'attendance_machine',
    'attendance_machine': 'attendance_machine',
    'attendance_machine_': 'attendance_machine',
    'clock': 'wall_clock',
    'wallclock': 'wall_clock',
    'wall_clock': 'wall_clock',
    'computer': 'computer',
    'filebox': 'file_box',
    'file_box': 'file_box',
    'file_cabinet': 'file_cabinet',
    'filecabinet': 'file_cabinet',
    'folder': 'folder',
    'light': 'light',
    'plant': 'plant',
    'printer': 'printer',
    'table': 'table',
    'chair': 'chair'
  };

  return alias[cleaned] || cleaned;
};

const isValidCharacterId = (id: string) =>
  (SELECT_CHARACTER_IDS as unknown as string[]).includes(id);

export const analyzeDream = async (userText: string): Promise<DreamAnalysis> => {
  // If no input, return a default
  if (!userText || userText.trim().length === 0) {
    return {
      scenarioId: ScenarioId.D,
      healingMessage: "Even in silence, the mind seeks peace. Let us find the light within the quiet.",
      keywords: ["silence", "peace", "calm"],
      recommendedCharacters: [
        { id: 'chair', name: SELECT_CHARACTER_NAME_MAP['chair'], reason: 'A grounded place to rest', image: characterImageMap['chair'] },
        { id: 'computer', name: SELECT_CHARACTER_NAME_MAP['computer'], reason: 'Untangle thoughts into order', image: characterImageMap['computer'] },
        { id: 'folder', name: SELECT_CHARACTER_NAME_MAP['folder'], reason: 'Contain and sort your feelings', image: characterImageMap['folder'] }
      ]
    };
  }

  const prompt = `
    You are a dream interpreter for a therapeutic game. 
    Analyze this dream: "${userText}".
    
    Classify it into EXACTLY ONE of these 4 archetypes:
    A: Abandoned Classroom (Exams, judgment, school, failure, crowds, performance).
    B: Endless Forest (Being chased, animals, nature, lost, running, hiding).
    C: Abyss/Fall (Falling, elevators, heights, losing control, crashing, drowning).
    D: Lonely Room (Isolation, trapped, home, rain, childhood, sadness, waiting).

    If it doesn't fit perfectly, choose the closest emotional match (e.g., Anxiety -> A, Fear -> B, Loss of Control -> C, Sadness -> D).

    AVAILABLE CHARACTERS (the player can embody one of these in the game):
    ${SELECT_CHARACTERS.map((c) => `- ${c.id}: ${c.meaning}`).join('\n    ')}

    Based on the dream content, recommend 3 characters that best match the dream's themes and emotions.
    Order them from MOST relevant to LEAST relevant.
    Provide a SHORT reason (max 10 words) for each recommendation.

    Output JSON with:
    1. scenarioId: "A", "B", "C", or "D".
    2. healingMessage: A short, poetic phrase (max 20 words) to help the user rewrite this memory.
    3. keywords: 3 visual nouns from the dream.
    4. recommendedCharacters: Array of 3 objects with { id: string, name: string, reason: string }.
       - id MUST be one of: ${SELECT_CHARACTER_IDS.map((x) => `"${x}"`).join(', ')}
       - name: Display name for the character
       - reason: Short explanation (max 10 words) why this fits the dream
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioId: {
              type: Type.STRING,
              enum: ['A', 'B', 'C', 'D']
            },
            healingMessage: {
              type: Type.STRING
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedCharacters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.STRING,
                    enum: SELECT_CHARACTER_IDS as unknown as string[]
                  },
                  name: {
                    type: Type.STRING
                  },
                  reason: {
                    type: Type.STRING
                  }
                },
                required: ['id', 'name', 'reason']
              }
            }
          },
          required: ['scenarioId', 'healingMessage', 'keywords', 'recommendedCharacters']
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    const result = JSON.parse(jsonText);
    
    // Map string to Enum
    const scenarioMap: Record<string, ScenarioId> = {
      'A': ScenarioId.A,
      'B': ScenarioId.B,
      'C': ScenarioId.C,
      'D': ScenarioId.D
    };

    const recommendedCharacters = result.recommendedCharacters.map((char: any) => ({
      id: (() => {
        const normalized = normalizeCharacterId(char.id ?? char.name);
        return isValidCharacterId(normalized) ? normalized : 'chair';
      })(),
      name: (() => {
        const normalized = normalizeCharacterId(char.id ?? char.name);
        const id = isValidCharacterId(normalized) ? normalized : 'chair';
        return (SELECT_CHARACTER_NAME_MAP as Record<string, string>)[id] || char.name || 'Chair';
      })(),
      reason: char.reason,
      image: (() => {
        const normalized = normalizeCharacterId(char.id ?? char.name);
        const id = isValidCharacterId(normalized) ? normalized : 'chair';
        return characterImageMap[id] || characterImageMap['chair'];
      })()
    }));

    return {
      scenarioId: scenarioMap[result.scenarioId] || ScenarioId.D,
      healingMessage: result.healingMessage,
      keywords: result.keywords,
      recommendedCharacters
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback to Home/Room (D) as user likely has assets there
    return {
      scenarioId: ScenarioId.D,
      healingMessage: "The room is quiet now. The storm has passed.",
      keywords: ["home", "safe", "quiet"],
      recommendedCharacters: [
        { id: 'chair', name: SELECT_CHARACTER_NAME_MAP['chair'], reason: 'Find comfort in rest', image: characterImageMap['chair'] },
        { id: 'plant', name: SELECT_CHARACTER_NAME_MAP['plant'], reason: 'Let healing grow slowly', image: characterImageMap['plant'] },
        { id: 'light', name: SELECT_CHARACTER_NAME_MAP['light'], reason: 'Bring clarity to the dark', image: characterImageMap['light'] }
      ]
    };
  }
};

// Good items (dataset-driven).
// IMPORTANT: we prefix ids with "good_" to avoid texture-key collisions with existing character/object ids.
// Keep this list in sync with files under: version1/public/assets/dataset/
const AVAILABLE_ITEMS = [
  {
    id: 'good_game',
    name: 'Game',
    keywords: ['game', 'play', 'fun', 'relax', '游戏', '玩', '放松', '娱乐'],
    description: 'A small game that brings lightness back.'
  },
  {
    id: 'good_magezine',
    name: 'Magazine',
    keywords: ['magazine', 'magezine', 'read', 'story', 'book', '杂志', '阅读', '故事'],
    description: 'A magazine that invites calm, gentle attention.'
  }
];

export const selectGoodItem = async (userInput: string): Promise<string> => {
  console.log('🔍 ==========================================');
  console.log('🔍 AI SELECTION STARTED');
  console.log('🔍 User wants:', userInput);
  console.log('🔍 ==========================================');
  
  // Prepare information for AI
  const itemsInfo = AVAILABLE_ITEMS.map(item => `
ID: ${item.id}
Name: ${item.name}
Description: ${item.description}
Keywords: ${item.keywords.join(', ')}
---`).join('\n');

  const prompt = `
You are an intelligent item matching system for a healing game.

USER INPUT: "${userInput}"

AVAILABLE ITEMS (You MUST choose one of these IDs):
${itemsInfo}

INSTRUCTIONS:
1. Carefully read what the user wants: "${userInput}"
2. Match the user's description to the item's Name, Description, and Keywords.
3. Choose the item that BEST matches the user's intent and emotional needs.
4. If the user asks for success, winning, or validation, choose 'trophy' or 'good_grades'.
5. If the user asks for comfort, love, or safety, choose 'teddytoy' or 'comfortable_big_bed'.
6. If the user asks for energy, fun, or play, choose 'football' or 'toy_cabinet'.

OUTPUT REQUIREMENT:
Return ONLY the item ID (e.g., "chair-good"), NO explanations, NO extra text, NO quotes, NO markdown.
Just the plain ID like: chair-good
  `;

  try {
    console.log('🤖 Calling Gemini AI...');
    console.log('🤖 Model: gemini-2.5-flash');
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const rawResponse = response.text.trim();
    console.log('📥 ==========================================');
    console.log('📥 AI RAW RESPONSE:', rawResponse);
    console.log('📥 ==========================================');
    
    // Clean response: keep only allowed characters (letters, numbers, hyphens, spaces, underscores)
    let selectedItem = rawResponse.toLowerCase().trim();
    // Remove potential markdown code blocks or quotes
    selectedItem = selectedItem.replace(/```/g, '').replace(/"/g, '').replace(/'/g, '').trim();

    console.log('🔧 Cleaned item ID:', selectedItem);
    
    // Validate that the selected item exists in our list
    const validItem = AVAILABLE_ITEMS.find(item => item.id === selectedItem);
    
    if (validItem) {
      console.log('✅ ==========================================');
      console.log('✅ VALID ITEM SELECTED!');
      console.log('✅ ID:', validItem.id);
      console.log('✅ Name:', validItem.name);
      console.log('✅ ==========================================');
      return validItem.id;
    }
    
    console.warn('⚠️ AI selected invalid item:', selectedItem);
    console.warn('⚠️ This ID does not exist in our list!');
    
    // Try partial match
    const match = AVAILABLE_ITEMS.find(item => 
      selectedItem.includes(item.id) || item.id.includes(selectedItem)
    );
    if (match) {
      console.log('✅ Partial match found!');
      console.log('✅ Using:', match.id, '-', match.name);
      return match.id;
    }
    
    // Final fallback
    console.warn('⚠️ No match found, using keyword fallback');
    return keywordFallback(userInput);
    
  } catch (error) {
    console.error("❌ AI selection failed:", error);
    console.error("❌ Error details:", error);
    return keywordFallback(userInput);
  }
};

// Export name lookup for display in report
export const getGoodItemName = (id: string): string => {
  const item = AVAILABLE_ITEMS.find(i => i.id === id);
  return item ? item.name : id;
};

// Fallback keyword matching — only returns IDs that exist in AVAILABLE_ITEMS
const keywordFallback = (userInput: string): string => {
  const input = userInput.toLowerCase();
  if (
    input.includes('read') || input.includes('book') || input.includes('magazine') ||
    input.includes('story') || input.includes('article') || input.includes('calm') || input.includes('quiet')
  ) {
    return 'good_magezine';
  }
  // Default to game (fun, relax, play)
  return 'good_game';
};

// Deep psychological analysis based on dream + transformations
export const analyzeJourney = async (
  originalDream: string,
  transformationRecords: TransformationRecord[],
  context?: {
    scenarioId?: ScenarioId;
    selectedCharacterId?: string;
    gameSummary?: GameSummary;
  }
): Promise<DeepAnalysis> => {
  console.log('🧠 Starting deep psychological analysis...');
  console.log('Original dream:', originalDream);
  console.log('Transformations:', transformationRecords);
  console.log('Context:', context);
  
  // Build detailed prompt for AI analysis
  const transformationDetails = transformationRecords.map((record, index) => `
Transformation ${index + 1}:
- What was broken/transformed: ${record.badItem}
- What they wanted instead: ${record.goodItem}
- Why they wanted to change it: "${record.reason}"
- Recent unhappy event: "${record.recentEvent}"
`).join('\n');

  const scenarioId = context?.scenarioId;
  const selectedCharacterId = context?.selectedCharacterId;
  const game = context?.gameSummary;

  const scenarioName = (() => {
    if (game?.sceneMode === 'workspace') return 'Workplace';
    switch (scenarioId) {
      case ScenarioId.A: return 'Abandoned Classroom';
      case ScenarioId.B: return 'Endless Forest';
      case ScenarioId.C: return 'Abyss/Fall';
      case ScenarioId.D: return 'Lonely Room';
      default: return 'Unknown';
    }
  })();

  const characterLine = (() => {
    const id = String(selectedCharacterId || '').trim();
    if (!id) return 'N/A';
    const name = (SELECT_CHARACTER_NAME_MAP as Record<string, string>)[id] || id;
    const meaning = (SELECT_CHARACTERS as any[]).find((c) => c.id === id)?.meaning;
    return meaning ? `${name} (${id}) — ${meaning}` : `${name} (${id})`;
  })();

  const gameplayDetails = game
    ? `
GAMEPLAY CONTEXT (what they actually did in the run):
- sceneMode: ${game.sceneMode}
- durationMs: ${game.durationMs}
- breaks: ${game.breakCount} (by source: ${JSON.stringify(game.breakBySource || {})})
- destroyed: ${game.destroyedCount}
- transformed: ${game.transformedCount}
- destroyedObjects: ${game.destroyedObjects?.slice(0, 18).join(', ') || '[]'}
- transformedObjects: ${(game.transformedObjects || []).slice(0, 12).map((t) => `${t.from}→${t.to}`).join(', ') || '[]'}
`
    : 'GAMEPLAY CONTEXT: N/A';
  
  const prompt = `
You are a compassionate dream therapist and psychological analyst. Analyze this person's healing journey through their dream.

ORIGINAL DREAM:
"${originalDream}"

ARCHETYPE (from dream analysis):
${game?.sceneMode === 'workspace' ? `Workplace: office environment, routine, pressure, deadlines, transitions` : (scenarioId ? `${scenarioId}: ${scenarioName}` : 'Unknown')}

SELECTED FORM (what they embodied in the game):
${characterLine}

SCENE NOTE:
If the run took place in a "workspace" scene (indoor→door→outdoor), interpret it as an office-like dream setting: routine, pressure, control, deadlines, containment, and transitions.

TRANSFORMATIONS DURING THE DREAM JOURNEY:
${transformationDetails}

${gameplayDetails}

ANALYSIS TASK:
Based on the original dream, the archetype, their selected form, AND their in-game behavior (breaking vs transforming, what objects they interacted with, and pacing), provide a deep psychological analysis.

Consider:
1. What patterns emerge across their transformations?
2. What are they trying to heal or escape from?
3. What do their choices reveal about their emotional state?
4. How do their recent unhappy events connect to the dream symbols?
5. What is the deeper meaning behind what they're seeking (comfort, safety, love, etc.)?
6. If they mostly BREAK things: what might that express (anger, urgency, boundaries, clearing space)?
7. If they mostly TRANSFORM things: what might that express (reframing, repair, agency, self-compassion)?

Provide your analysis in JSON format with these fields:
{
  "psychologicalInsight": "2-3 sentences of deep psychological insight connecting their dream to their transformations",
  "emotionalPattern": "2 sentences identifying the emotional pattern or recurring theme in their journey",
  "healingGuidance": "2-3 sentences of compassionate, actionable guidance for their healing",
  "transformationSummary": "2 sentences summarizing what their transformation choices reveal about them"
}

Be warm, compassionate, non-judgmental, and insightful. Help them understand themselves better.
`;

  try {
    console.log('🤖 Calling Gemini AI for deep analysis...');
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            psychologicalInsight: { type: Type.STRING },
            emotionalPattern: { type: Type.STRING },
            healingGuidance: { type: Type.STRING },
            transformationSummary: { type: Type.STRING }
          },
          required: ['psychologicalInsight', 'emotionalPattern', 'healingGuidance', 'transformationSummary']
        }
      }
    });
    
    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    
    console.log('✅ Deep analysis complete:', result);
    return result;
    
  } catch (error) {
    console.error("❌ Deep analysis failed:", error);
    
    // Fallback analysis based on transformation count
    const count = transformationRecords.length;
    return {
      psychologicalInsight: `Through ${count} transformation${count > 1 ? 's' : ''}, you've shown remarkable willingness to reshape pain into healing. Each choice reflects your inner wisdom seeking peace.`,
      emotionalPattern: "Your transformations reveal a desire to convert sources of discomfort into sources of comfort and safety. This shows adaptive resilience.",
      healingGuidance: "Continue to identify what causes pain and imagine what would bring healing. Your subconscious is guiding you toward what you truly need.",
      transformationSummary: `You chose to transform ${count} aspect${count > 1 ? 's' : ''} of your dreamscape, showing active participation in your healing journey.`
    };
  }
};
