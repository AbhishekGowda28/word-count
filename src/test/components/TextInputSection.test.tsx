import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextInputSection } from "../../components/TextInputSection";

describe("TextInputSection", () => {
  const defaultProps = {
    inputText: "",
    onInputChange: vi.fn(),
    onGenerate: vi.fn(),
    onClear: vi.fn(),
    isGenerating: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the textarea with correct placeholder", () => {
    render(<TextInputSection {...defaultProps} />);

    const textarea = screen.getByTestId("text-input");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      "placeholder",
      expect.stringContaining("Maximum 50,000 characters")
    );
  });

  it("displays character count correctly", () => {
    const props = { ...defaultProps, inputText: "Hello world" };
    render(<TextInputSection {...props} />);

    expect(screen.getByText("11 / 50,000 characters")).toBeInTheDocument();
  });

  it("shows warning when approaching character limit", () => {
    const nearLimitText = "a".repeat(45001); // 90% of 50000
    const props = { ...defaultProps, inputText: nearLimitText };
    render(<TextInputSection {...props} />);

    expect(screen.getByText("Approaching character limit")).toBeInTheDocument();
  });

  it("calls onInputChange when text is entered within limit", () => {
    const mockOnInputChange = vi.fn();
    const props = { ...defaultProps, onInputChange: mockOnInputChange };

    render(<TextInputSection {...props} />);

    const textarea = screen.getByTestId("text-input");

    // Use fireEvent to directly simulate a change event
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(mockOnInputChange).toHaveBeenCalledTimes(1);
    expect(mockOnInputChange).toHaveBeenCalledWith("Hello");
  });

  it("does not call onInputChange when input exceeds maximum length", () => {
    const mockOnInputChange = vi.fn();
    const props = { ...defaultProps, onInputChange: mockOnInputChange };

    render(<TextInputSection {...props} />);

    const textarea = screen.getByTestId("text-input");

    // Try to input text that exceeds the maximum length (50,000 characters)
    const longText = "a".repeat(50001);
    fireEvent.change(textarea, { target: { value: longText } });

    // onInputChange should not be called when text exceeds limit
    expect(mockOnInputChange).not.toHaveBeenCalled();
  });

  it("displays error message when error prop is provided", () => {
    const props = { ...defaultProps, error: "Test error message" };
    render(<TextInputSection {...props} />);

    const errorElement = screen.getByTestId("error-message");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("Error: Test error message");
  });

  it("does not display error message when error is null", () => {
    render(<TextInputSection {...defaultProps} />);

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("calls onGenerate when generate button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnGenerate = vi.fn();
    const props = {
      ...defaultProps,
      inputText: "Some text",
      onGenerate: mockOnGenerate,
    };

    render(<TextInputSection {...props} />);

    const generateButton = screen.getByTestId("generate-button");
    await user.click(generateButton);

    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClear = vi.fn();
    const props = { ...defaultProps, onClear: mockOnClear };

    render(<TextInputSection {...props} />);

    const clearButton = screen.getByTestId("clear-button");
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("disables generate button when input is empty", () => {
    render(<TextInputSection {...defaultProps} />);

    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
  });

  it("disables generate button when input is only whitespace", () => {
    const props = { ...defaultProps, inputText: "   " };
    render(<TextInputSection {...props} />);

    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
  });

  it("disables generate button when isGenerating is true", () => {
    const props = {
      ...defaultProps,
      inputText: "Some text",
      isGenerating: true,
    };
    render(<TextInputSection {...props} />);

    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
    expect(generateButton).toHaveTextContent("Generating...");
  });

  it("enables generate button when input has valid text", () => {
    const props = { ...defaultProps, inputText: "Valid text" };
    render(<TextInputSection {...props} />);

    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).not.toBeDisabled();
    expect(generateButton).toHaveTextContent("Generate Word Cloud");
  });
});
