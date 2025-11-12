import { test, expect } from "bun:test";
import { screen, render } from "@testing-library/react";
import { App } from "./App";

test("App renders correctly", () => {
  render(<App />);

  const heading = screen.getByText("Bun + React");
  expect(heading).toBeInTheDocument();
});

test("App contains edit instruction", () => {
  render(<App />);

  // 텍스트가 여러 요소로 나뉘어 있으므로 더 유연한 방법 사용
  const instruction = screen.getByText((content, element) => {
    return element?.textContent === "Edit src/App.tsx and save to test HMR";
  });
  expect(instruction).toBeInTheDocument();
});

test("App contains ModeToggle", () => {
  render(<App />);

  const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
  expect(toggleButton).toBeInTheDocument();
});
