import { describe, it, expect, beforeEach, vi } from "vitest";
import { processText, WordFrequency } from "../utils/wordUtils";

// Integration tests that test multiple components working together
describe("Word Cloud Application Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process text and calculate statistics correctly", () => {
    const input =
      "The quick brown fox jumps over the lazy dog. The fox is quick and brown.";
    const result = processText(input);

    // Verify word processing
    expect(result.length).toBeGreaterThan(0);

    // Check most frequent word
    const mostFrequent = result[0];
    expect(["the", "fox", "quick", "brown"].includes(mostFrequent.text)).toBe(
      true
    );

    // Verify total word count calculation
    const totalWords = result.reduce((sum, word) => sum + word.weight, 0);
    expect(totalWords).toBeGreaterThan(0);

    // Verify font size scaling
    result.forEach((word: WordFrequency) => {
      expect(word.size).toBeGreaterThanOrEqual(20);
      expect(word.size).toBeLessThanOrEqual(80);
    });
  });

  it("should handle edge cases gracefully", () => {
    // Test empty string
    expect(processText("")).toEqual([]);

    // Test only short words
    expect(processText("a an the is")).toEqual([
      {
        size: 20,
        text: "the",
        weight: 1,
      },
    ]);

    // Test only punctuation
    expect(processText("!@#$%^&*()")).toEqual([]);

    // Test mixed case and punctuation
    const result = processText("Hello, WORLD! hello world.");
    expect(result.length).toBe(2);
    expect(result[0].weight).toBe(2); // Both "hello" instances
    expect(result[1].weight).toBe(2); // Both "world" instances
  });

  it("should maintain data consistency across operations", () => {
    const input = "test word test word test";
    const result = processText(input);

    // Verify data structure integrity
    result.forEach((word: WordFrequency) => {
      expect(word).toHaveProperty("text");
      expect(word).toHaveProperty("size");
      expect(word).toHaveProperty("weight");
      expect(typeof word.text).toBe("string");
      expect(typeof word.size).toBe("number");
      expect(typeof word.weight).toBe("number");
    });

    // Verify sorting is maintained
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].weight).toBeGreaterThanOrEqual(result[i + 1].weight);
    }
  });

  it("should handle large text inputs efficiently", () => {
    // Generate large input
    const largeWords = Array.from({ length: 1000 }, (_, i) => `word${i % 100}`);
    const largeInput = largeWords.join(" ");

    const startTime = Date.now();
    const result = processText(largeInput);
    const endTime = Date.now();

    // Should complete within reasonable time (less than 1 second)
    expect(endTime - startTime).toBeLessThan(1000);

    // Should return reasonable number of unique words
    expect(result.length).toBeLessThanOrEqual(100);

    // Each word should appear 10 times (1000 total words / 100 unique)
    result.forEach((word: WordFrequency) => {
      expect(word.weight).toBe(10);
    });
  });

  it.skip("should handle unicode and special characters", () => {
    const unicodeInput = "café naïve résumé café naïve";
    const result = processText(unicodeInput);

    expect(result.length).toBe(3);
    expect(result.some((w: WordFrequency) => w.text === "café")).toBe(true);
    expect(result.some((w: WordFrequency) => w.text === "naïve")).toBe(true);
    expect(result.some((w: WordFrequency) => w.text === "résumé")).toBe(true);
  });
});
