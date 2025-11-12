"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { submitCommand } from "@/lib/actions";
import { Terminal as TerminalIcon, X, Minus, Square } from "lucide-react";

interface CommandHistory {
  command: string;
  timestamp: Date;
  isError: boolean;
}

interface TerminalProps {
  identification: string;
}

export function Terminal({ identification }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // 명령어 제출 후 입력 필드에 포커스
  useEffect(() => {
    if (!isLoading && !isCorrect && history.length > 0) {
      // 다음 프레임에서 포커스하여 DOM 업데이트 후 실행
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [history.length, isLoading, isCorrect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) return;

    setIsLoading(true);
    setInput(""); // 입력 필드를 먼저 비워서 사용자 경험 개선

    try {
      // 서버 액션 호출
      const data = await submitCommand({
        identification,
        command: trimmedInput,
      });

      const isCorrectAnswer = data.isCorrect === true;

      setHistory((prev) => [
        ...prev,
        {
          command: trimmedInput,
          timestamp: new Date(),
          isError: !isCorrectAnswer,
        },
      ]);

      if (isCorrectAnswer) {
        setIsCorrect(true);
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
      setHistory((prev) => [
        ...prev,
        {
          command: trimmedInput,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden bg-[#1e1e1e] border-[#3a3a3a] shadow-2xl rounded-lg">
        {/* macOS 터미널 헤더 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center">
              <X className="w-2 h-2 text-[#9d0006] opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center">
              <Minus className="w-2 h-2 text-[#9d5f00] opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center">
              <Square className="w-2 h-2 text-[#1e6530] opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
              <TerminalIcon className="w-3 h-3" />
              <span>bash</span>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* 터미널 콘텐츠 영역 */}
          <ScrollArea className="min-h-[400px] max-h-[600px]">
            <div className="p-4 bg-[#1e1e1e] font-mono text-sm selection:bg-[#264f78]">
              {/* 환영 메시지 */}
              <div className="text-[#a0a0a0] mb-4">
                <div>Last login: {new Date().toLocaleString("ko-KR")}</div>
                <div className="mt-1">
                  Welcome to Meoru Terminal,{" "}
                  <span className="text-[#4ec9b0]">{identification}</span>.
                </div>
                <div className="mt-1">Type a command to get started.</div>
              </div>

              {/* 명령어 히스토리 */}
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#4ec9b0]">$</span>
                    <span className="text-[#d4d4d4]">{item.command}</span>
                  </div>
                  {item.isError ? (
                    <div className="text-[#f48771] ml-6 animate-in fade-in duration-300">
                      <div>zsh: command not found: {item.command}</div>
                      <div className="text-[#a0a0a0] text-xs mt-1">
                        💡 힌트: bunx로 시작하는 명령어를 입력해보세요
                      </div>
                    </div>
                  ) : (
                    <div className="text-[#4ec9b0] ml-6">
                      {isCorrect && index === history.length - 1 && (
                        <div className="space-y-2">
                          <div className="text-[#ce9178]">
                            {"//"} 🎉 정답입니다!
                          </div>
                          <div className="text-[#dcdcaa]">
                            {"//"} 이스터 에그를 발견하셨네요!
                          </div>
                          <div className="text-[#4ec9b0] whitespace-pre-wrap">
                            {`╔═══════════════════════════════════════╗
║                                       ║
║         🎊  WELCOME TO MEORU  🎊      ║
║                                       ║
║    당신은 이스터 에그를 발견했습니다!    ║
║                                       ║
║    "bunx intro" 명령어를 입력하신      ║
║    당신은 정말 대단합니다! 👏          ║
║                                       ║
╚═══════════════════════════════════════╝`}
                          </div>
                          <div className="text-[#ce9178] mt-4">
                            {"//"} 이제 진짜로 bunx intro를 실행해보세요!
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* 정답 이스터 에그 애니메이션 */}
              {isCorrect && (
                <div className="mt-4 animate-pulse">
                  <div className="text-[#4ec9b0] text-xs">
                    {"//"} 이 페이지는 계속해서 업데이트됩니다...
                  </div>
                </div>
              )}

              {/* 입력 프롬프트 */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 mt-4"
              >
                <span className="text-[#4ec9b0]">$</span>
                <div className="flex-1 relative flex items-center">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "bg-transparent border-0 p-0 text-[#d4d4d4] w-full pr-4",
                      "focus-visible:ring-0 focus-visible:outline-none",
                      "placeholder:text-[#6a6a6a]"
                    )}
                    placeholder="명령어를 입력하세요..."
                    disabled={isCorrect || isLoading}
                  />
                  {!isCorrect && !isLoading && input.length === 0 && (
                    <span className="absolute left-0 text-[#4ec9b0] animate-pulse pointer-events-none">
                      ▋
                    </span>
                  )}
                  {isLoading && (
                    <span className="absolute right-0 text-[#a0a0a0] text-xs">
                      처리 중...
                    </span>
                  )}
                </div>
              </form>

              <div ref={historyEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
