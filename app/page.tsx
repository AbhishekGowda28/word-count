"use client";

import { useState, useRef } from "react";
import { processText, WordFrequency } from "@/src/utils/wordUtils";
import { drawWordCloud } from "@/src/utils/canvasUtils";
import {
  Header,
  TextInputSection,
  StatisticsSection,
  WordCloudSection,
  type WordCloudSectionRef,
} from "@/src/components";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wordCloudRef = useRef<WordCloudSectionRef>(null);

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
        const canvas = wordCloudRef.current?.getCanvas();
        if (canvas) {
          drawWordCloud(canvas, frequencies);
        }
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
    wordCloudRef.current?.clearCanvas();
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (error) setError(null);
  };

  return (
    <div className="container">
      <Header />

      <TextInputSection
        inputText={inputText}
        onInputChange={handleInputChange}
        onGenerate={generateWordCloud}
        onClear={clearWordCloud}
        isGenerating={isGenerating}
        error={error}
      />

      <StatisticsSection wordFrequencies={wordFrequencies} />

      <WordCloudSection ref={wordCloudRef} wordFrequencies={wordFrequencies} />
    </div>
  );
}
