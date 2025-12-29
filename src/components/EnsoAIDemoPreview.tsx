import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search,
  GitBranch,
  Plus,
  Settings,
  X,
  Sparkles,
  FileText,
  Terminal,
  GitCompare,
  Folder,
  Check,
  Clock,
  CircleDot,
  ChevronRight,
  ChevronDown,
  File,
  FolderOpen,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { WebContainerTerminal } from './WebContainerTerminal';

// Simulated AI conversation for Claude
const claudeConversation = [
  {
    type: 'user',
    content: 'Help me add a dark mode toggle to this React app',
    delay: 1000,
  },
  {
    type: 'thinking',
    content: 'Analyzing codebase structure...',
    delay: 2500,
  },
  {
    type: 'assistant',
    content: "I'll help you add a dark mode toggle. Let me first check your current setup.",
    delay: 3500,
  },
  {
    type: 'tool',
    tool: 'Read',
    file: 'src/App.tsx',
    delay: 4500,
  },
  {
    type: 'tool',
    tool: 'Read',
    file: 'tailwind.config.js',
    delay: 5000,
  },
  {
    type: 'assistant',
    content: "I see you're using Tailwind CSS. I'll create a theme context and toggle component:",
    delay: 6000,
  },
  {
    type: 'code',
    file: 'src/hooks/useTheme.ts',
    language: 'typescript',
    content: `export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList
      .toggle('dark', dark);
  }, [dark]);

  return { dark, toggle: () => setDark(!dark) };
}`,
    delay: 7500,
  },
];

// Simulated AI conversation for Codex
const codexConversation = [
  {
    type: 'user',
    content: 'Summarize recent commits',
    delay: 800,
  },
  {
    type: 'shell',
    command: 'git log --oneline -5',
    delay: 1500,
  },
  {
    type: 'output',
    content: `a1b2c3d feat: add user authentication
e4f5g6h fix: resolve login redirect issue
i7j8k9l refactor: clean up API handlers
m0n1o2p docs: update README
q3r4s5t chore: bump dependencies`,
    delay: 2500,
  },
  {
    type: 'assistant',
    content: "Here's a summary of the last 5 commits:",
    delay: 3500,
  },
  {
    type: 'list',
    items: [
      '**Authentication**: Added user auth system',
      '**Bug Fix**: Fixed login redirect bug',
      '**Refactor**: Cleaned up API handlers',
      '**Docs**: Updated README',
      '**Maintenance**: Bumped dependencies',
    ],
    delay: 4500,
  },
];

// Simulated AI conversation for Gemini
const geminiConversation = [
  {
    type: 'user',
    content: 'Explain the architecture of this project',
    delay: 1000,
  },
  {
    type: 'thinking',
    content: 'Analyzing project structure...',
    delay: 2000,
  },
  {
    type: 'tool',
    tool: 'list_dir',
    file: 'src/',
    delay: 2800,
  },
  {
    type: 'tool',
    tool: 'read_file',
    file: 'package.json',
    delay: 3300,
  },
  {
    type: 'assistant',
    content: 'This is a **React + TypeScript** project with the following architecture:',
    delay: 4200,
  },
  {
    type: 'structure',
    content: `src/
├── components/   # React components
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── utils/        # Utility functions
└── types/        # TypeScript types`,
    delay: 5200,
  },
  {
    type: 'assistant',
    content: 'Key technologies: **Vite**, **Tailwind CSS**, **Framer Motion**',
    delay: 6200,
  },
];

// Mock data
const repositories = [
  { name: 'awesome-app', path: '~/projects/awesome-app' },
  { name: 'design-system', path: '~/projects/design-system' },
];

const worktreesData: Record<string, Array<{ name: string; badge?: string; path?: string; hasChanges: boolean; count?: number }>> = {
  'awesome-app': [
    { name: 'main', badge: 'MAIN', path: '~/projects/awesome-app', hasChanges: true },
    { name: 'feat/user-dashboard', path: '~/projects/awesome-app/worktrees/...', hasChanges: false },
    { name: 'feat/payment-flow', hasChanges: true, count: 3 },
    { name: 'feat/dark-mode', hasChanges: false },
    { name: 'feat/i18n-support', hasChanges: false },
    { name: 'fix/login-redirect', hasChanges: true, count: 1 },
    { name: 'refactor/api-client', hasChanges: false },
    { name: 'docs/readme-update', hasChanges: false },
  ],
  'design-system': [
    { name: 'main', badge: 'MAIN', path: '~/projects/design-system', hasChanges: false },
    { name: 'feat/button-variants', hasChanges: true, count: 2 },
    { name: 'feat/color-tokens', hasChanges: false },
    { name: 'fix/typography-scale', hasChanges: true, count: 1 },
    { name: 'docs/storybook', hasChanges: false },
  ],
};

