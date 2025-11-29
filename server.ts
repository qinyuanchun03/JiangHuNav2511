import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

// 这是一个简单的 Deno 文件服务器，用于服务构建后的 dist 目录
// 适用于需要在 Deno 环境中运行静态站点的场景
serve((req) => {
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});

console.log("Listening on http://localhost:8000");