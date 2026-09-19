export default {
  translation: {
    nav: {
      features: "特性",
      themes: "主题",
      changelog: "更新日志",
      star: "Star",
      download: "下载"
    },
    footer: {
      product: "产品",
      community: "社区",
      newsChannel: "更新频道",
      discussGroup: "讨论群组",
      rights: "保留所有权利。",
      designed: "为开发者 ♥ 设计。"
    },
    demo: {
      search: "搜索",
      searchRepo: "搜索仓库",
      addRepo: "添加仓库",
      searchWorktree: "搜索 worktree",
      tabs: {
        agent: "Agent",
        files: "文件",
        terminal: "终端",
        sourceControl: "源代码管理"
      },
      status: {
        bypassPermissions: "bypass permissions on",
        cycleHint: "(shift+tab to cycle)"
      }
    },
    ensocode: {
      hero: {
        badge: "v0.1 抢先体验版现已发布",
        title: "一个人，",
        titleHighlight: "带一队 Coding Agent",
        subtitle: "基于 Electron 与 pi 构建的本地 Agent 协同工作台。多仓库并行调度 Subagent 与 Coworker，改动在时间线中透明可审，离座也能通过手机端到端加密同步继续推进。",
        cta: {
          download: "立刻下载",
          manifest: "查看源码"
        }
      },
      features: {
        title: "不止写码，更在指挥。",
        subtitle: "EnsoCode 不只帮你写单点代码，更负责调度、监督与协同一支多 Agent 队伍。",
        items: {
          orchestration: {
            title: "Agent 舰队调度",
            desc: "仓库挂进侧栏，一件事一个会话。一次性任务派 Subagent 即完即毁，长线协作雇 Coworker 拥有专属 Tab 与持久记忆。"
          },
          review: {
            title: "内嵌审查与快照回滚",
            desc: "Diff 直接嵌入对话时间线，三档审批随时切换。Git Checkpoint 自动快照，改乱了一键无损还原。"
          },
          mobile: {
            title: "手机伴侣与远程节点",
            desc: "扫码即连的 PWA 伴侣端，端到端加密。随时随地审批、插话、推进任务，也可通过 SSH 直连远程机器。"
          },
          personalization: {
            title: "预设与个性化",
            desc: "将模型、技能、MCP 与 Prompt 固化为可复用预设。一键导入 Claude Code、Codex、Cursor 的既有配置。"
          }
        }
      },
      themes: {
        title: "延续你的美学。",
        desc: "内置 Ghostty 终端配色引擎，浅色/深色无缝切换，支持背景图与毛玻璃透明度调节。",
        more: "以及 400+ 更多 Ghostty 主题..."
      },
      footer: {
        tagline: "一个人，带一队 Coding Agent。"
      },
      demo: {
        search: "搜索会话",
        repos: "{{count}} 个仓库",
        sessions: "{{count}} 个会话",
        hire: "雇用 Coworker",
        thinking: "思考中…",
        goal: "目标",
        working: "工作中",
        paused: "已暂停",
        subagent: "子代理",
        coworker: "数字同事",
        dispatchedTo: "已派发给",
        completed: "已完成",
        tools: {
          read: "读取文件",
          bash: "运行命令",
          search: "搜索",
          edit: "编辑文件"
        },
        approval: {
          title: "需要审批",
          allow: "允许",
          deny: "拒绝",
          allowSession: "本会话始终允许",
          approve: "批准",
          reject: "拒绝",
          approved: "已批准",
          rejected: "已拒绝"
        },
        modes: {
          full: "逐项审批",
          auto: "自动接受",
          access: "完全放行"
        },
        modesHint: "点击切换审批档位",
        composer: "继续输入…",
        phone: {
          desktop: "桌面端",
          thinking: "思考中…",
          done: "完成",
          coworkerTask: "在专属 Tab 中工作",
          composer: "继续输入…"
        }
      }
    },
    ensoai: {
      hero: {
        badge: "v0.2 Beta 现已发布",
        title: "多路智能",
        titleHighlight: "并行穿梭",
        subtitle: "让多路 AI 助手化身并行线程，在同一个项目的不同分支间自由穿梭。Claude、Gemini 与 Codex 同步协作，思路永不中断。",
        cta: {
          download: "立刻下载",
          manifest: "查看源码"
        }
      },
      features: {
        title: "重构你的工作流",
        subtitle: "告别 git stash。EnsoAI 将每个分支视为一等公民，赋予其独立的工作区与 AI 上下文。",
        items: {
          aiNative: {
            title: "多 Agent 矩阵",
            desc: "无缝切换 Claude、Codex、Gemini 或本地 LLM。每个 Worktree 都有独立的持久化 AI 会话。"
          },
          blazingFast: {
            title: "内置 Git 管理器",
            desc: "优雅的可视化 Git 面板。通过键盘即可完成差异对比、暂存修改和提交代码。"
          },
          beautifulThemes: {
            title: "内置代码编辑器",
            desc: "基于 Monaco 构建的轻量级编辑器。支持 50+ 种语言高亮，提供流畅的多标签拖拽体验。"
          },
          visualGit: {
            title: "AI 代码审查",
            desc: "自动生成高质量的 Commit Message，并利用 AI 助手对代码变更进行深度审查与优化。"
          },
          mergeTool: {
            title: "三栏合并工具",
            desc: "内置专业的三栏合并编辑器。清晰展示冲突来源，支持一键采纳变更与实时结果预览，让解决冲突变得轻松愉悦。"
          },
          globalSearch: {
            title: "项目全局搜索",
            desc: "JetBrains 风格的全局搜索。支持文件名与内容双模式检索，实时预览匹配结果，精准定位目标代码。"
          },
          workspaces: {
            title: "IDE 桥接",
            desc: "在 EnsoAI 中统筹全局，一键跳转至 VS Code 或 Cursor 进行深度开发。无缝衔接现有工具链。"
          },
          shellIntegration: {
            title: "Worktree 管理",
            desc: "毫秒级创建与切换 Git Worktree。在不同功能分支间自由穿梭，无需重复配置环境。"
          }
        }
      },
      themes: {
        title: "延续你的美学。",
        desc: "EnsoAI 尊重你的品味。内置多种 Ghostty 主题，支持自定义字体，并在所有 Worktree 间同步你的视觉风格。",
        more: "以及 400+ 更多 Ghostty 主题..."
      },
      footer: {
        tagline: "Git Worktree 管理器 + AI 编程助手。"
      }
    }
  }
}
