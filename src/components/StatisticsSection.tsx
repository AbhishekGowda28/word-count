import React from "react";
import { WordFrequency } from "@/src/utils/wordUtils";

interface StatisticsSectionProps {
  wordFrequencies: WordFrequency[];
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  wordFrequencies,
}) => {
  if (wordFrequencies.length === 0) {
    return null;
  }

  const totalWords = wordFrequencies.reduce(
    (sum, word) => sum + word.weight,
    0
  );
  const mostFrequentWord = wordFrequencies[0]?.text || "-";
  const maxFrequency = wordFrequencies[0]?.weight || 0;

  return (
    <div className="stats" data-testid="stats-section">
      <div className="stat-card">
        <h3 data-testid="unique-words-count">{wordFrequencies.length}</h3>
        <p>Unique Words</p>
      </div>
      <div className="stat-card">
        <h3 data-testid="total-words-count">{totalWords}</h3>
        <p>Total Words</p>
      </div>
      <div className="stat-card">
        <h3 data-testid="most-frequent-word">{mostFrequentWord}</h3>
        <p>Most Frequent</p>
      </div>
      <div className="stat-card">
        <h3 data-testid="max-frequency">{maxFrequency}</h3>
        <p>Max Frequency</p>
      </div>
    </div>
  );
};
