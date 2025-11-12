"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface IdentificationFormProps {
  onIdentify: (identification: string) => void;
}

export function IdentificationForm({ onIdentify }: IdentificationFormProps) {
  const [identification, setIdentification] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identification.trim();
    if (trimmed) {
      onIdentify(trimmed);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Identification
          </CardTitle>
          <CardDescription>
            이름, 트위터 핸들, 또는 다른 식별자를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identification">식별자</Label>
              <Input
                ref={inputRef}
                id="identification"
                type="text"
                value={identification}
                onChange={(e) => setIdentification(e.target.value)}
                placeholder="예: 홍길동, @username, 또는 기타 식별자"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!identification.trim()}>
              시작하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

