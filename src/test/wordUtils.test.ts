import { processText } from "../utils/wordUtils";

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

    it("should handle long text efficiently", () => {
      const longText = "word ".repeat(1000) + "different ".repeat(500);
      const result = processText(longText);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("word");
      expect(result[0].weight).toBe(1000);
      expect(result[1].text).toBe("different");
      expect(result[1].weight).toBe(500);
    });
  });
});
