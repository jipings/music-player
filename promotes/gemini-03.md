为了帮助你快速落地 UI/UX 设计，我们可以将“Prompt（提示词）”分为两类：

1. **视觉灵感类 (Visual Inspiration)**：用于 Midjourney / Stable Diffusion / DALL-E 3，生成高保真的设计参考图，寻找“感觉”。
2. **代码生成类 (Code Generation)**：用于 v0.dev / ChatGPT / Claude，直接生成基于 TailwindCSS 的 HTML 结构代码。

以下是为你定制的 Prompt 策略：

---

### 第一部分：视觉灵感 Prompts (Midjourney / SD / DALL-E)

这些提示词旨在生成现代、干净、带有“毛玻璃”质感的桌面应用设计图。

#### 场景 A：主界面（沉浸式 + 列表）

这个界面展示左侧导航、中间的歌单网格，以及背景透出的专辑封面氛围。

> **Prompt:**
> `Desktop music player UI design, dark mode, glassmorphism style. Layout: Left sidebar with acrylic blur effect, main content area with a grid of album covers, sleek typography. A large, blurred, colorful abstract background derived from album art. Modern, minimalist, high fidelity, Dribbble trending, Figma style, Tailwind CSS aesthetic, rounded corners, soft shadows, 4k resolution.`

**设计意图解析：**

* **Acrylic blur (亚克力模糊)**：对应 Windows/macOS 原生的高级质感。
* **Grid of album covers**：展示核心内容管理。
* **Derived background**：暗示根据当前播放的歌曲动态改变背景色。

#### 场景 B：播放详情页（Now Playing）

专注于当前播放的歌曲，展示大封面、波形或进度条。

> **Prompt:**
> `Music player "Now Playing" screen UI, close up. Large high-quality vinyl album art in the center, glowing drop shadows. Background is a deep, dark, frosted glass effect overlaying the album colors. Minimalist playback controls (Play, Pause, Skip) in white. A sleek, thin progress bar with a glowing accent color. Clean sans-serif font for song title and artist. Atmospheric lighting, cyber-minimalism.`

---

### 第二部分：代码生成 Prompts (v0.dev / Claude / GPT)

你可以直接把这些 Prompt 发给 AI 编程助手，让它为你生成基于 TailwindCSS 的组件代码。

#### 模块 1：整体布局 (App Layout)

这个 Prompt 帮你搭建 Sidebar（侧边栏）、Main Content（主内容区）和 Bottom Player（底部播放条）的骨架。

> **Prompt:**
> 请使用 React + TailwindCSS 编写一个桌面音乐播放器的布局骨架。
> **要求：**
> 1. **整体结构**：屏幕高度 100vh，Flexbox 布局。
> 2. **Sidebar (左侧)**：宽度 64 (w-64)，背景色为深灰 (`bg-neutral-900`)，包含 "Library", "Search", "Settings" 三个图标按钮。
> 3. **Bottom Player (底部)**：固定在底部，高度 24 (h-24)，背景使用毛玻璃效果 (`backdrop-blur-xl bg-black/60`)，包含播放控制按钮和进度条。
> 4. **Main Content (中间)**：占据剩余空间，允许滚动。背景色为深黑 (`bg-black`)，但要有一个从上到下的渐变，模拟灯光效果。
> 5. **风格**：所有元素使用圆角 (`rounded-lg`)，字体颜色为 `text-white` 或 `text-gray-400`。请确保看起来像一个原生的 macOS 应用。
> 
> 

#### 模块 2：底部播放控制条 (Player Bar Component)

这是交互最频繁的区域，需要精细的 Tailwind 类名。

> **Prompt:**
> 请设计一个基于 TailwindCSS 的音乐播放器底部控制条组件 (PlayerBar)。
> **包含三个区域 (Flex Row)**：
> 1. **左侧 (Track Info)**：显示一张小的专辑封面 (12x12)，歌名 (白色加粗)，歌手名 (灰色小字)。
> 2. **中间 (Controls)**：
> * 上一首/播放/下一首 按钮。播放按钮要大一号，并且有一个圆形的背景 (`bg-white text-black`)。
> * 下方有一个进度条 (`input type="range"`)，进度条颜色要是强调色 (例如 `accent-emerald-500`)，高度细长。
> 
> 
> 3. **右侧 (Volume)**：音量图标和音量滑块。
> **特殊要求**：
> 
> 
> * 整个控制条背景半透明 (`bg-opacity-90`)。
> * 鼠标悬停在按钮上时，要有轻微的缩放效果 (`hover:scale-105 transition`)。
> 
> 

#### 模块 3：带有自适应背景的卡片 (Album Card)

这是实现“根据封面变色”的基础。

> **Prompt:**
> 请写一个 Album Card 组件，用于网格布局中。
> **包含**：
> 1. 图片容器：圆角，鼠标悬停时图片轻微上浮并出现阴影 (`hover:-translate-y-2`)。
> 2. 播放按钮：默认隐藏，鼠标悬停在卡片上时，在图片右下角浮现一个绿色的播放按钮 (`group-hover:opacity-100`)。
> 3. 文字信息：图片下方显示专辑名和年份。
> **Tailwind 技巧**：使用 `group` 类来实现父元素悬停控制子元素显示。
> 
> 

---

### 第三部分：UX 交互逻辑建议 (写给开发者的 Note)

在设计 UI 时，请务必考虑到以下 Rust 后端特有的交互逻辑：

1. **延迟反馈处理**：
* *问题*：点击“播放” -> 发送 IPC 给 Rust -> Rust 加载文件 -> 开始播放。这中间可能有 100-300ms 的延迟。
* *UX 建议*：点击播放按钮后，按钮应立即变为“加载中”状态（或立即变为暂停图标），即使声音还没出来，也要给用户**即时视觉反馈**。


2. **封面图占位符 (Skeleton)**：
* *问题*：Rust 扫描 5000 首歌的封面需要时间。
* *UX 建议*：在图片加载出来之前，不要留白，显示一个带有深灰色脉冲动画 (`animate-pulse bg-gray-800`) 的占位符，或者显示一个通用的音符图标。


3. **无限滚动的平滑度**：
* *问题*：当列表很长时，不要一次性渲染所有 DOM。
* *UX 建议*：设计列表 Item 时，高度必须固定（例如 `h-16`），这样方便使用 Virtual Scroll（虚拟滚动）库进行计算，避免滚动卡顿。



**下一步建议：**
你需要我先为你生成 **“底部播放控制条”的 Tailwind 代码**，还是先帮你写 **Rust 端用于提取 MP3 封面颜色的逻辑**（为了实现背景自适应效果）？