export default {
  translation: {
    nav: {
      features: "Features",
      themes: "Themes",
      changelog: "Changelog",
      star: "Star",
      download: "Download"
    },
    footer: {
      product: "Product",
      community: "Community",
      newsChannel: "News Channel",
      discussGroup: "Discussion Group",
      rights: "All rights reserved.",
      designed: "Designed with ♥ for developers."
    },
    demo: {
      search: "Search",
      searchRepo: "Search repositories",
      addRepo: "Add repository",
      searchWorktree: "Search worktree",
      tabs: {
        agent: "Agent",
        files: "Files",
        terminal: "Terminal",
        sourceControl: "Source Control"
      },
      status: {
        bypassPermissions: "bypass permissions on",
        cycleHint: "(shift+tab to cycle)"
      }
    },
    ensocode: {
      hero: {
        badge: "v0.1 Early Access is now available",
        title: "One Developer,",
        titleHighlight: "An Agent Fleet",
        subtitle: "A local-first desktop workbench built on Electron + pi. Orchestrate parallel agents across repositories, review diffs right in the timeline, and keep steering from your phone over end-to-end encryption.",
        cta: {
          download: "Download Now",
          manifest: "Source Code"
        }
      },
      features: {
        title: "Command, Not Just Code.",
        subtitle: "EnsoCode doesn't just write code for you — it orchestrates, supervises, and collaborates with teams of specialized agents.",
        items: {
          orchestration: {
            title: "Agent Fleet Orchestration",
            desc: "Pin repositories to the sidebar, one session per task. Dispatch one-shot Subagents or hire persistent Coworkers with dedicated tabs and memory."
          },
          review: {
            title: "Embedded Review & Checkpoints",
            desc: "Diffs render inline in the conversation flow. Toggle three approval modes on the fly, backed by automatic Git checkpoints with one-click rollback."
          },
          mobile: {
            title: "Mobile Companion & Remote Nodes",
            desc: "Pair a PWA companion via QR code with end-to-end encryption. Approve, steer, and answer agents anywhere — or drive remote machines over SSH."
          },
          personalization: {
            title: "Presets & Personalization",
            desc: "Bundle models, skills, MCP servers, and prompts into reusable presets. Import configs from Claude Code, Codex, and Cursor in one click."
          }
        }
      },
      themes: {
        title: "Your aesthetic, preserved.",
        desc: "Built-in Ghostty terminal color engine with seamless light & dark themes, background images, and glassmorphism opacity tuning.",
        more: "400+ Ghostty themes..."
      },
      footer: {
        tagline: "One developer. An entire fleet of autonomous coding agents."
      },
      demo: {
        search: "Search conversations...",
        thisComputer: "This computer",
        active: "Active",
        hire: "Hire coworker",
        thinking: "Thinking…",
        thought: "Thought for {{duration}}",
        generating: "Working…",
        working: "working",
        paused: "paused",
        todos: "Todos",
        todosHide: "Hide until the todo list updates",
        fold: {
          worked: "Worked for {{duration}}",
          thinking_one: "{{count}} thinking step",
          thinking_other: "{{count}} thinking steps",
          tools_one: "{{count}} tool call",
          tools_other: "{{count}} tool calls"
        },
        tools: {
          read: "read",
          bash: "bash",
          search: "grep",
          edit: "Apply patch",
          subagent: "subagent"
        },
        approval: {
          title: "Approval required",
          allow: "Allow",
          deny: "Deny",
          allowSession: "Always allow this session"
        },
        modes: {
          full: "Supervised",
          auto: "Auto-accept edits",
          access: "Full access"
        },
        modesHint: "Click to cycle approval modes",
        global: "Global",
        local: "Local",
        med: "Med",
        composer: {
          idle: "Type @ to choose a file or Agent",
          running: "Message will queue until this round finishes…",
          locked: "Resolve the pending approval to continue"
        }
      }
    },
    ensoai: {
      hero: {
        badge: "v0.2 Beta is now available",
        title: "Multiple Agents,",
        titleHighlight: "Parallel Flow",
        subtitle: "Unleash parallel intelligence within a single project. Let Claude, Gemini, and Codex weave through different worktrees simultaneously without context switching.",
        cta: {
          download: "Download Now",
          manifest: "Source Code"
        }
      },
      features: {
        title: "Workflow, Reimagined.",
        subtitle: "Stop stashing and popping. EnsoAI treats every branch as a first-class workspace with its own dedicated AI context.",
        items: {
          aiNative: {
            title: "Multi-Agent Matrix",
            desc: "Seamlessly switch between Claude, Codex, Gemini, and local LLMs. Each worktree gets its own persistent AI session."
          },
          blazingFast: {
            title: "Visual Source Control",
            desc: "Review diffs, stage changes, and manage commits with a beautiful, keyboard-centric Git interface."
          },
          beautifulThemes: {
            title: "Integrated File Editor",
            desc: "Built-in Monaco editor for quick edits. Syntax highlighting for 50+ languages with drag-and-drop multi-tab support."
          },
          visualGit: {
            title: "AI Code Review",
            desc: "Auto-generate high-quality commit messages and perform deep code reviews using your favorite AI agents."
          },
          mergeTool: {
            title: "3-Way Merge Tool",
            desc: "Built-in professional 3-way merge editor. Clearly visualize conflict sources and resolve them with a single click and real-time result preview."
          },
          globalSearch: {
            title: "Global Search",
            desc: "JetBrains-style project-wide search. Search by filename or content with real-time preview and instant navigation to matches."
          },
          workspaces: {
            title: "IDE Bridge",
            desc: "Use EnsoAI for orchestration, then jump into VS Code or Cursor for deep diving with a single click."
          },
          shellIntegration: {
            title: "Git Worktree Management",
            desc: "Create, switch, and manage Git worktrees instantly. No more context switching costs between branches."
          }
        }
      },
      themes: {
        title: "Your aesthetic, preserved.",
        desc: "EnsoAI respects your taste. Built-in variety of Ghostty themes, customizable fonts, and synchronized visual style across all worktrees.",
        more: "400+ more Ghostty themes..."
      },
      footer: {
        tagline: "Git Worktree Manager + AI Programming Assistant."
      }
    }
  }
}
