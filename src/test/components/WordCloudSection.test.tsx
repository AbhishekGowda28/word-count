import { render, screen } from "@testing-library/react";
import { WordCloudSection } from "../../components/WordCloudSection";
import { WordFrequency } from "../../utils/wordUtils";
import { vi } from "vitest";

describe("WordCloudSection", () => {
  const mockWordFrequencies: WordFrequency[] = [
    { text: "hello", size: 60, weight: 3 },
    { text: "world", size: 40, weight: 2 },
  ];

  beforeEach(() => {
    // Mock canvas methods
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
    })) as any;
  });

  it("renders word cloud section when word frequencies are provided", () => {
    render(<WordCloudSection wordFrequencies={mockWordFrequencies} />);

    expect(screen.getByText("Your Word Cloud")).toBeInTheDocument();
    expect(screen.getByTestId("word-cloud-canvas")).toBeInTheDocument();
  });

  it("does not render when word frequencies array is empty", () => {
    render(<WordCloudSection wordFrequencies={[]} />);

    expect(screen.queryByText("Your Word Cloud")).not.toBeInTheDocument();
    expect(screen.queryByTestId("word-cloud-canvas")).not.toBeInTheDocument();
  });

  it("renders with custom title", () => {
    const customTitle = "My Amazing Word Cloud";
    render(
      <WordCloudSection
        wordFrequencies={mockWordFrequencies}
        title={customTitle}
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.queryByText("Your Word Cloud")).not.toBeInTheDocument();
  });

  it("provides canvas through ref", () => {
    let ref: any;
    const TestComponent = () => {
      return (
        <WordCloudSection
          ref={(r) => {
            ref = r;
          }}
          wordFrequencies={mockWordFrequencies}
        />
      );
    };

    render(<TestComponent />);

    expect(ref).toBeDefined();
    expect(typeof ref.getCanvas).toBe("function");
    expect(typeof ref.clearCanvas).toBe("function");
  });

  it("clearCanvas method works correctly", () => {
    const mockClearRect = vi.fn();
    const mockFillRect = vi.fn();

    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: mockClearRect,
      fillRect: mockFillRect,
      fillStyle: "",
    })) as any;

    let ref: any;
    const TestComponent = () => {
      return (
        <WordCloudSection
          ref={(r) => {
            ref = r;
          }}
          wordFrequencies={mockWordFrequencies}
        />
      );
    };

    render(<TestComponent />);

    // Call clearCanvas
    ref.clearCanvas();

    expect(mockClearRect).toHaveBeenCalled();
    expect(mockFillRect).toHaveBeenCalled();
  });

  it("getCanvas returns canvas element", () => {
    let ref: any;
    const TestComponent = () => {
      return (
        <WordCloudSection
          ref={(r) => {
            ref = r;
          }}
          wordFrequencies={mockWordFrequencies}
        />
      );
    };

    render(<TestComponent />);

    const canvas = ref.getCanvas();
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it("handles null canvas context gracefully", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    let ref: any;
    const TestComponent = () => {
      return (
        <WordCloudSection
          ref={(r) => {
            ref = r;
          }}
          wordFrequencies={mockWordFrequencies}
        />
      );
    };

    render(<TestComponent />);

    // Should not throw when canvas context is null
    expect(() => ref.clearCanvas()).not.toThrow();
  });

  it("has correct CSS classes and structure", () => {
    render(<WordCloudSection wordFrequencies={mockWordFrequencies} />);

    const section = screen
      .getByText("Your Word Cloud")
      .closest(".wordcloud-section");
    expect(section).toBeInTheDocument();

    const container = document.querySelector(".wordcloud-container");
    expect(container).toBeInTheDocument();

    const canvas = screen.getByTestId("word-cloud-canvas");
    expect(canvas).toBeInTheDocument();
  });
});
