import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/command": {
      async POST(req) {
        try {
          const body = await req.json();
          const { identification, command } = body;

          if (!identification || !command) {
            return Response.json(
              { error: "identification과 command가 필요합니다." },
              { status: 400 }
            );
          }

          // 정답 검증: "bunx intro"가 정답
          const isCorrect = command.trim() === "bunx intro";

          return Response.json({
            identification,
            command,
            isCorrect,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          return Response.json(
            { error: "요청 처리 중 오류가 발생했습니다." },
            { status: 500 }
          );
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
