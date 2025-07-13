import React, { forwardRef } from "react";

interface WordCloudCanvasProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  className?: string;
  style?: React.CSSProperties;
}

export const WordCloudCanvas = forwardRef<
  HTMLCanvasElement,
  WordCloudCanvasProps
>(({ className, style, ...props }, ref) => {
  const defaultStyle = {
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    maxWidth: "100%",
    height: "auto",
    ...style,
  };

  return (
    <canvas
      ref={ref}
      data-testid="word-cloud-canvas"
      style={defaultStyle}
      className={className}
      {...props}
    />
  );
});

WordCloudCanvas.displayName = "WordCloudCanvas";
