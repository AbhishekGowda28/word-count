import {
  validateInput,
  sanitizeText,
  rateLimitCheck,
  MAX_WORDS_PROCESSED,
} from "./securityUtils";

// Define types for word frequency
export interface WordFrequency {
  text: string;
  size: number;
  weight: number;
}

export const processText = (text: string): WordFrequency[] => {
  try {
    // Security validations
    if (!rateLimitCheck()) {
      throw new Error(
        "Processing rate limit exceeded. Please wait before trying again."
      );
    }

    const validatedText = validateInput(text);
    if (!validatedText.trim()) return [];

    const sanitizedText = sanitizeText(validatedText);

    // Convert to lowercase and remove punctuation
    const words = sanitizedText
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2); // Filter out very short words

    // Security: Limit number of words processed
    if (words.length > MAX_WORDS_PROCESSED) {
      throw new Error(
        `Too many words to process. Maximum ${MAX_WORDS_PROCESSED} words allowed.`
      );
    }

    // Count word frequencies
    const wordCount: { [key: string]: number } = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Convert to array and sort by frequency
    const frequencies = Object.entries(wordCount)
      .map(([text, weight]) => ({
        text,
        size: Math.min(Math.max(weight * 20, 20), 80), // Scale size between 20-80px
        weight,
      }))
      .sort((a, b) => b.weight - a.weight);

    return frequencies;
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};
