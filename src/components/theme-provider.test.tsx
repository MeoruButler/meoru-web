import { test, expect, beforeEach, afterEach } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-provider";

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// matchMedia 모킹
const matchMediaMock = (matches: boolean) => ({
  matches,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
  localStorageMock.clear();
  document.documentElement.classList.remove("light", "dark");
});

afterEach(() => {
  localStorageMock.clear();
  document.documentElement.classList.remove("light", "dark");
});

// useTheme을 테스트하기 위한 테스트 컴포넌트
function TestComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
}

test("ThemeProvider renders children", () => {
  render(
    <ThemeProvider>
      <div>Test Content</div>
    </ThemeProvider>
  );

  expect(screen.getByText("Test Content")).toBeInTheDocument();
});

test("ThemeProvider uses default theme when no localStorage value", () => {
  render(
    <ThemeProvider defaultTheme="light">
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByTestId("theme")).toHaveTextContent("light");
  expect(document.documentElement.classList.contains("light")).toBe(true);
});

test("ThemeProvider reads theme from localStorage", () => {
  localStorageMock.setItem("meoru-ui-theme", "dark");

  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("ThemeProvider updates theme and saves to localStorage", async () => {
  const user = await import("@testing-library/user-event").then((m) =>
    m.default.setup()
  );

  render(
    <ThemeProvider defaultTheme="light">
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByTestId("theme")).toHaveTextContent("light");

  const darkButton = screen.getByText("Set Dark");
  await user.click(darkButton);

  expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  expect(localStorageMock.getItem("meoru-ui-theme")).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("ThemeProvider applies system theme when theme is system", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => matchMediaMock(true), // dark mode
  });

  render(
    <ThemeProvider defaultTheme="system">
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByTestId("theme")).toHaveTextContent("system");
  // 시스템이 다크 모드이면 dark 클래스가 추가되어야 함
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("ThemeProvider removes old theme classes when switching themes", async () => {
  const user = await import("@testing-library/user-event").then((m) =>
    m.default.setup()
  );

  render(
    <ThemeProvider defaultTheme="light">
      <TestComponent />
    </ThemeProvider>
  );

  expect(document.documentElement.classList.contains("light")).toBe(true);
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  const darkButton = screen.getByText("Set Dark");
  await user.click(darkButton);

  expect(document.documentElement.classList.contains("light")).toBe(false);
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});
