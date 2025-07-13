// Define types for word frequency
export interface WordFrequency {
  text: string;
  size: number;
  weight: number;
}

export const processText = (text: string): WordFrequency[] => {
  if (!text.trim()) return [];

  // Convert to lowercase and remove punctuation
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter out very short words

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
};
