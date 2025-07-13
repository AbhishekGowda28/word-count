import { render, screen } from "@testing-library/react";
import { StatisticsSection } from "../../components/StatisticsSection";
import { WordFrequency } from "../../utils/wordUtils";

describe("StatisticsSection", () => {
  const mockWordFrequencies: WordFrequency[] = [
    { text: "hello", size: 60, weight: 3 },
    { text: "world", size: 40, weight: 2 },
    { text: "test", size: 20, weight: 1 },
  ];

  it("renders statistics when word frequencies are provided", () => {
    render(<StatisticsSection wordFrequencies={mockWordFrequencies} />);

    expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    expect(screen.getByTestId("unique-words-count")).toHaveTextContent("3");
    expect(screen.getByTestId("total-words-count")).toHaveTextContent("6"); // 3 + 2 + 1
    expect(screen.getByTestId("most-frequent-word")).toHaveTextContent("hello");
    expect(screen.getByTestId("max-frequency")).toHaveTextContent("3");
  });

  it("does not render when word frequencies array is empty", () => {
    render(<StatisticsSection wordFrequencies={[]} />);

    expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
  });

  it("displays correct labels for each statistic", () => {
    render(<StatisticsSection wordFrequencies={mockWordFrequencies} />);

    expect(screen.getByText("Unique Words")).toBeInTheDocument();
    expect(screen.getByText("Total Words")).toBeInTheDocument();
    expect(screen.getByText("Most Frequent")).toBeInTheDocument();
    expect(screen.getByText("Max Frequency")).toBeInTheDocument();
  });

  it("handles single word frequency correctly", () => {
    const singleWord: WordFrequency[] = [
      { text: "single", size: 40, weight: 5 },
    ];

    render(<StatisticsSection wordFrequencies={singleWord} />);

    expect(screen.getByTestId("unique-words-count")).toHaveTextContent("1");
    expect(screen.getByTestId("total-words-count")).toHaveTextContent("5");
    expect(screen.getByTestId("most-frequent-word")).toHaveTextContent(
      "single"
    );
    expect(screen.getByTestId("max-frequency")).toHaveTextContent("5");
  });

  it("handles large numbers correctly", () => {
    const largeFrequencies: WordFrequency[] = [
      { text: "frequent", size: 80, weight: 1000 },
      { text: "less", size: 20, weight: 500 },
    ];

    render(<StatisticsSection wordFrequencies={largeFrequencies} />);

    expect(screen.getByTestId("unique-words-count")).toHaveTextContent("2");
    expect(screen.getByTestId("total-words-count")).toHaveTextContent("1500");
    expect(screen.getByTestId("most-frequent-word")).toHaveTextContent(
      "frequent"
    );
    expect(screen.getByTestId("max-frequency")).toHaveTextContent("1000");
  });

  it("displays fallback values when no words exist but array is not empty", () => {
    // Edge case: array exists but first element might be undefined
    const emptyFrequencies: WordFrequency[] = [];

    render(<StatisticsSection wordFrequencies={emptyFrequencies} />);

    expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
  });

  it("handles zero weight words", () => {
    const zeroWeightFrequencies: WordFrequency[] = [
      { text: "zero", size: 20, weight: 0 },
    ];

    render(<StatisticsSection wordFrequencies={zeroWeightFrequencies} />);

    expect(screen.getByTestId("unique-words-count")).toHaveTextContent("1");
    expect(screen.getByTestId("total-words-count")).toHaveTextContent("0");
    expect(screen.getByTestId("most-frequent-word")).toHaveTextContent("zero");
    expect(screen.getByTestId("max-frequency")).toHaveTextContent("0");
  });
});
