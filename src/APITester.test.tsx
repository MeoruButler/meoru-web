import { test, expect } from "bun:test";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { APITester } from "./APITester";

test("APITester renders form elements", () => {
  render(<APITester />);

  expect(screen.getByRole("combobox")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("/api/hello")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText("Response will appear here...")
  ).toBeInTheDocument();
});

test("APITester has default endpoint value", () => {
  render(<APITester />);

  const endpointInput = screen.getByPlaceholderText(
    "/api/hello"
  ) as HTMLInputElement;
  expect(endpointInput.value).toBe("/api/hello");
});

test("APITester form submission calls fetch", async () => {
  const user = userEvent.setup();
  let fetchCalled = false;
  let fetchUrl = "";

  // location.href 모킹
  Object.defineProperty(window, "location", {
    value: { href: "http://localhost:3000" },
    writable: true,
  });

  global.fetch = ((input: RequestInfo | URL) => {
    fetchCalled = true;
    fetchUrl = typeof input === "string" ? input : input.toString();
    return Promise.resolve({
      json: () => Promise.resolve({ message: "Hello, world!" }),
    } as Response);
  }) as typeof fetch;

  render(<APITester />);

  const submitButton = screen.getByRole("button", { name: /send/i });
  await user.click(submitButton);

  // Wait for async operations
  await new Promise((resolve) => setTimeout(resolve, 200));

  expect(fetchCalled).toBe(true);
  expect(fetchUrl).toContain("/api/hello");
});
