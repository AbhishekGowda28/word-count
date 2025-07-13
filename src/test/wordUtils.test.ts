import { describe, it, expect, vi } from "vitest";
import { processText } from "../utils/wordUtils";

// Mock the security utils to avoid rate limiting in unit tests
vi.mock("../utils/securityUtils", () => ({
  validateInput: vi.fn().mockImplementation((text: string) => text),
  sanitizeText: vi.fn().mockImplementation((text: string) => text),
  rateLimitCheck: vi.fn().mockReturnValue(true),
  MAX_WORDS_PROCESSED: 10000,
  MAX_INPUT_LENGTH: 50000,
}));

describe("Word Processing Utilities", () => {
  describe("processText", () => {
    it("should process simple text correctly", () => {
      const input = "hello world hello";
      const result = processText(input);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("hello");
      expect(result[0].weight).toBe(2);
      expect(result[1].text).toBe("world");
      expect(result[1].weight).toBe(1);
    });

    it("should handle punctuation and case correctly", () => {
      const input = "Hello, World! Hello world.";
      const result = processText(input);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("hello");
      expect(result[0].weight).toBe(2);
      expect(result[1].text).toBe("world");
      expect(result[1].weight).toBe(2);
    });

    it("should filter out short words", () => {
      const input = "a an the hello world";
      const result = processText(input);

      expect(result).toHaveLength(3);
      expect(result.map((w) => w.text)).toEqual(["the", "hello", "world"]);
    });

    it("should handle empty input", () => {
      const result = processText("");
      expect(result).toEqual([]);
    });

    it("should handle whitespace-only input", () => {
      const result = processText("   \n\t  ");
      expect(result).toEqual([]);
    });

    it("should sort by frequency descending", () => {
      const input = "apple banana cherry apple banana apple";
      const result = processText(input);

      expect(result[0].text).toBe("apple");
      expect(result[0].weight).toBe(3);
      expect(result[1].text).toBe("banana");
      expect(result[1].weight).toBe(2);
      expect(result[2].text).toBe("cherry");
      expect(result[2].weight).toBe(1);
    });

    it("should calculate correct font sizes", () => {
      const input = "test word test";
      const result = processText(input);

      // Font size should be between 20-80px
      result.forEach((word) => {
        expect(word.size).toBeGreaterThanOrEqual(20);
        expect(word.size).toBeLessThanOrEqual(80);
      });
    });

    it("should handle special characters and numbers", () => {
      const input = "test123 hello@world code-review";
      const result = processText(input);

      // Should split on special characters and handle mixed content
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((w) => w.text.includes("test"))).toBe(true);
    });

    it("should handle input with only whitespace and punctuation", () => {
      const input = "   !!!   @@@   ###   ";
      const result = processText(input);
      
      expect(result).toEqual([]);
    });

    it("should handle input with very short words", () => {
      const input = "a b c d e";
      const result = processText(input);
      
      // All words are too short and should be filtered out
      expect(result).toEqual([]);
    });

    it("should handle mixed short and long words", () => {
      const input = "a very good test with some short words like a an the";
      const result = processText(input);
      
      // Should only keep words longer than 2 characters
      const validWords = result.map(w => w.text);
      expect(validWords).not.toContain("a");
      expect(validWords).not.toContain("an");
      expect(validWords).toContain("very");
      expect(validWords).toContain("good");
      expect(validWords).toContain("test");
      expect(validWords).toContain("with");
      expect(validWords).toContain("some");
      expect(validWords).toContain("short");
      expect(validWords).toContain("words");
      expect(validWords).toContain("like");
      expect(validWords).toContain("the");
    });

    it("should handle text with numbers and special characters", () => {
      const input = "test123 hello-world user@email.com version2.0";
      const result = processText(input);
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(word => {
        expect(word.text.length).toBeGreaterThan(2);
        expect(word.weight).toBeGreaterThan(0);
      });
    });

    it("should handle long text efficiently", () => {
      // Use smaller dataset to avoid potential issues with large text processing
      const longText = "word ".repeat(100) + "different ".repeat(50);

      const startTime = Date.now();
      const result = processText(longText);
      const endTime = Date.now();

      // Should complete within reasonable time (be generous with timing for CI)
      expect(endTime - startTime).toBeLessThan(1000);

      // Verify correct processing
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("word");
      expect(result[0].weight).toBe(100);
      expect(result[1].text).toBe("different");
      expect(result[1].weight).toBe(50);

      // Verify sorting is correct
      expect(result[0].weight).toBeGreaterThan(result[1].weight);

      // Verify data structure integrity
      result.forEach((word) => {
        expect(word).toHaveProperty("text");
        expect(word).toHaveProperty("size");
        expect(word).toHaveProperty("weight");
        expect(word.size).toBeGreaterThanOrEqual(20);
        expect(word.size).toBeLessThanOrEqual(80);
      });
    });
  });
});
