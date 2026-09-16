# Changelog

## 0.1.5 — 2026-09-16

### 紫金金粉装饰 + 侧栏板框

- 输入框 / 侧栏 / 对话框：紫金 SVG 角饰、尘条、蝴蝶结、边缘尘点（不撑大边框）
- 「新会话」「设置」展开态：同款紫金板框 `::after`，暗色下描边与光晕加强
- Hero 标题组下补紫金短尘条
- `build.ps1`：无 DSH checkout 缺 `.pnpm` / 仅有 `tsc.cmd` 时也能烘焙 CSS 并 host 编译

## 0.1.4 — 2026-09-16

### 兼容 DSH 0.1.6-alpha（去掉 `dsh-client-runtime`）

- ClientContext 改从 `@deepseek-ai/cordis` 引入；补 locale / ui-renderer 的 type-only Context merge
- `dsh.client.inject`：去掉已删除的 `@deepseek-ai/dsh-client-runtime`，改依赖 `dsh-client-ui-renderer`
- peerDependencies 收拢为 `>=0.1.0-rc.1 <0.2.0-0`（覆盖 0.1.5 / 0.1.6-alpha）

## 0.1.3 — 2026-09-10

### 修复空态大字被官方默认盖回（`探索未至之境`）

- DSH 0.1.5-rc.1 重构空态组件，删了 `headlineText` 类名，标题变成标题组里的裸 span。
  旧选择器 `[class*='headlineText']` 匹配不到，替换逻辑静默跳过，默认大字直接露出。
- `hero-copy.ts` 改认新结构：`[data-phase='hero']` 容器下找第一个纯文本 span，
  且仅当文本命中官方默认（中文/英文/旧雷电文案）才替换，用户自定义标题不碰。
- `chrome-observer.ts` 同步改监测范围；单测按新版 DOM 重写。

## 0.1.2 — 2026-09-10

### 兼容 DSH 0.1.5-rc.1

- `peerDependencies` 各 `@deepseek-ai/*` 范围追加 `^0.1.5-rc.1`（此前上限 `<0.2.0-0`
  prerelease 线）。主题只用稳定 API（cordis / slots / webServer），无需改代码。

### 打包修复（与 Taffy v0.1.3 同类事故）

- `files` 白名单补上 `lib/boot-raiden.js`：`lib/index.js` 引用了它，但白名单漏掉，
  `npm pack` 排除后 DSH 加载报 `ERR_MODULE_NOT_FOUND ... boot-raiden.js`。
  本地开发目录文件齐全所以一切正常，只有解包后的 tarball 会炸。

## 0.1.1 — 2026-09-03

### 动画与流畅度（按玻璃拟态动效规范）

- 持续动画只走合成器：星光层 `background-position` 改 `translate3d` + `opacity`
- 纱幕呼吸 `saturate` 滤镜改 `opacity` 脉冲，全屏重绘降为透明度合成
- 标题浮动 `box-shadow` 逐帧绘制精简为纯 `transform`，静态光环保留在基类
- 标题渐变流光周期 7s → 8.5s（渐变周期不低于 8 秒）
- 发送按钮光晕减弱并放缓 2.8s → 3.4s
- `will-change: transform, opacity` 仅加在星光/标题/发送按钮上，滤镜类动画不加
- `prefers-reduced-motion` 补上星光层；窗口 resize 时星光/纱幕/边框一并暂停

### 主题纯度

- 清理混入的 Taffy 粉色硬编码（约 40 处），Raiden 全量回归紫金色板
- 重命名 `TAFFY_*` 残留常量为 `RAIDEN_*`
- 测试基线对齐 Raiden 色值（浅底 `244,238,252` / 深底 `22,12,38`）

### 设置（对齐 Taffy）

- 新增「个性化」：标题文案、头像图片地址（留空恢复默认，300ms 防抖）
- 标题文案设置驱动 + 单记录还原；标题同步走 rAF 合帧
- 新增文本输入框样式（`.dsh-raiden-text-row`）
- 新增 2 项 hero 文案测试（94 项通过）

### 工程

- 重新生成 `src/client/theme-css.ts` 与 `lib/client.js`

## 0.1.0 — 2026-08-26

### 主题与视觉

- 新包 `@dsh-external/dsh-raiden-theme`（与 Taffy 主题独立仓库）
- 浅色天守花房 / 深色雷舞台全屏壁纸（1920×1280，融合立绘场景）
- 紫金亚克力对话框、侧栏 trim、环境粒子（樱瓣 / 电光）
- 首页标题替换为「原神！！！启动！！！」
- Q 版功能图标：品牌头像、命令芯片、发送、设置等

### 工作区 Q 版动图

- 侧栏 **工作区** 区域挂载慢速 6 帧动图（无损 WebP，浅/深各一套）
- 外轮廓抗锯齿透明、主体内不透明；主题色边缘去黑边
- 设置项 **工作区 Q 版动图** 可单独开关
- `prefers-reduced-motion` 与「减弱动效」自动降级为静帧

### 设置与工程

- **雷电将军工房** 设置面板：总开关、透明度滑块、立绘、动效
- 资产门控 v17、92 项测试、verify/pack 发布流水线
- 可选 Agent 预设「Raiden 雷电将军」
