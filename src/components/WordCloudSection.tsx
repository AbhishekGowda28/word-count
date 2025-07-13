import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { WordFrequency } from "@/src/utils/wordUtils";
import { WordCloudCanvas } from "./WordCloudCanvas";

interface WordCloudSectionProps {
  wordFrequencies: WordFrequency[];
  title?: string;
}

export interface WordCloudSectionRef {
  getCanvas: () => HTMLCanvasElement | null;
  clearCanvas: () => void;
}

export const WordCloudSection = forwardRef<
  WordCloudSectionRef,
  WordCloudSectionProps
>(({ wordFrequencies, title = "Your Word Cloud" }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    clearCanvas: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    },
  }));

  if (wordFrequencies.length === 0) {
    return null;
  }

  return (
    <div className="wordcloud-section">
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h2>
      <div className="wordcloud-container">
        <WordCloudCanvas ref={canvasRef} />
      </div>
    </div>
  );
});

WordCloudSection.displayName = "WordCloudSection";
