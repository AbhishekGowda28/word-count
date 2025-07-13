import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("should render children correctly", () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    const { getByTestId } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    expect(getByTestId("test-child")).toBeInTheDocument();
    expect(getByTestId("test-child")).toHaveTextContent("Test Content");
  });

  it("should render proper HTML structure", () => {
    const TestChild = () => <div>Content</div>;

    const { container } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    // Check that html element exists with lang attribute
    const htmlElement = container.querySelector("html");
    expect(htmlElement).toBeInTheDocument();
    expect(htmlElement).toHaveAttribute("lang", "en");

    // Check that body element exists
    const bodyElement = container.querySelector("body");
    expect(bodyElement).toBeInTheDocument();
  });

  it("should render multiple children correctly", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </RootLayout>
    );

    expect(getByTestId("child-1")).toBeInTheDocument();
    expect(getByTestId("child-2")).toBeInTheDocument();
    expect(getByTestId("child-1")).toHaveTextContent("First Child");
    expect(getByTestId("child-2")).toHaveTextContent("Second Child");
  });

  it("should handle empty children", () => {
    const { container } = render(<RootLayout>{null}</RootLayout>);

    const bodyElement = container.querySelector("body");
    expect(bodyElement).toBeInTheDocument();
    expect(bodyElement).toBeEmptyDOMElement();
  });

  it("should render with proper accessibility attributes", () => {
    const TestChild = () => <main>Main Content</main>;

    const { container } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    const htmlElement = container.querySelector("html");
    expect(htmlElement).toHaveAttribute("lang", "en");
  });
});

describe("metadata", () => {
  it("should have correct title", () => {
    expect(metadata.title).toBe("Word Cloud Generator");
  });

  it("should have correct description", () => {
    expect(metadata.description).toBe(
      "Generate beautiful word clouds from your text"
    );
  });

  it("should have proper metadata structure", () => {
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
  });

  it("should have non-empty metadata values", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();

    // Type-safe checks for string length
    if (typeof metadata.title === "string") {
      expect(metadata.title.length).toBeGreaterThan(0);
    }

    if (typeof metadata.description === "string") {
      expect(metadata.description.length).toBeGreaterThan(0);
    }
  });
});
