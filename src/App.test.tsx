import { test, expect } from "bun:test";
import { screen, render } from "@testing-library/react";
import { App } from "./App";

test("App renders correctly", () => {
  render(<App />);

  const heading = screen.getByText("Bun + React");
  expect(heading).toBeInTheDocument();
});

test("App contains logo images", () => {
  render(<App />);

  const bunLogo = screen.getByAltText("Bun Logo");
  const reactLogo = screen.getByAltText("React Logo");

  expect(bunLogo).toBeInTheDocument();
  expect(reactLogo).toBeInTheDocument();
});

test("App contains edit instruction", () => {
  render(<App />);

  // 텍스트가 여러 요소로 나뉘어 있으므로 더 유연한 방법 사용
  const instruction = screen.getByText((content, element) => {
    return element?.textContent === "Edit src/App.tsx and save to test HMR";
  });
  expect(instruction).toBeInTheDocument();
});
