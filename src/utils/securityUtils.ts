// Security validation utilities
export const MAX_INPUT_LENGTH = 50000; // ~50KB text limit
export const MAX_WORDS_PROCESSED = 10000; // Limit processed words

export const validateInput = (text: string): string => {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  if (text.length > MAX_INPUT_LENGTH) {
    throw new Error(
      `Input too large: maximum ${MAX_INPUT_LENGTH} characters allowed`
    );
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onerror=/i,
    /onfocus=/i,
    /autofocus=/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      throw new Error("Input contains potentially malicious content");
    }
  }

  return text;
};

export const sanitizeText = (text: string): string => {
  // Additional sanitization beyond the existing regex
  return text
    .replace(/[<>'"&]/g, "") // Remove HTML/XML special characters
    .replace(/\0/g, "") // Remove null bytes
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .trim();
};

export const rateLimitCheck = (() => {
  let lastProcessTime = 0;
  const MIN_INTERVAL = 100; // Minimum 100ms between processing requests

  return (): boolean => {
    const now = Date.now();
    if (now - lastProcessTime < MIN_INTERVAL) {
      return false; // Rate limited
    }
    lastProcessTime = now;
    return true;
  };
})();
