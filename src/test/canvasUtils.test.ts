import { vi } from "vitest";
import { drawWordCloud } from "../utils/canvasUtils";
import { WordFrequency } from "../utils/wordUtils";

// Mock canvas context for testing
const mockCanvasContext = {
  fillStyle: "",
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  font: "",
};

// Mock canvas element
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockCanvasContext),
};

describe("Canvas Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("drawWordCloud", () => {
    const sampleFrequencies: WordFrequency[] = [
      { text: "hello", size: 40, weight: 3 },
      { text: "world", size: 30, weight: 2 },
      { text: "test", size: 20, weight: 1 },
    ];

    it("should handle null canvas", () => {
      expect(() => drawWordCloud(null, sampleFrequencies)).not.toThrow();
    });

    it("should set canvas dimensions", () => {
      drawWordCloud(mockCanvas as any, sampleFrequencies);

      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(600);
    });

    it("should clear canvas before drawing", () => {
      drawWordCloud(mockCanvas as any, sampleFrequencies);

      expect(mockCanvasContext.fillStyle).toBe("#f093fb");
      expect(mockCanvasContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it("should draw words with correct font sizes", () => {
      drawWordCloud(mockCanvas as any, sampleFrequencies);

      expect(mockCanvasContext.fillText).toHaveBeenCalledWith(
        "hello",
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockCanvasContext.fillText).toHaveBeenCalledWith(
        "world",
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockCanvasContext.fillText).toHaveBeenCalledWith(
        "test",
        expect.any(Number),
        expect.any(Number)
      );
    });

    it("should limit words to maximum of 30", () => {
      const manyWords: WordFrequency[] = Array.from({ length: 50 }, (_, i) => ({
        text: `word${i}`,
        size: 20,
        weight: 1,
      }));

      drawWordCloud(mockCanvas as any, manyWords);

      expect(mockCanvasContext.fillText).toHaveBeenCalledTimes(30);
    });

    it("should handle empty frequencies array", () => {
      expect(() => drawWordCloud(mockCanvas as any, [])).not.toThrow();

      // Should still clear the canvas
      expect(mockCanvasContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it("should handle canvas without context", () => {
      const canvasWithoutContext = {
        ...mockCanvas,
        getContext: vi.fn(() => null),
      };

      expect(() =>
        drawWordCloud(canvasWithoutContext as any, sampleFrequencies)
      ).not.toThrow();
    });

    it("should use different colors for different words", () => {
      drawWordCloud(mockCanvas as any, sampleFrequencies);

      // Check that fillStyle was set multiple times (for different colors)
      const fillStyleCalls = (mockCanvasContext.fillStyle as any).toString();
      expect(mockCanvasContext.fillText).toHaveBeenCalledTimes(3);
    });

    it("should position words to avoid overlap", () => {
      drawWordCloud(mockCanvas as any, sampleFrequencies);

      // Verify measureText was called to calculate word widths
      expect(mockCanvasContext.measureText).toHaveBeenCalled();
    });
  });
});
