"use client";

import { useState, useEffect, useRef } from "react";

// Define types for word frequency
interface WordFrequency {
  text: string;
  size: number;
  weight: number;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processText = (text: string): WordFrequency[] => {
    if (!text.trim()) return [];

    // Convert to lowercase and remove punctuation
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2); // Filter out very short words

    // Count word frequencies
    const wordCount: { [key: string]: number } = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Convert to array and sort by frequency
    const frequencies = Object.entries(wordCount)
      .map(([text, weight]) => ({
        text,
        size: Math.min(Math.max(weight * 20, 20), 80), // Scale size between 20-80px
        weight,
      }))
      .sort((a, b) => b.weight - a.weight);

    return frequencies;
  };

  const generateWordCloud = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    // Process text and generate word frequencies
    const frequencies = processText(inputText);
    setWordFrequencies(frequencies);

    // Generate canvas-based word cloud
    setTimeout(() => {
      drawWordCloud(frequencies);
      setIsGenerating(false);
    }, 100);
  };

  const drawWordCloud = (frequencies: WordFrequency[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Color palette
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
      "#ffecd2",
      "#fcb69f",
      "#a8edea",
      "#fed6e3",
    ];

    // Position words in a simple grid-like pattern
    let x = 50;
    let y = 100;
    const maxWidth = canvas.width - 100;

    frequencies.slice(0, 30).forEach((word, index) => {
      ctx.font = `bold ${word.size}px Arial`;
      ctx.fillStyle = colors[index % colors.length];

      const textWidth = ctx.measureText(word.text).width;

      // Wrap to next line if needed
      if (x + textWidth > maxWidth) {
        x = 50;
        y += word.size + 20;
      }

      // Avoid drawing outside canvas
      if (y < canvas.height - 50) {
        ctx.fillText(word.text, x, y);
        x += textWidth + 20;
      }
    });
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
        />
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            className="button"
            onClick={generateWordCloud}
            disabled={!inputText.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Word Cloud"}
          </button>
          <button
            className="button"
            onClick={clearWordCloud}
            style={{ background: "#dc3545" }}
          >
            Clear
          </button>
        </div>
      </div>

      {wordFrequencies.length > 0 && (
        <>
          <div className="stats">
            <div className="stat-card">
              <h3>{wordFrequencies.length}</h3>
              <p>Unique Words</p>
            </div>
            <div className="stat-card">
              <h3>
                {wordFrequencies.reduce((sum, word) => sum + word.weight, 0)}
              </h3>
              <p>Total Words</p>
            </div>
            <div className="stat-card">
              <h3>{wordFrequencies[0]?.text || "-"}</h3>
              <p>Most Frequent</p>
            </div>
            <div className="stat-card">
              <h3>{wordFrequencies[0]?.weight || 0}</h3>
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
