import { render, screen } from "@testing-library/react-native";
import React from "react";
import { ThemedText } from "../themed-text";

// Mock the hook
jest.mock("@/hooks/use-theme-color", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));

describe("ThemedText", () => {
  it("renders text correctly", () => {
    render(<ThemedText>Hello World</ThemedText>);
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("applies correct font family for weight 700", () => {
    const { getByText } = render(
      <ThemedText weight="700">Bold Text</ThemedText>,
    );
    const textElement = getByText("Bold Text");
    // Styles are often arrays in RN, check if any object in the array matches
    const styles = Array.isArray(textElement.props.style) 
      ? textElement.props.style 
      : [textElement.props.style];
    
    expect(styles.some(s => s && s.fontFamily === "Pally-Bold")).toBe(true);
  });
});
