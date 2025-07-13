import { describe, it, expect, vi } from "vitest";
import {
  validateInput,
  sanitizeText,
  rateLimitCheck,
} from "../utils/securityUtils";

describe("Security Utils", () => {
  // Reset any global state before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateInput", () => {
    it("should accept valid text input", () => {
      const validText = "This is a valid text input for testing";
      expect(() => validateInput(validText)).not.toThrow();
      expect(validateInput(validText)).toBe(validText);
    });

    it("should reject empty or invalid input", () => {
      expect(() => validateInput("")).toThrow("Invalid input");
      expect(() => validateInput(null as any)).toThrow("Invalid input");
      expect(() => validateInput(undefined as any)).toThrow("Invalid input");
      expect(() => validateInput(123 as any)).toThrow("Invalid input");
    });

    it("should reject input that exceeds maximum length", () => {
      const longText = "a".repeat(50001); // Exceeds MAX_INPUT_LENGTH (50000)
      expect(() => validateInput(longText)).toThrow("Input too large");
    });

    it("should detect and reject malicious script tags", () => {
      const maliciousInputs = [
        "<script>alert('xss')</script>",
        "<SCRIPT>alert('XSS')</SCRIPT>",
        "javascript:alert('xss')",
        "JAVASCRIPT:alert('XSS')",
        "data:text/html,<script>alert('xss')</script>",
        "vbscript:msgbox('xss')",
        "<img onload='alert(1)'>",
        "<div onerror='alert(1)'>",
      ];

      maliciousInputs.forEach((input) => {
        expect(() => validateInput(input)).toThrow(
          "Input contains potentially malicious content"
        );
      });
    });

    it("should allow legitimate text with numbers and punctuation", () => {
      const legitimateText =
        "Hello world! This is a test with numbers 123 and symbols @#$%";
      expect(() => validateInput(legitimateText)).not.toThrow();
    });
  });

  describe("sanitizeText", () => {
    it("should remove HTML special characters", () => {
      const input = "Hello <world> & 'test' \"quotes\"";
      const result = sanitizeText(input);
      expect(result).toBe("Hello world  test quotes");
    });

    it("should remove null bytes and control characters", () => {
      const input = "Hello\x00world\x01test\x7F";
      const result = sanitizeText(input);
      expect(result).toBe("Helloworldtest");
    });

    it("should trim whitespace", () => {
      const input = "  Hello world  ";
      const result = sanitizeText(input);
      expect(result).toBe("Hello world");
    });

    it("should handle empty input", () => {
      expect(sanitizeText("")).toBe("");
      expect(sanitizeText("   ")).toBe("");
    });
  });

  describe("rateLimitCheck", () => {
    it("should allow first request", () => {
      expect(rateLimitCheck()).toBe(true);
    });

    it("should block rapid consecutive requests", () => {
      rateLimitCheck(); // First call
      expect(rateLimitCheck()).toBe(false); // Should be blocked
    });

    it("should allow request after sufficient time delay", async () => {
      rateLimitCheck(); // First call

      // Wait for rate limit to reset (110ms > 100ms minimum interval)
      await new Promise((resolve) => setTimeout(resolve, 110));

      expect(rateLimitCheck()).toBe(true); // Should be allowed
    });
  });

  describe("XSS Prevention", () => {
    it("should prevent script tag XSS vectors", () => {
      const scriptVectors = [
        "<script>alert('xss')</script>",
        "<SCRIPT>alert('XSS')</SCRIPT>",
      ];

      scriptVectors.forEach((vector) => {
        expect(() => validateInput(vector)).toThrow("malicious content");
      });
    });

    it("should prevent javascript protocol XSS vectors", () => {
      const jsProtocolVectors = [
        "javascript:alert('xss')",
        "JAVASCRIPT:alert('XSS')",
      ];

      jsProtocolVectors.forEach((vector) => {
        expect(() => validateInput(vector)).toThrow("malicious content");
      });
    });

    it("should prevent common XSS attack vectors", () => {
      const xssVectors = [
        { input: "<script>alert('xss')</script>", description: "script tag" },
        {
          input: "<SCRIPT>alert('XSS')</SCRIPT>",
          description: "uppercase script tag",
        },
        {
          input: "javascript:alert('xss')",
          description: "javascript protocol",
        },
        {
          input: "JAVASCRIPT:alert('XSS')",
          description: "uppercase javascript protocol",
        },
      ];

      xssVectors.forEach(({ input, description }) => {
        expect(() => validateInput(input)).toThrow(/malicious content/i);
      });
    });

    it("should prevent HTML event handler XSS vectors", () => {
      const eventHandlerVectors = [
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(1)>",
        "<iframe src=javascript:alert(1)>",
      ];

      eventHandlerVectors.forEach((vector) => {
        expect(() => validateInput(vector)).toThrow();
      });
    });

    it("should prevent additional XSS vectors", () => {
      const additionalXssVectors = [
        "<body onload=alert(1)>",
        "<input onfocus=alert(1) autofocus>",
        "<select onfocus=alert(1) autofocus>",
        "<textarea onfocus=alert(1) autofocus>",
        "<video><source onerror=alert(1)>",
        "<audio src=x onerror=alert(1)>",
        "data:text/html,<script>alert('xss')</script>",
        "vbscript:msgbox('xss')",
      ];

      additionalXssVectors.forEach((vector) => {
        expect(() => validateInput(vector)).toThrow();
      });
    });
  });

  describe("Integration Security Tests", () => {
    it("should handle combined validation and sanitization", () => {
      const input = "Hello <world> this is a test!";

      // Should pass validation (no malicious content)
      const validated = validateInput(input);
      expect(validated).toBe(input);

      // Should be sanitized properly
      const sanitized = sanitizeText(validated);
      expect(sanitized).toBe("Hello world this is a test!");
    });

    it("should reject input with mixed legitimate and malicious content", () => {
      const input =
        "This looks normal but <script>alert('xss')</script> has malicious code";
      expect(() => validateInput(input)).toThrow("malicious content");
    });

    it("should handle edge cases gracefully", () => {
      // Very short input
      expect(() => validateInput("Hi")).not.toThrow();

      // Input with only spaces
      const spacesOnly = "   ";
      expect(validateInput(spacesOnly)).toBe(spacesOnly);
      expect(sanitizeText(spacesOnly)).toBe("");

      // Input with special characters but not malicious
      const specialChars = "Hello! @#$%^&*()_+-=[]{}|;:,.<>?";
      expect(() => validateInput(specialChars)).not.toThrow();
    });

    it("should handle rate limiting edge cases", () => {
      // Test multiple rapid calls
      expect(rateLimitCheck()).toBe(true);  // First call allowed
      expect(rateLimitCheck()).toBe(false); // Second call blocked
      expect(rateLimitCheck()).toBe(false); // Third call blocked
    });

    it("should handle sanitization of complex input", () => {
      const complexInput = "Hello <world> & 'test' \"quotes\" \x00\x01\x7F";
      const result = sanitizeText(complexInput);
      expect(result).toBe("Hello world  test quotes");
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
      expect(result).not.toContain("&");
      expect(result).not.toContain("\x00");
      expect(result).not.toContain("\x01");
      expect(result).not.toContain("\x7F");
    });
  });
});
