import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../../components/Header";

describe("Header", () => {
  it("renders with default title and subtitle", () => {
    render(<Header />);

    expect(screen.getByText("Word Cloud Generator")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your text below and generate a beautiful word cloud"
      )
    ).toBeInTheDocument();
  });

  it("renders with custom title and subtitle", () => {
    const customTitle = "Custom Word Cloud App";
    const customSubtitle = "Create amazing word visualizations";

    render(<Header title={customTitle} subtitle={customSubtitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customSubtitle)).toBeInTheDocument();
  });

  it("renders with custom title and default subtitle", () => {
    const customTitle = "My Word Cloud";

    render(<Header title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your text below and generate a beautiful word cloud"
      )
    ).toBeInTheDocument();
  });

  it("has correct HTML structure", () => {
    render(<Header />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Word Cloud Generator");

    const subtitle = screen.getByText(
      "Enter your text below and generate a beautiful word cloud"
    );
    expect(subtitle.tagName).toBe("P");
  });
});
