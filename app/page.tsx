"use client";

import { useState, useRef } from "react";
import { processText, WordFrequency } from "@/src/utils/wordUtils";
import { drawWordCloud } from "@/src/utils/canvasUtils";
import { MAX_INPUT_LENGTH } from "@/src/utils/securityUtils";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateWordCloud = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Process text and generate word frequencies
      const frequencies = processText(inputText);
      setWordFrequencies(frequencies);

      // Generate canvas-based word cloud
      setTimeout(() => {
        drawWordCloud(canvasRef.current, frequencies);
        setIsGenerating(false);
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing text"
      );
      setIsGenerating(false);
      setWordFrequencies([]);
    }
  };

  const clearWordCloud = () => {
    setInputText("");
    setWordFrequencies([]);
    setError(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Clear error when user starts typing again
    if (error) setError(null);

    // Prevent input beyond maximum length
    if (value.length <= MAX_INPUT_LENGTH) {
      setInputText(value);
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
          placeholder={`Enter your text here... (Maximum ${MAX_INPUT_LENGTH.toLocaleString()} characters)`}
          value={inputText}
          onChange={handleInputChange}
          data-testid="text-input"
          maxLength={MAX_INPUT_LENGTH}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            {inputText.length.toLocaleString()} /{" "}
            {MAX_INPUT_LENGTH.toLocaleString()} characters
          </span>
          {inputText.length > MAX_INPUT_LENGTH * 0.9 && (
            <span
              style={{
                fontSize: "0.9rem",
                color: "#f5576c",
              }}
            >
              Approaching character limit
            </span>
          )}
        </div>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              border: "1px solid #fcc",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            className="button"
            onClick={generateWordCloud}
            disabled={
              !inputText.trim() ||
              isGenerating ||
              inputText.length > MAX_INPUT_LENGTH
            }
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
