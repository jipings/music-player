# AI Agents Configuration

This document describes the AI agents used in the Music Player project and their specific roles, responsibilities, and configuration.

## Overview

This is a Tauri-based desktop music player with a React frontend and Rust backend. The project uses oh-my-opencode's agent system for AI-assisted development.

## Agent Hierarchy

```
Sisyphus (Orchestrator)
├── Frontend Agent (UI/UX)
├── Backend Agent (Rust/Tauri)
├── Testing Agent (Quality Assurance)
└── DevOps Agent (Build/Deploy)
```

## Core Agents

### 1. Sisyphus - Master Orchestrator

**Role**: Primary orchestrator for all development tasks

**Responsibilities**:

- Task planning and delegation
- Cross-component coordination
- Architecture decisions
- Code review oversight

**Configuration**:

```json
{
  "model": "anthropic/claude-opus-4.5",
  "temperature": 0.1,
  "thinking_budget": 32000
}
```

**Usage**:

- Include `ultrawork` or `ulw` in prompts for maximum execution mode
- Use for complex multi-file changes
- Press Tab to enter Prometheus (Planner) mode for detailed work plans

---

### 2. Frontend Agent

**Role**: React/TypeScript UI development specialist

**Responsibilities**:

- Component development and refactoring
- Responsive design implementation
- State management (Zustand)
- Styling with Tailwind CSS
- Accessibility improvements

**Expertise**:

- React 19 + TypeScript
- Tailwind CSS 4
- Zustand state management
- Responsive design (mobile/desktop)
- Lucide React icons
- Glassmorphism UI patterns

**Key Files**:

- `src/components/**/*.tsx`
- `src/store/*.ts`
- `src/hooks/*.ts`
- `src/App.tsx`
- `src/App.css`

**Configuration**:

```json
{
  "category": "visual-engineering",
  "skills": ["frontend-ui-ux"],
  "model": "anthropic/claude-sonnet-4"
}
```

---

### 3. Backend Agent

**Role**: Rust/Tauri backend development specialist

**Responsibilities**:

- Tauri command implementations
- Audio processing logic
- Database operations (SQLite)
- File system operations
- Metadata extraction

**Expertise**:

- Rust programming
- Tauri 2 framework
- SQLite with rusqlite
- Audio libraries (rodio, lofty)
- Async programming with tokio

**Key Files**:

- `src-tauri/src/**/*.rs`
- `src-tauri/Cargo.toml`

**Configuration**:

```json
{
  "category": "ultrabrain",
  "model": "anthropic/claude-opus-4.5"
}
```

---

### 4. Testing Agent

**Role**: Quality assurance and test automation

**Responsibilities**:

- Unit test creation
- Integration test setup
- Test coverage improvement
- Mock data generation
- CI/CD test pipeline

**Expertise**:

- Jest testing framework
- React Testing Library
- Hook testing patterns
- Mock implementations
- Code coverage analysis

**Key Files**:

- `**/*.test.ts`
- `**/*.test.tsx`
- `**/__tests__/**/*.ts`
- `jest.config.js`

**Configuration**:

```json
{
  "category": "deep",
  "model": "anthropic/claude-sonnet-4"
}
```

---

### 5. DevOps Agent

**Role**: Build, deployment, and infrastructure

**Responsibilities**:

- Build configuration
- CI/CD pipeline setup
- Cross-platform builds
- Release management
- Performance optimization

**Expertise**:

- Vite build system
- Tauri CLI
- GitHub Actions
- Cross-platform compilation
- Bundle optimization

**Key Files**:

- `vite.config.ts`
- `package.json`
- `.github/workflows/*.yml`
- `src-tauri/tauri.conf.json`

**Configuration**:

```json
{
  "category": "unspecified-high",
  "model": "openai/gpt-5.2"
}
```

---

## Specialized Sub-Agents

### UI/UX Designer Agent

**When to use**: Design system changes, visual improvements, accessibility

**Expertise**:

- Glassmorphism design patterns
- Color theory and contrast
- Mobile-first responsive design
- Animation and transitions
- User experience flows

**Commands**:

```
/design - Create or update design system
/animate - Add animations and transitions
/responsive - Optimize for different screen sizes
```

### Database Agent

**When to use**: Schema changes, migrations, query optimization

**Expertise**:

