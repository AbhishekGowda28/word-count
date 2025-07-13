import React from "react";
import { MAX_INPUT_LENGTH } from "@/src/utils/securityUtils";

interface TextInputSectionProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isGenerating: boolean;
  error: string | null;
}

export const TextInputSection: React.FC<TextInputSectionProps> = ({
  inputText,
  onInputChange,
  onGenerate,
  onClear,
  isGenerating,
  error,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      onInputChange(value);
    }
  };

  const isNearLimit = inputText.length > MAX_INPUT_LENGTH * 0.9;
  const isOverLimit = inputText.length > MAX_INPUT_LENGTH;

  return (
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
        <span className="character-counter">
          {inputText.length.toLocaleString()} /{" "}
          {MAX_INPUT_LENGTH.toLocaleString()} characters
        </span>
        {isNearLimit && (
          <span className="character-warning">Approaching character limit</span>
        )}
      </div>

      {error && (
        <div className="error-message" data-testid="error-message">
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
          onClick={onGenerate}
          disabled={!inputText.trim() || isGenerating || isOverLimit}
          data-testid="generate-button"
        >
          {isGenerating ? "Generating..." : "Generate Word Cloud"}
        </button>
        <button
          className="button"
          onClick={onClear}
          style={{ background: "#dc3545" }}
          data-testid="clear-button"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
