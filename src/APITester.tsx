import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/hello");

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = new URL(endpoint, location.href);
      const res = await fetch(url, { method });

      const data = await res.json();
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="api-tester">
      <form onSubmit={testEndpoint} className="endpoint-row">
        <Select name="method" value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          name="endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/api/hello"
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
      <Textarea
        ref={responseInputRef}
        readOnly
        placeholder="Response will appear here..."
        className="response-area min-h-[200px]"
      />
    </div>
  );
}