const tabsConfig = [
  { icon: Sparkles, key: 'agent', active: true },
  { icon: FileText, key: 'files', active: false },
  { icon: Terminal, key: 'terminal', active: false },
  { icon: GitCompare, key: 'sourceControl', active: false },
];

const sessions = [
  { id: 'claude', name: 'Claude', model: 'Opus 4.5', color: 'text-ayu-accent' },
  { id: 'codex', name: 'Codex', model: 'gpt-5.2-codex', color: 'text-ayu-green' },
  { id: 'gemini', name: 'Gemini', model: 'Gemini 3', color: 'text-ayu-purple' },
];

// Mock file tree data
const fileTreeData = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'Button.tsx', type: 'file', lang: 'tsx' },
          { name: 'Header.tsx', type: 'file', lang: 'tsx' },
          { name: 'Sidebar.tsx', type: 'file', lang: 'tsx', modified: true },
        ],
      },
      {
        name: 'hooks',
        type: 'folder',
        expanded: false,
        children: [
          { name: 'useAuth.ts', type: 'file', lang: 'ts' },
          { name: 'useTheme.ts', type: 'file', lang: 'ts' },
        ],
      },
      { name: 'App.tsx', type: 'file', lang: 'tsx' },
      { name: 'index.tsx', type: 'file', lang: 'tsx' },
    ],
  },
  { name: 'package.json', type: 'file', lang: 'json' },
  { name: 'tsconfig.json', type: 'file', lang: 'json' },
  { name: 'README.md', type: 'file', lang: 'md' },
];

// Mock git changes
const gitChanges = {
  staged: [
    { name: 'src/components/Button.tsx', status: 'M' },
    { name: 'src/hooks/useAuth.ts', status: 'A' },
  ],
  unstaged: [
    { name: 'src/components/Sidebar.tsx', status: 'M' },
    { name: 'src/App.tsx', status: 'M' },
  ],
  untracked: [
    { name: 'src/utils/helpers.ts' },
  ],
};

// Ghostty mascot as simple SVG
const GhosttyMascot = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16 text-ayu-accent">
    <g fill="currentColor">
      {/* Body */}
      <rect x="16" y="8" width="32" height="40" rx="8" opacity="0.9" />
      {/* Eyes */}
      <circle cx="26" cy="24" r="4" fill="white" />
      <circle cx="38" cy="24" r="4" fill="white" />
      <circle cx="27" cy="25" r="2" fill="#1a1a2e" />
      <circle cx="39" cy="25" r="2" fill="#1a1a2e" />
      {/* Tentacles */}
      <rect x="18" y="48" width="6" height="10" rx="3" opacity="0.7" />
      <rect x="29" y="48" width="6" height="12" rx="3" opacity="0.7" />
      <rect x="40" y="48" width="6" height="10" rx="3" opacity="0.7" />
      {/* Antenna */}
      <rect x="30" y="2" width="4" height="8" rx="2" opacity="0.8" />
      <circle cx="32" cy="2" r="3" opacity="0.9" />
    </g>
  </svg>
);

