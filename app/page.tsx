"use client";

import { useState, useRef } from "react";
import { processText, WordFrequency } from "@/src/utils/wordUtils";
import { drawWordCloud } from "@/src/utils/canvasUtils";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateWordCloud = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    // Process text and generate word frequencies
    const frequencies = processText(inputText);
    setWordFrequencies(frequencies);

    // Generate canvas-based word cloud
    setTimeout(() => {
      drawWordCloud(canvasRef.current, frequencies);
      setIsGenerating(false);
    }, 100);
  };

  const clearWordCloud = () => {
    setInputText("");
    setWordFrequencies([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Word Cloud Generator</h1>
        <p>Enter your text below and generate a beautiful word cloud</p>
      </div>

      <div className="input-section">
        <textarea
          className="textarea"
          placeholder="Enter your text here... The more words you add, the better your word cloud will look!"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          data-testid="text-input"
        />
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            className="button"
            onClick={generateWordCloud}
            disabled={!inputText.trim() || isGenerating}
            data-testid="generate-button"
          >
            {isGenerating ? "Generating..." : "Generate Word Cloud"}
          </button>
          <button
            className="button"
            onClick={clearWordCloud}
            style={{ background: "#dc3545" }}
            data-testid="clear-button"
          >
            Clear
          </button>
        </div>
      </div>

      {wordFrequencies.length > 0 && (
        <>
          <div className="stats" data-testid="stats-section">
            <div className="stat-card">
              <h3 data-testid="unique-words-count">{wordFrequencies.length}</h3>
              <p>Unique Words</p>
            </div>
            <div className="stat-card">
              <h3 data-testid="total-words-count">
                {wordFrequencies.reduce((sum, word) => sum + word.weight, 0)}
              </h3>
              <p>Total Words</p>
            </div>
            <div className="stat-card">
              <h3 data-testid="most-frequent-word">
                {wordFrequencies[0]?.text || "-"}
              </h3>
              <p>Most Frequent</p>
            </div>
            <div className="stat-card">
              <h3 data-testid="max-frequency">
                {wordFrequencies[0]?.weight || 0}
              </h3>
              <p>Max Frequency</p>
            </div>
          </div>

          <div className="wordcloud-section">
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Your Word Cloud
            </h2>
            <div className="wordcloud-container">
              <canvas
                ref={canvasRef}
                data-testid="word-cloud-canvas"
                style={{
                  border: "2px solid #e0e0e0",
                  borderRadius: "10px",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
