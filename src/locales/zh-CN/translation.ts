export default {
  translation: {
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
    nav: {
      features: "特性",
      pricing: "定价",
      themes: "主题",
      changelog: "更新日志",
      star: "Star",
      download: "下载"
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
    pricing: {
      title: "简单透明的定价",
      subtitle: "免费开始使用。需要并行 Agent 与优先支持时再升级。随时可取消。",
      popular: "最受欢迎",
      note: "所有付费方案通过 Creem 以美元计价。14 天内无理由全额退款。可能产生当地税费。",
      plans: {
        free: {
          name: "社区版",
          price: "$0",
          period: "/永久免费",
          desc: "面向探索多 Agent 工作流的独立开发者。",
          cta: "下载",
          features: [
            "单个活动 Worktree",
            "自带 AI Key(Claude / OpenAI / Gemini)",
            "基础可视化 Git 工具",
            "社区支持"
          ]
        },
        pro: {
          name: "Pro",
          period: "/月",
          desc: "为每天并行运行多 Agent 的专业开发者打造。",
          cta: "订阅 Pro",
          features: [
            "无限并行 Worktree",
            "多 Agent 编排(Claude · Codex · Gemini)",
            "AI 代码审查与智能 Commit",
            "项目全局搜索与三栏合并",
            "邮件优先支持"
          ]
        },
        lifetime: {
          name: "终身版",
          period: "/一次性",
          desc: "一次买断，长期拥有。包含 12 个月功能更新。",
          cta: "买断终身版",
          features: [
            "包含 Pro 全部功能",
            "一次付费，无任何续费",
            "12 个月功能更新",
            "终身优先技术支持"
          ]
        }
      }
    },
    themes: {
      title: "延续你的美学。",
      desc: "EnsoAI 尊重你的品味。内置多种 Ghostty 主题，支持自定义字体，并在所有 Worktree 间同步你的视觉风格。",
      more: "以及 400+ 更多 Ghostty 主题..."
    },
    footer: {
      tagline: "Git Worktree 管理器 + AI 编程助手。",
      product: "产品",
      community: "社区",
      legal: "法律与支持",
      privacy: "隐私政策",
      terms: "服务条款",
      support: "联系客服",
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
    }
  }
}