// Claude Session Chat with simulated conversation
function ClaudeSessionChat({
  workspacePath,
  worktreeKey,
  hasPlayed,
  onComplete
}: {
  workspacePath: string;
  worktreeKey: string;
  hasPlayed: boolean;
  onComplete: () => void;
}) {
  const [visibleMessages, setVisibleMessages] = useState<typeof claudeConversation>(
    hasPlayed ? claudeConversation : []
  );
  const [isComplete, setIsComplete] = useState(hasPlayed);

  useEffect(() => {
    // If already played, show all messages immediately
    if (hasPlayed) {
      setVisibleMessages(claudeConversation);
      setIsComplete(true);
      return;
    }

    // Reset state for new worktree
    setVisibleMessages([]);
    setIsComplete(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    claudeConversation.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        if (index === claudeConversation.length - 1) {
          setIsComplete(true);
          onComplete();
        }
      }, msg.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [worktreeKey, hasPlayed, onComplete]);

  return (
    <motion.div
      key="claude"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <GhosttyMascot />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-ayu-fg font-semibold text-base">Claude Code</span>
          </div>
          <div className="text-ayu-fg/60 text-xs mt-0.5">
            Opus 4.5 • API Usage Billing
          </div>
          <div className="text-ayu-fg/40 text-xs mt-0.5">
            {workspacePath}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {visibleMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.type === 'user' && (
              <div className="flex items-start gap-2">
                <span className="text-ayu-accent font-bold">&gt;</span>
                <span className="text-ayu-fg">{msg.content}</span>
              </div>
            )}

            {msg.type === 'thinking' && (
              <div className="flex items-center gap-2 text-ayu-fg/50 text-xs">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border border-ayu-accent/50 border-t-ayu-accent rounded-full"
                />
                <span>{msg.content}</span>
              </div>
            )}

            {msg.type === 'assistant' && (
              <div className="text-ayu-fg/80 pl-4 border-l-2 border-ayu-accent/30">
                {msg.content}
              </div>
            )}

            {msg.type === 'tool' && 'tool' in msg && (
              <div className="flex items-center gap-2 text-xs bg-ayu-line/30 rounded px-3 py-1.5 w-fit">
                <span className="text-ayu-purple">{msg.tool}</span>
                <span className="text-ayu-fg/50">→</span>
                <span className="text-ayu-green">{msg.file}</span>
                <Check className="w-3 h-3 text-ayu-green" />
              </div>
            )}

            {msg.type === 'code' && 'file' in msg && (
              <div className="bg-[#1a1a2e] rounded-lg overflow-hidden border border-ayu-line/50">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-ayu-line/30 text-xs">
                  <File className="w-3 h-3 text-ayu-accent" />
                  <span className="text-ayu-fg/70">{msg.file}</span>
                  <span className="text-ayu-fg/40 ml-auto">{msg.language}</span>
                </div>
                <pre className="p-3 text-xs overflow-x-auto">
                  <code className="text-ayu-fg/80">{msg.content}</code>
                </pre>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input prompt */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-ayu-accent">&gt;</span>
        {!isComplete ? (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-ayu-accent/80"
          />
        ) : (
          <span className="text-ayu-fg/40 text-xs">Ready for next instruction...</span>
        )}
      </div>
    </motion.div>
  );
}

// Codex Session Chat with simulated conversation
function CodexSessionChat({
  workspacePath,
  worktreeKey,
  hasPlayed,
  onComplete
}: {
  workspacePath: string;
  worktreeKey: string;
  hasPlayed: boolean;
  onComplete: () => void;
}) {
  const [visibleMessages, setVisibleMessages] = useState<typeof codexConversation>(
    hasPlayed ? codexConversation : []
  );
  const [isComplete, setIsComplete] = useState(hasPlayed);

  useEffect(() => {
    if (hasPlayed) {
      setVisibleMessages(codexConversation);
      setIsComplete(true);
      return;
    }

    setVisibleMessages([]);
    setIsComplete(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    codexConversation.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        if (index === codexConversation.length - 1) {
          setIsComplete(true);
          onComplete();
        }
      }, msg.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [worktreeKey, hasPlayed, onComplete]);

  return (
    <motion.div
      key="codex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="border border-ayu-line rounded-lg p-4 mb-6">
        <div className="text-ayu-fg font-semibold mb-2">
          <span className="text-ayu-fg/60">&gt;_</span> OpenAI Codex <span className="text-ayu-fg/40">(v0.77.0)</span>
        </div>
        <div className="text-ayu-fg/60 text-xs space-y-1">
          <div>
            <span className="text-ayu-fg/40">model:</span>
            <span className="ml-4">gpt-5.2-codex xhigh</span>
          </div>
          <div>
            <span className="text-ayu-fg/40">directory:</span>
            <span className="ml-1">{workspacePath}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {visibleMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.type === 'user' && (
              <div className="bg-ayu-line/30 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-ayu-fg/60">&gt;</span>
                  <span className="text-ayu-fg">{msg.content}</span>
                </div>
              </div>
            )}

            {msg.type === 'shell' && 'command' in msg && (
              <div className="flex items-center gap-2 text-xs text-ayu-yellow">
                <span className="text-ayu-fg/50">$</span>
                <span>{msg.command}</span>
              </div>
            )}

            {msg.type === 'output' && (
              <pre className="bg-[#1a1a2e] rounded p-3 text-xs text-ayu-fg/70 overflow-x-auto">
                {msg.content}
              </pre>
            )}

            {msg.type === 'assistant' && (
              <div className="text-ayu-fg/80 text-sm">
                {msg.content}
              </div>
            )}

            {msg.type === 'list' && 'items' in msg && msg.items && (
              <div className="space-y-1 pl-4 text-xs">
                {msg.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2 text-ayu-fg/70">
                    <span className="text-ayu-green">•</span>
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="text-ayu-accent font-medium">$1</span>') }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-ayu-fg/40 text-xs mt-4">
        {isComplete ? '100% context left' : 'Processing...'} · <span className="text-ayu-fg/50">?</span> for shortcuts
      </div>
    </motion.div>
  );
}

// Gemini Session Chat with simulated conversation
function GeminiSessionChat({
  workspacePath,
  worktreeKey,
  hasPlayed,
  onComplete
}: {
  workspacePath: string;
  worktreeKey: string;
  hasPlayed: boolean;
  onComplete: () => void;
}) {
  const [visibleMessages, setVisibleMessages] = useState<typeof geminiConversation>(
    hasPlayed ? geminiConversation : []
  );
  const [isComplete, setIsComplete] = useState(hasPlayed);

  useEffect(() => {
    if (hasPlayed) {
      setVisibleMessages(geminiConversation);
      setIsComplete(true);
      return;
    }

    setVisibleMessages([]);
    setIsComplete(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    geminiConversation.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        if (index === geminiConversation.length - 1) {
          setIsComplete(true);
          onComplete();
        }
      }, msg.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [worktreeKey, hasPlayed, onComplete]);

  return (
    <motion.div
      key="gemini"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gemini ASCII Art */}
      <div className="mb-4 font-mono text-xs leading-tight select-none">
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {'  ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗'}
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {'██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║'}
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {'██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║'}
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {'██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║'}
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {'╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║'}
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent font-bold">
          {' ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝'}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {visibleMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.type === 'user' && (
              <div className="border border-ayu-line rounded px-3 py-2">
                <div className="flex items-center gap-2 text-ayu-fg">
                  <span className="text-ayu-purple">&gt;</span>
                  <span>{msg.content}</span>
                </div>
              </div>
            )}

            {msg.type === 'thinking' && (
              <div className="flex items-center gap-2 text-ayu-fg/50 text-xs">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border border-purple-400/50 border-t-purple-400 rounded-full"
                />
                <span>{msg.content}</span>
              </div>
            )}

            {msg.type === 'tool' && 'tool' in msg && (
              <div className="flex items-center gap-2 text-xs bg-ayu-line/30 rounded px-3 py-1.5 w-fit">
                <span className="text-ayu-cyan">{msg.tool}</span>
                <span className="text-ayu-fg/50">→</span>
                <span className="text-ayu-green">{msg.file}</span>
                <Check className="w-3 h-3 text-ayu-green" />
              </div>
            )}

            {msg.type === 'assistant' && msg.content && (
              <div className="text-ayu-fg/80 text-sm" dangerouslySetInnerHTML={{
                __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<span class="text-ayu-purple font-medium">$1</span>')
              }} />
            )}

            {msg.type === 'structure' && (
              <pre className="bg-[#1a1a2e] rounded p-3 text-xs text-ayu-fg/70 overflow-x-auto font-mono">
                {msg.content}
              </pre>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-[10px] text-ayu-fg/50 mt-4">
        {workspacePath}
        <span className="text-ayu-yellow ml-2">no sandbox</span>
        <span className="text-ayu-green ml-1">Auto</span>
        <span className="text-ayu-purple ml-1">(Gemini 3)</span>
        <span className="ml-1">{isComplete ? '/model (100%)' : 'thinking...'} | 324.7 MB</span>
      </div>
    </motion.div>
  );
}

// File tree item component
interface FileTreeItemProps {
  item: { name: string; type: string; expanded?: boolean; children?: FileTreeItemProps['item'][]; modified?: boolean; lang?: string };
  depth: number;
}

const FileTreeItem = ({ item, depth }: FileTreeItemProps) => {
  const [expanded, setExpanded] = useState(item.expanded ?? false);
  const isFolder = item.type === 'folder';

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-ayu-line/30 cursor-pointer text-xs`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => isFolder && setExpanded(!expanded)}
      >
        {isFolder ? (
          <>
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-ayu-fg/40" />
            ) : (
              <ChevronRight className="w-3 h-3 text-ayu-fg/40" />
            )}
            {expanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-ayu-func" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-ayu-func" />
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            <File className="w-3.5 h-3.5 text-ayu-fg/50" />
          </>
        )}
        <span className={`ml-1 ${item.modified ? 'text-ayu-yellow' : 'text-ayu-fg/80'}`}>
          {item.name}
        </span>
        {item.modified && <CircleDot className="w-2 h-2 text-ayu-yellow ml-auto" />}
      </div>
      {isFolder && expanded && item.children && (
        <div>
          {item.children.map((child, i) => (
            <FileTreeItem key={i} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function EnsoAIDemoPreview() {
  const { t } = useTranslation();
  const [selectedRepo, setSelectedRepo] = useState('awesome-app');
  const [activeWorktree, setActiveWorktree] = useState('main');
  const [activeSession, setActiveSession] = useState('claude');
  const [activeTab, setActiveTab] = useState('agent');
  const [playedAnimations, setPlayedAnimations] = useState<Set<string>>(new Set());

  const worktrees = worktreesData[selectedRepo] || [];
  const currentSession = sessions.find(s => s.id === activeSession);
  const workspacePath = `~/ensoai/workspaces/${selectedRepo}/${activeWorktree}`;

  // Unique key for each worktree+session combination
  const getAnimationKey = useCallback(
    (session: string) => `${selectedRepo}:${activeWorktree}:${session}`,
    [selectedRepo, activeWorktree]
  );

  const markAnimationPlayed = useCallback(
    (session: string) => {
      const key = `${selectedRepo}:${activeWorktree}:${session}`;
      setPlayedAnimations(prev => new Set(prev).add(key));
    },
    [selectedRepo, activeWorktree]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Window Frame */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-ayu-line/50 bg-ayu-panel">
        {/* Title Bar */}
        <div className="h-10 bg-gradient-to-b from-ayu-line/80 to-ayu-line/60 border-b border-ayu-line flex items-center px-4 gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner cursor-pointer"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner cursor-pointer"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner cursor-pointer"
            />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-ayu-fg/50 font-medium">EnsoAI</span>
          </div>
          <div className="w-14" /> {/* Spacer for symmetry */}
        </div>

        {/* Main Content */}
        <div className="flex h-[680px] bg-ayu-bg">
          {/* Left Sidebar - Repository List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-56 border-r border-ayu-line bg-ayu-panel flex flex-col"
          >
            {/* Search */}
            <div className="p-3 border-b border-ayu-line">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-ayu-bg rounded-md border border-ayu-line/50">
                <Search className="w-3.5 h-3.5 text-ayu-fg/40" />
                <span className="text-xs text-ayu-fg/40">{t('demo.searchRepo')}</span>
              </div>
            </div>

            {/* Repository List */}
            <div className="flex-1 overflow-y-auto py-2">
              {repositories.map((repo, index) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  onClick={() => {
                    setSelectedRepo(repo.name);
                    setActiveWorktree('main');
                  }}
                  className={`mx-2 mb-1 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    selectedRepo === repo.name
                      ? 'bg-ayu-accent/10 border border-ayu-accent/30'
                      : 'hover:bg-ayu-line/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 ${selectedRepo === repo.name ? 'text-ayu-accent' : 'text-ayu-fg/60'}`} />
                    <span className={`text-sm font-medium ${selectedRepo === repo.name ? 'text-ayu-accent' : 'text-ayu-fg'}`}>
                      {repo.name}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-ayu-fg/40 truncate pl-6">{repo.path}</div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-ayu-line flex items-center justify-between">
              <button className="flex items-center gap-1.5 text-xs text-ayu-fg/60 hover:text-ayu-accent transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>{t('demo.addRepo')}</span>
              </button>
              <button className="p-1.5 rounded hover:bg-ayu-line/50 text-ayu-fg/40 hover:text-ayu-fg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Middle Panel - Worktree List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-64 border-r border-ayu-line bg-ayu-panel flex flex-col"
          >
            {/* Search */}
            <div className="p-3 border-b border-ayu-line">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-ayu-bg rounded-md border border-ayu-line/50">
                <Search className="w-3.5 h-3.5 text-ayu-fg/40" />
                <span className="text-xs text-ayu-fg/40">{t('demo.searchWorktree')}</span>
              </div>
            </div>

            {/* Worktree List */}
            <div className="flex-1 overflow-y-auto py-2">
              {worktrees.map((wt, index) => (
                <motion.div
                  key={wt.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.02 }}
                  onClick={() => setActiveWorktree(wt.name)}
                  className={`mx-2 mb-0.5 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    activeWorktree === wt.name
                      ? 'bg-ayu-accent/10 border border-ayu-accent/30'
                      : 'hover:bg-ayu-line/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className={`w-3.5 h-3.5 ${activeWorktree === wt.name ? 'text-ayu-accent' : 'text-ayu-fg/50'}`} />
                    <span className={`text-sm truncate flex-1 ${activeWorktree === wt.name ? 'text-ayu-accent font-medium' : 'text-ayu-fg'}`}>
                      {wt.name}
                    </span>
                    {wt.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-ayu-green/20 text-ayu-green rounded">
                        {wt.badge}
                      </span>
                    )}
                    {wt.hasChanges && (
                      <CircleDot className="w-3 h-3 text-ayu-green" />
                    )}
                    {wt.count && (
                      <span className="w-4 h-4 flex items-center justify-center text-[10px] bg-ayu-fg/10 text-ayu-fg/70 rounded-full">
                        {wt.count}
                      </span>
                    )}
                  </div>
                  {wt.path && (
                    <div className="mt-1 text-[10px] text-ayu-fg/40 truncate pl-5">{wt.path}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Agent Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1 flex flex-col bg-ayu-bg"
          >
            {/* Tab Bar */}
            <div className="flex items-center gap-1 px-2 pt-2 border-b border-ayu-line bg-ayu-panel">
              {tabsConfig.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${
                    activeTab === tab.key
                      ? 'bg-ayu-accent text-white'
                      : 'text-ayu-fg/60 hover:text-ayu-fg hover:bg-ayu-line/50'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {t(`demo.tabs.${tab.key}`)}
                </button>
              ))}
            </div>

            {/* Session Tab - Only for Agent tab */}
            {activeTab === 'agent' && (
              <div className="flex items-center gap-1 px-2 py-1.5 border-b border-ayu-line bg-ayu-panel/50">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setActiveSession(session.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded border text-xs cursor-pointer transition-all ${
                      activeSession === session.id
                        ? 'bg-ayu-bg border-ayu-line'
                        : 'bg-transparent border-transparent hover:bg-ayu-line/30'
                    }`}
                  >
                    <span className={`font-medium ${activeSession === session.id ? session.color : 'text-ayu-fg/50'}`}>
                      {session.name}
                    </span>
                    {activeSession === session.id && (
                      <X className="w-3 h-3 text-ayu-fg/40 hover:text-ayu-fg" />
                    )}
                  </div>
                ))}
                <button className="p-1 rounded hover:bg-ayu-line/50 text-ayu-fg/40 hover:text-ayu-fg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden bg-ayu-bg">
              {/* Agent Tab Content */}
              {activeTab === 'agent' && (
                <div className="h-full p-4 font-mono text-sm overflow-auto">
                  {activeSession === 'claude' && (
                    <ClaudeSessionChat
                      workspacePath={workspacePath}
                      worktreeKey={getAnimationKey('claude')}
                      hasPlayed={playedAnimations.has(getAnimationKey('claude'))}
                      onComplete={() => markAnimationPlayed('claude')}
                    />
                  )}

                  {activeSession === 'codex' && (
                    <CodexSessionChat
                      workspacePath={workspacePath}
                      worktreeKey={getAnimationKey('codex')}
                      hasPlayed={playedAnimations.has(getAnimationKey('codex'))}
                      onComplete={() => markAnimationPlayed('codex')}
                    />
                  )}

                  {activeSession === 'gemini' && (
                    <GeminiSessionChat
                      workspacePath={workspacePath}
                      worktreeKey={getAnimationKey('gemini')}
                      hasPlayed={playedAnimations.has(getAnimationKey('gemini'))}
                      onComplete={() => markAnimationPlayed('gemini')}
                    />
                  )}
                </div>
              )}

              {/* Files Tab Content */}
              {activeTab === 'files' && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* File tabs */}
                  <div className="flex items-center gap-1 px-2 py-1 border-b border-ayu-line bg-ayu-panel/50">
                    <div className="flex items-center gap-2 px-3 py-1 bg-ayu-bg rounded border border-ayu-line text-xs">
                      <File className="w-3 h-3 text-ayu-accent" />
                      <span className="text-ayu-fg">Sidebar.tsx</span>
                      <CircleDot className="w-2 h-2 text-ayu-yellow" />
                      <X className="w-3 h-3 text-ayu-fg/40 hover:text-ayu-fg cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 text-xs text-ayu-fg/50 hover:bg-ayu-line/30 rounded cursor-pointer">
                      <File className="w-3 h-3" />
                      <span>App.tsx</span>
                    </div>
                  </div>
                  {/* File tree and editor */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* File tree sidebar */}
                    <div className="w-48 border-r border-ayu-line bg-ayu-panel/30 overflow-auto py-2">
                      <div className="px-3 py-1 text-[10px] text-ayu-fg/40 uppercase font-semibold">
                        {selectedRepo}
                      </div>
                      {fileTreeData.map((item, i) => (
                        <FileTreeItem key={i} item={item} depth={0} />
                      ))}
                    </div>
                    {/* Code editor */}
                    <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                      <div className="text-ayu-fg/40 select-none">
                        <div><span className="text-ayu-fg/30 mr-4">1</span><span className="text-ayu-purple">import</span> {'{'} <span className="text-ayu-fg">useState</span> {'}'} <span className="text-ayu-purple">from</span> <span className="text-ayu-string">'react'</span>;</div>
                        <div><span className="text-ayu-fg/30 mr-4">2</span><span className="text-ayu-purple">import</span> {'{'} <span className="text-ayu-fg">motion</span> {'}'} <span className="text-ayu-purple">from</span> <span className="text-ayu-string">'framer-motion'</span>;</div>
                        <div><span className="text-ayu-fg/30 mr-4">3</span></div>
                        <div><span className="text-ayu-fg/30 mr-4">4</span><span className="text-ayu-purple">export function</span> <span className="text-ayu-func">Sidebar</span>() {'{'}</div>
                        <div><span className="text-ayu-fg/30 mr-4">5</span>  <span className="text-ayu-purple">const</span> [<span className="text-ayu-fg">isOpen</span>, <span className="text-ayu-fg">setIsOpen</span>] = <span className="text-ayu-func">useState</span>(<span className="text-ayu-constant">true</span>);</div>
                        <div><span className="text-ayu-fg/30 mr-4">6</span></div>
                        <div><span className="text-ayu-fg/30 mr-4">7</span>  <span className="text-ayu-purple">return</span> (</div>
                        <div><span className="text-ayu-fg/30 mr-4">8</span>    {'<'}<span className="text-ayu-tag">motion.div</span></div>
                        <div><span className="text-ayu-fg/30 mr-4">9</span>      <span className="text-ayu-entity">className</span>=<span className="text-ayu-string">"sidebar"</span></div>
                        <div><span className="text-ayu-fg/30">10</span>      <span className="text-ayu-entity">animate</span>={'{{ '}opacity: isOpen ? 1 : 0 {'}}'}</div>
                        <div><span className="text-ayu-fg/30">11</span>    {'>'}</div>
                        <div><span className="text-ayu-fg/30">12</span>      <span className="text-ayu-comment">{'// TODO: Add sidebar content'}</span></div>
                        <div><span className="text-ayu-fg/30">13</span>    {'</'}<span className="text-ayu-tag">motion.div</span>{'>'}</div>
                        <div><span className="text-ayu-fg/30">14</span>  );</div>
                        <div><span className="text-ayu-fg/30">15</span>{'}'}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Terminal Tab Content */}
              {activeTab === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <WebContainerTerminal
                    workspacePath={workspacePath}
                    worktreeKey={getAnimationKey('terminal')}
                    hasPlayed={playedAnimations.has(getAnimationKey('terminal'))}
                    onComplete={() => markAnimationPlayed('terminal')}
                  />
                </motion.div>
              )}

              {/* Source Control Tab Content */}
              {activeTab === 'sourceControl' && (
                <motion.div
                  key="sourceControl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex"
                >
                  {/* Left: Changes list */}
                  <div className="w-64 border-r border-ayu-line flex flex-col bg-ayu-panel/30">
                    {/* Branch info */}
                    <div className="p-3 border-b border-ayu-line">
                      <div className="flex items-center gap-2 text-xs">
                        <GitBranch className="w-3.5 h-3.5 text-ayu-accent" />
                        <span className="text-ayu-fg font-medium">{activeWorktree}</span>
                        <span className="text-ayu-fg/40">↑0 ↓0</span>
                      </div>
                    </div>

                    {/* Commit input */}
                    <div className="p-3 border-b border-ayu-line">
                      <div className="flex items-center gap-2 px-3 py-2 bg-ayu-bg rounded-md border border-ayu-line/50 mb-2">
                        <input
                          type="text"
                          placeholder="Commit message..."
                          className="flex-1 bg-transparent text-xs text-ayu-fg placeholder:text-ayu-fg/40 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-1.5 px-3 bg-ayu-accent text-white text-xs rounded font-medium hover:bg-ayu-accent/90">
                          Commit
                        </button>
                        <button className="p-1.5 rounded border border-ayu-line hover:bg-ayu-line/50" title="Refresh">
                          <RotateCcw className="w-3.5 h-3.5 text-ayu-fg/60" />
                        </button>
                      </div>
                    </div>

                    {/* Changes sections */}
                    <div className="flex-1 overflow-auto py-2">
                      {/* Staged Changes */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ayu-fg/70 group">
                          <ChevronDown className="w-3 h-3" />
                          <span>Staged Changes</span>
                          <span className="ml-auto text-ayu-fg/40">{gitChanges.staged.length}</span>
                          <span title="AI Review"><Sparkles className="w-3 h-3 text-ayu-accent opacity-0 group-hover:opacity-100 cursor-pointer" /></span>
                        </div>
                        {gitChanges.staged.map((file, i) => (
                          <div key={i} className={`flex items-center gap-2 px-5 py-1 text-xs hover:bg-ayu-line/30 cursor-pointer ${i === 0 ? 'bg-ayu-accent/10' : ''}`}>
                            <span className={`w-4 text-center font-mono ${file.status === 'M' ? 'text-ayu-yellow' : 'text-ayu-green'}`}>
                              {file.status}
                            </span>
                            <File className="w-3 h-3 text-ayu-fg/50" />
                            <span className="text-ayu-fg/80 truncate flex-1">{file.name.split('/').pop()}</span>
                            <Minus className="w-3 h-3 text-ayu-fg/40 hover:text-ayu-red opacity-0 group-hover:opacity-100" />
                          </div>
                        ))}
                      </div>

                      {/* Unstaged Changes */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ayu-fg/70">
                          <ChevronDown className="w-3 h-3" />
                          <span>Changes</span>
                          <span className="ml-auto text-ayu-fg/40">{gitChanges.unstaged.length}</span>
                        </div>
                        {gitChanges.unstaged.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 px-5 py-1 text-xs hover:bg-ayu-line/30 cursor-pointer group">
                            <span className="w-4 text-center text-ayu-yellow font-mono">{file.status}</span>
                            <File className="w-3 h-3 text-ayu-fg/50" />
                            <span className="text-ayu-fg/80 truncate flex-1">{file.name.split('/').pop()}</span>
                            <Plus className="w-3 h-3 text-ayu-fg/40 hover:text-ayu-green opacity-0 group-hover:opacity-100" />
                          </div>
                        ))}
                      </div>

                      {/* Untracked */}
                      <div>
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ayu-fg/70">
                          <ChevronDown className="w-3 h-3" />
                          <span>Untracked</span>
                          <span className="ml-auto text-ayu-fg/40">{gitChanges.untracked.length}</span>
                        </div>
                        {gitChanges.untracked.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 px-5 py-1 text-xs hover:bg-ayu-line/30 cursor-pointer group">
                            <span className="w-4 text-center text-ayu-green font-mono">U</span>
                            <File className="w-3 h-3 text-ayu-fg/50" />
                            <span className="text-ayu-fg/80 truncate flex-1">{file.name.split('/').pop()}</span>
                            <Plus className="w-3 h-3 text-ayu-fg/40 hover:text-ayu-green opacity-0 group-hover:opacity-100" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Diff preview */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Diff header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-ayu-line bg-ayu-panel/50">
                      <div className="flex items-center gap-2 text-xs">
                        <File className="w-3.5 h-3.5 text-ayu-fg/50" />
                        <span className="text-ayu-fg font-medium">src/components/Button.tsx</span>
                        <span className="text-ayu-yellow">M</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-ayu-line/50 text-ayu-fg/50 hover:text-ayu-fg" title="Inline diff">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-ayu-line/50 text-ayu-fg/50 hover:text-ayu-fg" title="Side by side">
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Diff content */}
                    <div className="flex-1 overflow-auto font-mono text-xs p-4">
                      <div className="text-ayu-fg/40 mb-2">@@ -12,7 +12,9 @@ export function Button({'{'} children, variant = 'primary' {'}'}) {'{'}</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">12</span>    return (</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">13</span>      {'<'}button</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">14</span>        className={'{'}clsx(</div>
                      <div className="bg-ayu-red/10 text-ayu-red border-l-2 border-ayu-red pl-2 -ml-2">
                        <span className="text-ayu-fg/30 mr-3">15</span>-         'px-4 py-2 rounded font-medium',
                      </div>
                      <div className="bg-ayu-green/10 text-ayu-green border-l-2 border-ayu-green pl-2 -ml-2">
                        <span className="text-ayu-fg/30 mr-3">15</span>+         'px-4 py-2 rounded-lg font-medium',
                      </div>
                      <div className="bg-ayu-green/10 text-ayu-green border-l-2 border-ayu-green pl-2 -ml-2">
                        <span className="text-ayu-fg/30 mr-3">16</span>+         'transition-all duration-200',
                      </div>
                      <div className="bg-ayu-green/10 text-ayu-green border-l-2 border-ayu-green pl-2 -ml-2">
                        <span className="text-ayu-fg/30 mr-3">17</span>+         'hover:scale-105 active:scale-95',
                      </div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">18</span>          variant === 'primary' && 'bg-blue-500 text-white',</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">19</span>          variant === 'secondary' && 'bg-gray-200 text-gray-800',</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">20</span>        ){'}'}</div>
                      <div className="text-ayu-fg/60">  <span className="text-ayu-fg/30 mr-3">21</span>      {'>'}</div>
                    </div>

                    {/* Diff stats */}
                    <div className="px-4 py-2 border-t border-ayu-line bg-ayu-panel/30 text-xs flex items-center gap-4">
                      <span className="text-ayu-green">+3</span>
                      <span className="text-ayu-red">-1</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <div className="w-16 h-1.5 bg-ayu-line rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-ayu-green rounded-full" />
                        </div>
                        <span className="text-ayu-fg/40">75%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Status Bar - Only show for Agent tab */}
            {activeTab === 'agent' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col border-t border-ayu-line bg-ayu-panel font-mono text-[11px]"
              >
                {/* Top Status Row */}
                <div className="flex items-center px-3 py-1.5 gap-3 text-ayu-fg/60">
                  <div className="flex items-center gap-1">
                    <span className="text-ayu-func">🏷️</span>
                    <span className={`font-medium ${currentSession?.color}`}>{currentSession?.model}</span>
                  </div>
                  <div className="text-ayu-fg/30">|</div>
                  <div className="flex items-center gap-1">
                    <Folder className="w-3 h-3 text-ayu-func" />
                    <span>{selectedRepo}</span>
                  </div>
                  <div className="text-ayu-fg/30">|</div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    <span>{activeWorktree}</span>
                    <Check className="w-3 h-3 text-ayu-green" />
                  </div>
                  <div className="text-ayu-fg/30">|</div>
                  <div className="flex items-center gap-1">
                    <span>📊</span>
                    <span className="text-ayu-fg/40">- - - tokens</span>
                  </div>
                  <div className="text-ayu-fg/30">|</div>
                  <div className="flex items-center gap-1">
                    <span className="text-ayu-yellow">💰</span>
                    <span>$0</span>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1 text-ayu-fg/40">
                    <span>○</span>
                    <span>/ide for EnsoAI</span>
                  </div>
                </div>

                {/* Bottom Status Row */}
                <div className="flex items-center px-3 py-1.5 gap-2 border-t border-ayu-line/50">
                  <div className="flex items-center gap-1">
                    <span className="text-ayu-red">▸▸</span>
                    <span className="text-ayu-green font-medium">{t('demo.status.bypassPermissions')}</span>
                  </div>
                  <span className="text-ayu-fg/40">{t('demo.status.cycleHint')}</span>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1 text-ayu-cyan">
                    <Clock className="w-3 h-3" />
                    <span>763ms</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] opacity-30 blur-3xl bg-gradient-radial from-ayu-accent/20 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}
