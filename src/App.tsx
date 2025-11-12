import { APITester } from "./APITester";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import "./index.css";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="meoru-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          <div className="flex justify-end mb-4">
            <ModeToggle />
          </div>
          <h1>Bun + React</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <APITester />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
