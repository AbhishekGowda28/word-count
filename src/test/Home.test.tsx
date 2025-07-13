import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { vi } from "vitest";

// Mock the wordUtils module
vi.mock("@/src/utils/wordUtils", () => ({
  processText: vi.fn(),
  WordFrequency: {},
}));

import { processText } from "@/src/utils/wordUtils";

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

  it("displays word cloud canvas after generation", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([{ text: "hello", size: 40, weight: 2 }]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "hello hello");
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId("word-cloud-canvas")).toBeInTheDocument();
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

  it("shows generating state when processing", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "test");

    // Click generate and immediately check for loading state
    await user.click(generateButton);

    // The button should show "Generating..." briefly
    expect(generateButton).toHaveTextContent("Generating...");
    expect(generateButton).toBeDisabled();
  });

  it("handles empty result from processText", async () => {
    const user = userEvent.setup();
    const mockProcessText = vi.mocked(processText);
    mockProcessText.mockReturnValue([]);

    render(<Home />);

    const textInput = screen.getByTestId("text-input");
    const generateButton = screen.getByTestId("generate-button");

    await user.type(textInput, "a an the"); // Short words that get filtered
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
    });
  });
});
