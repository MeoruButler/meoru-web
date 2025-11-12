import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Terminal } from "@/components/terminal";
import { IdentificationForm } from "@/components/identification-form";
import "./index.css";

export function App() {
  const [identification, setIdentification] = useState<string | null>(null);

  return (
    <ThemeProvider defaultTheme="system" storageKey="meoru-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          <div className="flex justify-end mb-4">
            <ModeToggle />
          </div>
          {identification ? (
            <Terminal identification={identification} />
          ) : (
            <IdentificationForm onIdentify={setIdentification} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
