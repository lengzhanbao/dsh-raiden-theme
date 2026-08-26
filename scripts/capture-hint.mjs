#!/usr/bin/env node
/**
 * Print browser capture instructions for Raiden live regression.
 */
console.log(`
Raiden 实况取证（在 3080 对话页控制台执行，等待 3 秒后）：

copy(JSON.parse(document.getElementById('dsh-raiden-theme-style').getAttribute('data-raiden-metrics')))

粘贴保存为：
  capture/chat-light.json   （浅色 + 有会话）
  capture/chat-dark.json    （深色 + 有会话）

然后运行：
  npm run verify -- capture/chat-light.json capture/chat-dark.json

关闭 metrics 写入（仅本地调试）：
  localStorage.setItem('dsh-raiden-theme:metrics', '0')
`)
