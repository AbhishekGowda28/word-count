import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Mock the wordUtils module
vi.mock("@/src/utils/wordUtils", () => ({
  processText: vi.fn(),
  WordFrequency: {},
}));

// Mock the canvasUtils module
vi.mock("@/src/utils/canvasUtils", () => ({
  drawWordCloud: vi.fn(),
}));

import { processText } from "@/src/utils/wordUtils";
import { drawWordCloud } from "@/src/utils/canvasUtils";

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main components", () => {
    render(<Home />);

    expect(screen.getByText("Word Cloud Generator")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your text below and generate a beautiful word cloud"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
    expect(screen.getByTestId("generate-button")).toBeInTheDocument();
    expect(screen.getByTestId("clear-button")).toBeInTheDocument();
  });

  it("has disabled generate button when input is empty", () => {
    render(<Home />);

    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
  });

  it("enables generate button when text is entered", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello world");

    expect(generateButton).not.toBeDisabled();
  });

  it("calls processText when generate button is clicked", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([
      { text: "hello", size: 40, weight: 2 },
      { text: "world", size: 20, weight: 1 },
    ]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello world hello");
    await user.click(generateButton);

    expect(mockProcessText).toHaveBeenCalledWith("hello world hello");
  });

  it("displays statistics after generating word cloud", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([
      { text: "hello", size: 40, weight: 2 },
      { text: "world", size: 20, weight: 1 },
    ]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello world hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("stats-section")).toBeInTheDocument();
      expect(screen.getByTestId("unique-words-count")).toHaveTextContent("2");
      expect(screen.getByTestId("total-words-count")).toHaveTextContent("3");
      expect(screen.getByTestId("most-frequent-word")).toHaveTextContent(
        "hello"
      );
      expect(screen.getByTestId("max-frequency")).toHaveTextContent("2");
    });
  });

  it("clears input and statistics when clear button is clicked", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([{ text: "hello", size: 40, weight: 2 }]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");
    const clearButton = screen.getByTestId("clear-button");

    // Generate word cloud first
    await user.type(textInput, "hello hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    });

    // Clear everything
    await user.click(clearButton);

    expect(textInput).toHaveValue("");
    expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
  });

  it("handles error state correctly", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockImplementation(() => {
      throw new Error("Test error message");
    });

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    // Type text and ensure button is enabled
    await user.type(textInput, "test");
    expect(generateButton).not.toBeDisabled();

    // Click generate and expect error
    await user.click(generateButton);

    // Wait for error to be processed and displayed
    await waitFor(
      () => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Error: Test error message"
        );
      },
      { timeout: 3000 }
    );

    // Verify error state consequences
    expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
    expect(generateButton).toHaveTextContent("Generate Word Cloud");
    expect(generateButton).not.toBeDisabled();
  });

  it("displays word cloud canvas after generation", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([
      { text: "hello", size: 40, weight: 2 },
      { text: "world", size: 20, weight: 1 },
    ]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello world hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("word-cloud-canvas")).toBeInTheDocument();
      expect(screen.getByText("Your Word Cloud")).toBeInTheDocument();
    });
  });

  it("clears word cloud canvas when clear button is clicked", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([{ text: "hello", size: 40, weight: 2 }]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");
    const clearButton = screen.getByTestId("clear-button");

    // Generate word cloud first
    await user.type(textInput, "hello hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("word-cloud-canvas")).toBeInTheDocument();
    });

    // Clear everything
    await user.click(clearButton);

    expect(textInput).toHaveValue("");
    expect(screen.queryByTestId("word-cloud-canvas")).not.toBeInTheDocument();
  });

  it("handles empty result from processText", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([]); // Empty result

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "a an the"); // Words that might be filtered out
    await user.click(generateButton);

    await waitFor(() => {
      // No stats should be displayed for empty results
      expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
      expect(screen.queryByTestId("word-cloud-canvas")).not.toBeInTheDocument();
    });
  });

  it("shows generating state when processing", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    
    // Mock a slow processing function
    mockProcessText.mockImplementation(() => {
      // Simulate some processing time
      return [{ text: "hello", size: 40, weight: 1 }];
    });

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello");
    
    // Click generate and immediately check for loading state
    await user.click(generateButton);
    
    // The button should show "Generating..." and be disabled briefly
    expect(generateButton).toBeDisabled();
    expect(generateButton).toHaveTextContent("Generating...");
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(generateButton).not.toBeDisabled();
      expect(generateButton).toHaveTextContent("Generate Word Cloud");
    });
  });

  it("handles canvas drawing errors gracefully", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    const mockDrawWordCloud = vi.mocked(drawWordCloud);
    
    mockProcessText.mockReturnValue([
      { text: "hello", size: 40, weight: 2 }
    ]);
    
    // Mock canvas drawing to throw an error
    mockDrawWordCloud.mockImplementation(() => {
      throw new Error("Canvas drawing failed");
    });

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello");
    await user.click(generateButton);

    // Should still show statistics even if canvas drawing fails
    await waitFor(() => {
      expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    });

    // But should also show an error message
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(/Canvas drawing failed/);
    });
  });

  it("calls drawWordCloud when canvas ref is available", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    const mockDrawWordCloud = vi.mocked(drawWordCloud);
    
    mockProcessText.mockReturnValue([
      { text: "hello", size: 40, weight: 2 }
    ]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("word-cloud-canvas")).toBeInTheDocument();
    });

    // Verify drawWordCloud was called
    expect(mockDrawWordCloud).toHaveBeenCalled();
  });
});