- SQLite schema design
- Migration scripts
- Query optimization
- Data integrity

### Audio Processing Agent

**When to use**: Audio playback features, metadata handling

**Expertise**:

- rodio audio engine
- lofty metadata extraction
- Audio format support
- Playback controls

---

## Agent Collaboration Patterns

### Pattern 1: Feature Development

```
User Request → Sisyphus (Planning)
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
Frontend Agent  Backend Agent   Testing Agent
    └───────────────┬───────────────┘
                    ↓
              Sisyphus (Review)
                    ↓
              DevOps Agent (Build)
```

### Pattern 2: Bug Fix

```
User Report → Sisyphus (Analysis)
                  ↓
          Testing Agent (Reproduce)
                  ↓
    ┌─────────────┴─────────────┐
    ↓                           ↓
Frontend Agent            Backend Agent
    └─────────────┬─────────────┘
                  ↓
          Testing Agent (Verify)
```

### Pattern 3: Refactoring

```
User Request → Sisyphus (Impact Analysis)
                    ↓
            Oracle (Architecture Review)
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
Frontend Agent  Backend Agent   Testing Agent
    └───────────────┴───────────────┘
                    ↓
            Testing Agent (Regression)
```

---

## Agent Commands

### Quick Commands

| Command     | Agent         | Purpose              |
| ----------- | ------------- | -------------------- |
| `ulw`       | Sisyphus      | Ultra work mode      |
| `/test`     | Testing Agent | Run test suite       |
| `/build`    | DevOps Agent  | Build project        |
| `/design`   | UI/UX Agent   | Design mode          |
| `/debug`    | Oracle        | Debug complex issues |
| `/refactor` | All           | Refactoring mode     |

### Category-Based Invocation

```typescript
// Frontend work
task((category = 'visual-engineering'), (load_skills = ['frontend-ui-ux']));

// Complex logic
task((category = 'ultrabrain'));

// Quick fixes
task((category = 'quick'));

// Documentation
task((category = 'writing'));
```

---

## Best Practices

### 1. Task Delegation

- **Always delegate** to specialized agents for non-trivial tasks
- Use `run_in_background=true` for parallel exploration
- Provide clear, atomic task descriptions

### 2. Context Management

- Include relevant file paths in prompts
- Reference existing patterns from the codebase
- Use session_id for follow-up interactions

### 3. Quality Assurance

- Run tests after any implementation
- Verify with `lsp_diagnostics` before marking complete
- Never suppress type errors with `as any`

### 4. Documentation

- Update AGENTS.md when adding new agent roles
- Document agent-specific patterns and conventions
- Keep configuration examples up-to-date

---

## Troubleshooting

### Agent Not Responding

1. Check model availability in `~/.config/opencode/oh-my-opencode.json`
2. Verify authentication: `opencode auth login`
3. Review agent logs for errors

### Model Fallback Issues

Current fallback chain:

```
Claude Opus 4.5 → Kimi K2.5 → GLM-4.7 → GPT-5.3 → Gemini-3
```

If primary model fails, the system automatically tries the next in chain.

### Performance Issues

- Reduce `thinking_budget` for simpler tasks
- Use lighter models (`category="quick"`) for trivial changes
- Batch related changes to minimize context switching

---

## Configuration Reference

### Model Providers

| Provider         | Priority | Best For               |
| ---------------- | -------- | ---------------------- |
| Anthropic Claude | 1        | Complex orchestration  |
| OpenAI GPT       | 2        | Analysis and reasoning |
| Google Gemini    | 3        | Multimodal tasks       |
| GitHub Copilot   | 4        | Fallback               |
| OpenCode Zen     | 5        | Free tier              |
| Z.ai GLM         | 6        | Librarian tasks        |

### Agent Model Mapping

```json
{
  "sisyphus": "anthropic/claude-opus-4.5",
  "frontend": "anthropic/claude-sonnet-4",
  "backend": "anthropic/claude-opus-4.5",
  "testing": "anthropic/claude-sonnet-4",
  "devops": "openai/gpt-5.2"
}
```

---

## Contributing

To add a new agent role:

1. Define responsibilities and expertise
2. Add to agent hierarchy diagram
3. Document configuration options
4. Provide usage examples
5. Update collaboration patterns if needed

---

## License

This AGENTS.md is part of the Music Player project and follows the same MIT license.
