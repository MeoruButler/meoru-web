/**
 * Server Actions
 * 서버 측에서 실행되는 액션 함수들
 */

export interface CommandRequest {
  identification: string;
  command: string;
}

export interface CommandResponse {
  identification: string;
  command: string;
  isCorrect: boolean;
  timestamp: string;
}

/**
 * 명령어를 서버에 제출하고 결과를 반환하는 서버 액션
 */
export async function submitCommand(
  request: CommandRequest
): Promise<CommandResponse> {
  const response = await fetch("/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "요청 처리 중 오류가 발생했습니다.",
    }));
    throw new Error(error.error || "API 호출 실패");
  }

  return response.json();
}
