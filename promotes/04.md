设计手机端（iOS/Android）的 UI 与桌面端有很大不同。移动端更强调**单手操作**、**触觉反馈**以及**沉浸感**。Tauri 2.0 对移动端的支持意味着你可以直接复用 React/Vue 组件，但在 CSS 布局上需要适配“刘海屏”和触摸手势。

以下是针对 Tauri 移动端音乐播放器的 UI/UX Prompts：

---

### 第一部分：视觉灵感 Prompts (Midjourney / SD / DALL-E)

这些提示词旨在生成类似 Apple Music 或 Spotify 的现代、高质感移动端界面。

#### 场景 A：沉浸式播放页 (Now Playing Screen)

这是手机上最重要的界面。

> **Prompt:**
> `Mobile app UI design, music player "Now Playing" screen, iOS style. Large central album art with soft glowing diffused shadow (elevation). Background is a dynamic blurred gradient extracted from the album cover. Minimalist white typography. Clean playback controls at the bottom third for one-handed use. A thin, glowing progress bar. Dark mode, glassmorphism, high fidelity, 4k, dribbble trending.`

#### 场景 B：首页发现流 (Home Feed)

展示水平滚动的“最近播放”和垂直滚动的推荐列表。

> **Prompt:**
> `Mobile music app home screen UI. Dark theme. Horizontal carousel of square album covers at the top with "Recently Played" header. Vertical list of songs below with glass-effect list items. Bottom navigation bar with translucent blur. Neon accents, clean layout, modern typography, app store award winning design.`

---

### 第二部分：代码生成 Prompts (v0.dev / Claude / GPT)

移动端代码生成的关键在于**触摸区域（Touch Targets）和安全区域（Safe Areas）**。

#### 模块 1：全屏播放器容器 (Full Screen Player Overlay)

这是一个从底部弹出的模态层（Modal），需要处理手势和布局。

> **Prompt:**
> 请使用 React + TailwindCSS 设计一个移动端“正在播放”的全屏组件。
> **布局要求 (Flex Column)**：
> 1. **顶部**：一个用来指示“向下滑动收起”的灰色小短横条 (Capsule handle)，以及一个隐藏的“向下箭头”按钮。保留顶部安全距离 (`pt-safe` 或 `pt-12`)。
> 2. **中间 (封面)**：一张巨大的正方形专辑封面，带有深重的阴影 (`shadow-2xl`) 和圆角 (`rounded-2xl`)。
> 3. **下半部 (信息与控制)**：
> * 歌曲标题 (大号粗体) 和 歌手名 (灰色)。左对齐。
> * 进度条：全宽，拇指 (Thumb) 稍微放大以便手指拖动。
> * 主控制区：上一首、播放/暂停(超大圆形按钮)、下一首。水平居中分布。
> * 底部功能键：AirPlay 图标、歌词图标、列表图标。
> **移动端适配**：
> 
> 
> 
> 

> * 背景使用 `backdrop-blur-3xl` 叠加在深色背景上。
> * 所有按钮要有 `active:scale-95` (按下去缩小的反馈)，而不是 hover 效果。
> * 确保底部留出 Home Indicator 的安全距离 (`pb-safe` 或 `pb-8`)。
> 
> 

#### 模块 2：底部迷你播放器 + 导航栏 (Mini Player & Tab Bar)

这是用户浏览列表时的常驻组件。

> **Prompt:**
> 请设计一个固定的底部组合组件 (Dock)，包含“迷你播放器”和“底部导航栏”。
> **层级 1 (上方)：迷你播放器 (Mini Player)**
> * 高度 `h-14`，背景深灰半透明 (`bg-zinc-900/90 backdrop-blur-md`)。
> * 左侧：微缩封面图 + 歌名。
> * 右侧：播放/暂停按钮 + 喜爱(心形)按钮。
> * 边框：顶部有一条极细的分割线 (`border-t border-white/10`)。
> 
> 
> **层级 2 (下方)：导航栏 (Tab Bar)**
> * 高度 `h-20` (包含底部安全区)。
> * 3-4 个图标：Home, Search, Library。
> * 选中状态高亮为白色，未选中为灰色。
> 
> 
> **交互细节**：
> * 整个 Mini Player 区域是一个可点击的区域，点击后应展开全屏播放器。
> * 使用 `fixed bottom-0 w-full` 确保其吸底。
> 
> 

#### 模块 3：能够横向滑动的卡片流 (Horizontal Scroll View)

用于“最近播放”或“推荐专辑”。

> **Prompt:**
> 请写一个用于移动端的水平滚动容器组件。
> **特性**：
> 1. **容器**：`flex overflow-x-auto snap-x no-scrollbar` (隐藏滚动条)。
> 2. **卡片 Item**：固定宽度 (例如 `w-40`)，圆角图片，下方文字。
> 3. **吸附效果**：每个卡片设置 `snap-start`，实现类似原生 App 的滚动停止手感。
> 4. **间距**：第一个元素左边距 `pl-4`，最后一个元素右边距 `pr-4`，确保内容不贴边。
> 
> 

---

### 第三部分：移动端特有的 UX/技术建议

在开发 Tauri 移动端应用时，这些细节决定了它像不像一个“原生 App”：

1. **触觉反馈 (Haptics)**
* *Prompt 补充*：在所有按钮点击逻辑中加入 `Haptics.impact({ style: 'Light' })`。
* *Rust/Tauri*：使用 `tauri-plugin-haptics` 插件。当用户切歌、暂停、滑动进度条时，给予轻微的震动反馈，体验提升巨大。


2. **手势操作 (Gestures)**
* 不要只依赖点击。
* **Mini Player**：支持“向右滑动切歌”。
* **全屏播放页**：支持“向下滑动”收起页面（这通常需要 `framer-motion` 或 `use-gesture` 库配合 Tauri）。


3. **安全区域 (Safe Area) 与状态栏**
* Tailwind 默认不包含 `pt-safe` (iOS top notch) 和 `pb-safe` (iOS home indicator)。
* *解决方案*：你需要安装 `tailwindcss-safe-area` 插件，或者手动设置 CSS 变量：
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);

```


* **状态栏颜色**：在 Tauri 配置中，设置移动端状态栏为“透明”或与背景同色，以实现沉浸式效果。


4. **性能：图片加载**
* 手机的算力和内存比桌面紧缺。
* **列表页**：绝对不要加载 2000x2000 的原图封面。Rust 端必须在扫描时生成 `200x200` 的缩略图缓存，列表页只请求缩略图。



**下一步建议：**
你现在已经有了桌面端和移动端的 Promote。如果你的项目是**双端共用代码**（Monorepo），你需要考虑**响应式布局**。

你想看一个 **Tailwind 响应式配置的例子**（如何用一套代码同时适配桌面侧边栏和手机底部导航栏），还是想了解 **Tauri 如何处理移动端的系统权限**（读取安卓存储）？