import { WordFrequency } from "./wordUtils";

export const drawWordCloud = (
  canvas: HTMLCanvasElement | null,
  frequencies: WordFrequency[]
) => {
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
