import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WordCloudCanvas } from "../../components/WordCloudCanvas";

describe("WordCloudCanvas", () => {
  it("renders canvas with default styles", () => {
    render(<WordCloudCanvas />);

    const canvas = screen.getByTestId("word-cloud-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("applies custom className", () => {
    const customClass = "custom-canvas-class";
    render(<WordCloudCanvas className={customClass} />);

    const canvas = screen.getByTestId("word-cloud-canvas");
    expect(canvas).toHaveClass(customClass);
  });

  it("applies custom styles while keeping default styles", () => {
    const customStyle = { backgroundColor: "red", width: "500px" };
    render(<WordCloudCanvas style={customStyle} />);

    const canvas = screen.getByTestId("word-cloud-canvas");

    // Simply check that both custom and some default styles are present
    expect(canvas.style.backgroundColor).toBe("red");
    expect(canvas.style.width).toBe("500px");
    expect(canvas.style.borderRadius).toBe("10px");
    expect(canvas.style.maxWidth).toBe("100%");
  });

  it("forwards ref correctly", () => {
    let canvasRef: HTMLCanvasElement | null = null;

    const TestComponent = () => {
      return (
        <WordCloudCanvas
          ref={(ref) => {
            canvasRef = ref;
          }}
        />
      );
    };

    render(<TestComponent />);

    expect(canvasRef).toBeInstanceOf(HTMLCanvasElement);
  });

  it("passes through additional props", () => {
    render(<WordCloudCanvas width={800} height={600} />);

    const canvas = screen.getByTestId("word-cloud-canvas");
    expect(canvas).toHaveAttribute("width", "800");
    expect(canvas).toHaveAttribute("height", "600");
  });
});
