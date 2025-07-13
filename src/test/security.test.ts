import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateInput,
  sanitizeText,
  rateLimitCheck,
  MAX_INPUT_LENGTH,
  MAX_WORDS_PROCESSED,
} from "../utils/securityUtils";

describe("Security Utils", () => {
  // Reset any global state before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Constants", () => {
    it("should have correct MAX_INPUT_LENGTH", () => {
      expect(MAX_INPUT_LENGTH).toBe(50000);
      expect(typeof MAX_INPUT_LENGTH).toBe("number");
    });

    it("should have correct MAX_WORDS_PROCESSED", () => {
      expect(MAX_WORDS_PROCESSED).toBe(10000);
      expect(typeof MAX_WORDS_PROCESSED).toBe("number");
    });
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

    it("should accept input at maximum length boundary", () => {
      const maxLengthText = "a".repeat(50000); // Exactly MAX_INPUT_LENGTH
      expect(() => validateInput(maxLengthText)).not.toThrow();
      expect(validateInput(maxLengthText)).toBe(maxLengthText);
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

    it("should detect all suspicious patterns individually", () => {
      const suspiciousPatterns = [
        "<script>test</script>",
        "<SCRIPT>TEST</SCRIPT>",
        "javascript:void(0)",
        "JAVASCRIPT:ALERT(1)",
        "data:text/html,<h1>test</h1>",
        "DATA:TEXT/HTML,<H1>TEST</H1>",
        "vbscript:msgbox('test')",
        "VBSCRIPT:MSGBOX('TEST')",
        "<img onload='test'>",
        "<IMG ONLOAD='TEST'>",
        "<div onerror='test'>",
        "<DIV ONERROR='TEST'>",
        "<input onfocus='test'>",
        "<INPUT ONFOCUS='TEST'>",
        "<select autofocus='true'>",
        "<SELECT AUTOFOCUS='TRUE'>",
      ];

      suspiciousPatterns.forEach((pattern) => {
        expect(() => validateInput(pattern)).toThrow(
          "Input contains potentially malicious content"
        );
      });
    });

    it("should allow legitimate text with numbers and punctuation", () => {
      const legitimateText =
        "Hello world! This is a test with numbers 123 and symbols @#$%";
      expect(() => validateInput(legitimateText)).not.toThrow();
    });

    it("should handle edge cases with whitespace", () => {
      expect(() => validateInput("   ")).not.toThrow();
      expect(() => validateInput("\t\n\r")).not.toThrow();
      expect(validateInput("  hello  ")).toBe("  hello  ");
    });

    it("should handle input with false positives", () => {
      // These should NOT trigger false positives
      const safeInputs = [
        "I love JavaScript programming",
        "Check out this data visualization",
        "The script was well written",
        "She focused on the task",
        "The error was corrected",
        "Load the new content",
      ];

      safeInputs.forEach((input) => {
        expect(() => validateInput(input)).not.toThrow();
      });
    });

    it("should handle boolean and object inputs", () => {
      expect(() => validateInput(true as any)).toThrow("Invalid input");
      expect(() => validateInput(false as any)).toThrow("Invalid input");
      expect(() => validateInput({} as any)).toThrow("Invalid input");
      expect(() => validateInput([] as any)).toThrow("Invalid input");
    });

    it("should handle whitespace-only input", () => {
      expect(() => validateInput(" ")).not.toThrow();
      expect(() => validateInput("\n")).not.toThrow();
      expect(() => validateInput("\t")).not.toThrow();
      expect(() => validateInput("\r")).not.toThrow();
    });

    it("should provide specific error messages", () => {
      expect(() => validateInput("")).toThrow(
        "Invalid input: text must be a non-empty string"
      );
      expect(() => validateInput("a".repeat(50001))).toThrow(
        "Input too large: maximum 50000 characters allowed"
      );
      expect(() => validateInput("<script>")).toThrow(
        "Input contains potentially malicious content"
      );
    });

    it("should test all suspicious patterns in the for loop", () => {
      // This test ensures we hit every pattern in the suspiciousPatterns array
      const patterns = [
        { test: "<script", pattern: "script" },
        { test: "javascript:", pattern: "javascript protocol" },
        { test: "data:", pattern: "data protocol" },
        { test: "vbscript:", pattern: "vbscript protocol" },
        { test: "onload=", pattern: "onload event" },
        { test: "onerror=", pattern: "onerror event" },
        { test: "onfocus=", pattern: "onfocus event" },
        { test: "autofocus=", pattern: "autofocus attribute" },
      ];

      patterns.forEach(({ test, pattern }) => {
        expect(() => validateInput(`test ${test} content`)).toThrow(
          "Input contains potentially malicious content"
        );
      });
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

    it("should remove all HTML/XML special characters individually", () => {
      expect(sanitizeText("test<")).toBe("test");
      expect(sanitizeText("test>")).toBe("test");
      expect(sanitizeText("test'")).toBe("test");
      expect(sanitizeText('test"')).toBe("test");
      expect(sanitizeText("test&")).toBe("test");
    });

    it("should remove various control characters", () => {
      // Test different control characters (\x00-\x1F and \x7F)
      const controlChars = [
        "\x00", // null
        "\x01", // start of heading
        "\x02", // start of text
        "\x08", // backspace
        "\x09", // tab
        "\x0A", // line feed
        "\x0D", // carriage return
        "\x1F", // unit separator
        "\x7F", // delete
      ];

      controlChars.forEach((char) => {
        const input = `hello${char}world`;
        const result = sanitizeText(input);
        expect(result).toBe("helloworld");
      });
    });

    it("should preserve normal text while removing dangerous content", () => {
      const input = "Normal text 123 with spaces & special chars";
      const result = sanitizeText(input);
      expect(result).toBe("Normal text 123 with spaces  special chars");
    });

    it("should handle complex sanitization scenarios", () => {
      // Test multiple replace operations in sequence
      const testCases = [
        { input: "", expected: "" },
        { input: "   ", expected: "" },
        { input: "<>&'\"", expected: "" },
        { input: "\x00\x01\x1F\x7F", expected: "" },
        { input: "  <test>  ", expected: "test" },
        { input: "mix&ed<>content'\"\x00\x7F", expected: "mixedcontent" },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(sanitizeText(input)).toBe(expected);
      });
    });
  });

  describe("rateLimitCheck", () => {
    it("should allow first request", async () => {
      // Wait to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(rateLimitCheck()).toBe(true);
    });

    it("should block rapid consecutive requests", async () => {
      // Wait to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 150));
      rateLimitCheck(); // First call
      expect(rateLimitCheck()).toBe(false); // Should be blocked
    });

    it("should allow request after sufficient time delay", async () => {
      // Wait to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 150));
      rateLimitCheck(); // First call

      // Wait for rate limit to reset (110ms > 100ms minimum interval)
      await new Promise((resolve) => setTimeout(resolve, 110));

      expect(rateLimitCheck()).toBe(true); // Should be allowed
    });

    it("should handle multiple rapid blocking attempts", async () => {
      // Wait to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 150));

      // First call should be allowed
      expect(rateLimitCheck()).toBe(true);

      // Multiple rapid calls should all be blocked
      expect(rateLimitCheck()).toBe(false);
      expect(rateLimitCheck()).toBe(false);
      expect(rateLimitCheck()).toBe(false);
      expect(rateLimitCheck()).toBe(false);
    });

    it("should reset properly after the minimum interval", async () => {
      // Wait to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 150));

      // First request
      expect(rateLimitCheck()).toBe(true);
      expect(rateLimitCheck()).toBe(false); // Blocked

      // Wait exactly the minimum interval
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should be allowed again
      expect(rateLimitCheck()).toBe(true);
      expect(rateLimitCheck()).toBe(false); // Next one blocked again
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

    it("should handle rate limiting edge cases", async () => {
      // Ensure we start with a clean rate limit state
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Test multiple rapid calls in isolation
      expect(rateLimitCheck()).toBe(true); // First call allowed
      expect(rateLimitCheck()).toBe(false); // Second call blocked
      expect(rateLimitCheck()).toBe(false); // Third call blocked

      // Wait for rate limit to reset
      await new Promise((resolve) => setTimeout(resolve, 110));

      // Should be allowed again after waiting
      expect(rateLimitCheck()).toBe(true);
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
