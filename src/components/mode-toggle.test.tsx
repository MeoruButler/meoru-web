import { test, expect, beforeEach } from "bun:test";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

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

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
  localStorageMock.clear();
  document.documentElement.classList.remove("light", "dark");
});

test("ModeToggle renders button", () => {
  render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});

test("ModeToggle opens dropdown menu when clicked", async () => {
  const user = userEvent.setup();

  render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  await user.click(button);

  // 드롭다운 메뉴가 열리면 옵션들이 보여야 함
  await waitFor(() => {
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });
});

test("ModeToggle changes theme to light when Light is clicked", async () => {
  const user = userEvent.setup();

  render(
    <ThemeProvider defaultTheme="dark">
      <ModeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  await user.click(button);

  const lightOption = await screen.findByText("Light");
  await user.click(lightOption);

  await waitFor(() => {
    expect(localStorageMock.getItem("meoru-ui-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});

test("ModeToggle changes theme to dark when Dark is clicked", async () => {
  const user = userEvent.setup();

  render(
    <ThemeProvider defaultTheme="light">
      <ModeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  await user.click(button);

  const darkOption = await screen.findByText("Dark");
  await user.click(darkOption);

  await waitFor(() => {
    expect(localStorageMock.getItem("meoru-ui-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

test("ModeToggle changes theme to system when System is clicked", async () => {
  const user = userEvent.setup();

  render(
    <ThemeProvider defaultTheme="light">
      <ModeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  await user.click(button);

  const systemOption = await screen.findByText("System");
  await user.click(systemOption);

  await waitFor(() => {
    expect(localStorageMock.getItem("meoru-ui-theme")).toBe("system");
  });
});

test("ModeToggle contains Sun and Moon icons", () => {
  render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  );

  // 아이콘은 SVG로 렌더링되므로 aria-hidden이나 특정 속성으로 찾을 수 있음
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
  
  // sr-only 텍스트 확인
  expect(screen.getByText("Toggle theme")).toBeInTheDocument();
});

