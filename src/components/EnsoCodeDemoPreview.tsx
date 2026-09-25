import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowUp,
  BatteryFull,
  Bot,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  CircleStop,
  Coins,
  Cpu,
  Database,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  GitCompare,
  House,
  ImagePlus,
  Laptop,
  Layers,
  ListTodo,
  MessageCircle,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Signal,
  Sparkles,
  SquarePen,
  Target,
  TerminalSquare,
  TextSearch,
  UnfoldHorizontal,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';

// ---------------------------------------------------------------------------
// Script types & data
// ---------------------------------------------------------------------------

type DiffLine = { kind: 'add' | 'del' | 'ctx'; text: string };

type Todo = { content: string; status: 'completed' | 'in_progress' | 'pending' };

type ToolContent =
  | { kind: 'diff'; added: number; removed: number; lines: DiffLine[] }
  | { kind: 'output'; text: string }
  | { kind: 'file'; lines: string[] }
  | { kind: 'todos'; items: Todo[] };

interface Step {
  type:
    | 'user'
    | 'thinking'
    | 'text'
    | 'tool'
    | 'dispatch'
    | 'agent-done'
    | 'coworker'
    | 'goal'
    | 'approval'
    | 'tasknote';
  /** ms to wait after previous step before revealing this one */
  gap: number;
  content?: string;
  tool?: 'read' | 'bash' | 'edit' | 'search' | 'todo';
  target?: string;
  duration?: string;
  toolContent?: ToolContent;
  name?: string;
  task?: string;
  result?: string;
  command?: string;
  skipIfRejected?: boolean;
}

type Approval = 'pending' | 'approved' | 'rejected';

interface ChildAgent {
  name: string;
  mode: 'task' | 'coworker';
  script: Step[];
}

interface Session {
  id: string;
  title: string;
  model: string;
  /** minutes since last activity, for the sidebar's relative time */
  ago: number;
  script: Step[];
  agents?: ChildAgent[];
}

interface Repo {
  name: string;
  branch: string;
  sessions: Session[];
}

function todoStep(gap: number, plan: string[], done: number, skipIfRejected?: boolean): Step {
  return {
    type: 'tool', gap, tool: 'todo', target: `${done}/${plan.length}`, duration: '0.1s', skipIfRejected,
    toolContent: {
      kind: 'todos',
      items: plan.map((content, i) => ({
        content,
        status: i < done ? 'completed' : i === done ? 'in_progress' : 'pending',
      })),
    },
  };
}

const cartPlan = [
  'Locate cart pricing logic',
  'Apply second-item-half-price discount',
  'Run cart tests',
];

const i18nPlan = [
  'Find hardcoded checkout copy',
  'Draft en/zh locale entries',
  'Replace strings with t() calls',
];

const repos: Repo[] = [
  {
    name: 'shop-storefront',
    branch: 'main',
    sessions: [
      {
        id: 'cart',
        title: 'Cart discount logic',
        model: 'claude-opus-4-5',
        ago: 1,
        script: [
          { type: 'user', gap: 900, content: 'Cart needs the second-item-half-price promo before Friday\'s campaign.' },
          { type: 'thinking', gap: 1300, content: 'Decomposing the task, planning agent dispatch…' },
          { type: 'goal', gap: 1400, content: 'Ship second-item-half-price cart discount' },
          todoStep(1100, cartPlan, 0),
          { type: 'dispatch', gap: 1700, name: 'scout', task: 'Locate cart pricing logic' },
          { type: 'agent-done', gap: 2400, name: 'scout', result: 'Found 3 relevant files: pricing.ts, CartSummary.tsx, cart.test.ts' },
          todoStep(1000, cartPlan, 1),
          {
            type: 'tool', gap: 1500, tool: 'read', target: 'src/cart/pricing.ts', duration: '0.4s',
            toolContent: {
              kind: 'file',
              lines: [
                'export function cartTotal(items: Item[]) {',
                '  return items.reduce((s, i) => s + i.price, 0);',
                '}',
              ],
            },
          },
          {
            type: 'tool', gap: 1900, tool: 'edit', target: 'src/cart/pricing.ts', duration: '1.2s',
            toolContent: {
              kind: 'diff', added: 5, removed: 1,
              lines: [
                { kind: 'del', text: 'export function cartTotal(items: Item[]) {' },
                { kind: 'del', text: '  return items.reduce((s, i) => s + i.price, 0);' },
                { kind: 'add', text: 'export function cartTotal(items: Item[]) {' },
                { kind: 'add', text: '  const sorted = [...items].sort((a, b) => b.price - a.price);' },
                { kind: 'add', text: '  const discount = sorted.filter((_, i) => i % 2 === 1)' },
                { kind: 'add', text: '    .reduce((s, i) => s + i.price / 2, 0);' },
                { kind: 'add', text: '  return items.reduce((s, i) => s + i.price, 0) - discount;' },
              ],
            },
          },
          todoStep(1000, cartPlan, 2),
          { type: 'approval', gap: 1700, command: 'pnpm test -- cart' },
          {
            type: 'tool', gap: 1500, tool: 'bash', target: 'pnpm test -- cart', duration: '842ms', skipIfRejected: true,
            toolContent: {
              kind: 'output',
              text: '✓ cart.pricing › second item half price\n✓ cart.pricing › odd item count rounds down\n\nTest Files  1 passed (1)\n     Tests  2 passed (2)',
            },
          },
          todoStep(1000, cartPlan, 3, true),
          { type: 'tasknote', gap: 1300, content: 'Checkpoint #12 · before cart discount edit' },
          { type: 'text', gap: 1600, content: 'Done. The discount applies to the cheapest item of every pair, tests pass, and checkpoint #12 is saved for one-click rollback.' },
        ],
        agents: [
          {
            name: 'scout',
            mode: 'task',
            script: [
              { type: 'thinking', gap: 500, content: 'Scanning src/cart for price computation…' },
              {
                type: 'tool', gap: 700, tool: 'search', target: 'price|discount in src/cart/**', duration: '0.2s',
                toolContent: { kind: 'output', text: 'src/cart/pricing.ts\nsrc/cart/CartSummary.tsx\nsrc/cart/cart.test.ts' },
              },
              { type: 'text', gap: 900, content: 'Found 3 relevant files: pricing.ts, CartSummary.tsx, cart.test.ts' },
            ],
          },
        ],
      },
      {
        id: 'i18n',
        title: 'Checkout i18n',
        model: 'gemini-3-pro',
        ago: 19,
        script: [
          { type: 'user', gap: 900, content: 'Extract checkout page copy into locale files.' },
          {
            type: 'tool', gap: 1500, tool: 'search', target: '"Checkout" in src/**/*.tsx', duration: '0.3s',
            toolContent: { kind: 'output', text: '14 matches in 5 files' },
          },
          todoStep(1000, i18nPlan, 1),
          { type: 'text', gap: 1600, content: 'Found 14 hardcoded strings across 5 files. Drafting en/zh entries now.' },
          { type: 'tasknote', gap: 1300, content: 'Checkpoint #7 · before i18n extraction' },
        ],
      },
    ],
  },
  {
    name: 'api-server',
    branch: 'main',
    sessions: [
      {
        id: 'db',
        title: 'Slow query: orders',
        model: 'gpt-5.2-codex',
        ago: 19,
        script: [
          { type: 'user', gap: 900, content: 'The orders table slow query alert is firing again.' },
          { type: 'coworker', gap: 1600, name: 'db-detective' },
          { type: 'text', gap: 1800, content: 'Hired coworker db-detective to investigate in its own tab — click the tab above to watch it work, or steer it anytime.' },
          { type: 'agent-done', gap: 9500, name: 'db-detective', result: 'Root cause: missing composite index on orders(status, created_at). Migration drafted.' },
          { type: 'text', gap: 1600, content: 'Migration ready — p95 should drop from ~1.8s to ~12ms. Review the diff in db-detective\'s tab. Want me to apply it?' },
        ],
        agents: [
          {
            name: 'db-detective',
            mode: 'coworker',
            script: [
              { type: 'thinking', gap: 1200, content: 'Reproducing the slow query…' },
              {
                type: 'tool', gap: 1800, tool: 'bash', target: "EXPLAIN ANALYZE SELECT … WHERE status='pending'", duration: '1.8s',
                toolContent: {
                  kind: 'output',
                  text: 'Seq Scan on orders  (cost=0.00..42610.00 rows=2,100,044)\n  Filter: (status = \'pending\'::text)\nPlanning Time: 0.121 ms\nExecution Time: 1842.6 ms',
                },
              },
              { type: 'text', gap: 1700, content: 'Seq scan over 2.1M rows — missing composite index on orders(status, created_at).' },
              {
                type: 'tool', gap: 1800, tool: 'edit', target: 'migrations/0042_orders_status_idx.sql', duration: '0.6s',
                toolContent: {
                  kind: 'diff', added: 3, removed: 0,
                  lines: [
                    { kind: 'add', text: 'CREATE INDEX CONCURRENTLY idx_orders_status_created' },
                    { kind: 'add', text: '  ON orders (status, created_at DESC)' },
                    { kind: 'add', text: "  WHERE status = 'pending';" },
                  ],
                },
              },
              { type: 'tasknote', gap: 1300, content: 'Checkpoint #5 · before migration 0042' },
              { type: 'text', gap: 1400, content: 'Done — migration drafted at migrations/0042_orders_status_idx.sql.' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'design-system',
    branch: 'feat/buttons',
    sessions: [
      {
        id: 'buttons',
        title: 'Button padding',
        model: 'claude-sonnet-4-5',
        ago: 19,
        script: [
          { type: 'user', gap: 900, content: 'Unify button paddings across the kit.' },
          {
            type: 'tool', gap: 1400, tool: 'search', target: 'px-3 py-1', duration: '0.2s',
            toolContent: { kind: 'output', text: '12 matches in 4 files' },
          },
          {
            type: 'tool', gap: 1800, tool: 'edit', target: 'src/button.tsx', duration: '0.9s',
            toolContent: {
              kind: 'diff', added: 2, removed: 2,
              lines: [
                { kind: 'del', text: '  sm: "px-3 py-1 text-sm",' },
                { kind: 'del', text: '  md: "px-4 py-1.5 text-sm",' },
                { kind: 'add', text: '  sm: "px-3 py-1.5 text-sm",' },
                { kind: 'add', text: '  md: "px-4 py-2 text-sm",' },
              ],
            },
          },
          { type: 'text', gap: 1500, content: 'All 12 button variants now share the same spacing scale.' },
          { type: 'tasknote', gap: 1200, content: 'Checkpoint #3 · before padding unification' },
        ],
      },
    ],
  },
];

const approvalModes = [
  { key: 'full', icon: ShieldCheck },
  { key: 'auto', icon: Shield },
  { key: 'access', icon: ShieldOff },
] as const;


// ---------------------------------------------------------------------------
// Shared bits — visuals mirror the enso-code renderer. ayu-a-* are the
// alpha-capable aliases of the site's ayu-* theme variables.
// ---------------------------------------------------------------------------

/** Timeline / dock column, kept narrow enough that the phone overlay never covers it */
const CHAT_COL = 'mx-auto w-full max-w-[560px] px-4 min-[1400px]:max-w-[640px]';
const BORDER = 'border-ayu-a-fg/[.12]';
const DEMO_CLOCK = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const TOOL_ICONS: Record<NonNullable<Step['tool']>, LucideIcon> = {
  read: FileText,
  bash: TerminalSquare,
  edit: Pencil,
  search: Search,
  todo: ListTodo,
};

function formatDuration(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${Math.round(s * 10) / 10}s`;
  const whole = Math.round(s);
  return `${Math.floor(whole / 60)}m${whole % 60}s`;
}

const formatElapsed = (sec: number) => (sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m${sec % 60}s`);

const sumGaps = (script: Step[], from: number, to: number) =>
  script.slice(from, to).reduce((ms, s) => ms + s.gap, 0);

function EnsoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M 38.96 48.86 A 18.24 18.24 0 1 1 48.19 40.4"
        stroke="currentColor"
        strokeWidth={8.32}
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusDot({ running }: { running: boolean }) {
  return (
    <span
      className={clsx(
        'size-2 shrink-0 rounded-full',
        running ? 'animate-pulse bg-ayu-accent' : 'border border-ayu-a-fg/50',
      )}
    />
  );
}

function StepNode({ icon: Icon, running }: { icon: LucideIcon; running: boolean }) {
  return (
    <span
      className={clsx(
        'relative flex size-[22px] shrink-0 items-center justify-center rounded-full border',
        running ? 'border-transparent text-ayu-accent' : `${BORDER} text-ayu-a-fg/60`,
      )}
    >
      <Icon className="size-3" />
      {running && (
        <span className="absolute -inset-px animate-spin rounded-full border-[1.5px] border-ayu-a-accent/20 border-t-ayu-accent" />
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Timeline rows (faithful to enso-code TimelineRow)
// ---------------------------------------------------------------------------

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="max-w-[80%] rounded-2xl rounded-br-md border border-ayu-a-accent/15 bg-ayu-a-accent/[.08] px-4 py-2.5 text-sm text-ayu-fg">
        {text}
      </div>
      <span className="text-[11px] text-ayu-a-fg/50 tabular-nums">{DEMO_CLOCK}</span>
    </div>
  );
}

function ReplyHeader({ name, model }: { name: string; model: string }) {
  return (
    <div className="mb-2 flex h-6 min-w-0 items-center gap-2 text-xs select-none">
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border border-ayu-a-accent/20 bg-ayu-a-accent/[.08] text-ayu-accent">
        <EnsoMark className="size-3.5" />
      </span>
      <span className="shrink-0 text-[13px] font-semibold text-ayu-fg">{name}</span>
      <span className="min-w-0 truncate rounded-md bg-ayu-a-fg/[.06] px-1.5 py-0.5 font-mono text-[11px] text-ayu-a-fg/60">
        {model}
      </span>
      <span className="shrink-0 text-[11px] text-ayu-a-fg/60 tabular-nums">{DEMO_CLOCK}</span>
    </div>
  );
}

function ThinkingRow({ text, live, ms }: { text: string; live: boolean; ms: number }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex min-h-[26px] items-center gap-2 text-left text-[13px] text-ayu-a-fg/60 transition-colors hover:text-ayu-fg"
      >
        <span className="flex size-[22px] shrink-0 items-center justify-center">
          <Brain className={clsx('h-3.5 w-3.5', live && 'animate-pulse text-ayu-accent')} />
        </span>
        <span className={clsx(live && 'animate-pulse')}>
          {live ? t('ensocode.demo.thinking') : t('ensocode.demo.thought', { duration: formatDuration(ms) })}
        </span>
        <ChevronRight className={clsx('h-3 w-3 shrink-0 transition-transform', expanded && 'rotate-90')} />
      </button>
      {expanded && (
        <p className={clsx('mt-1 ml-[10px] border-l-2 py-0.5 pl-[19px] text-[13px] leading-relaxed text-ayu-a-fg/60', BORDER)}>
          {text}
        </p>
      )}
    </div>
  );
}

/** file names and call-like identifiers render as inline code, paths as file links */
const CODE_RE = /([\w./-]*\w\.(?:tsx?|sql)\b|\w+\([\w, ]+\))/g;

function AgentText({ text }: { text: string }) {
  return (
    <p className="text-sm leading-relaxed text-ayu-fg">
      {text.split(CODE_RE).map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <code
            key={i}
            className={clsx(
              'rounded border border-ayu-a-fg/[.08] bg-ayu-a-fg/[.05] px-1 py-px font-mono text-[0.85em]',
              part.includes('/') && 'text-ayu-accent',
            )}
          >
            {part}
          </code>
        ),
      )}
    </p>
  );
}

/** A timeline step: round icon node + name + mono summary + duration, expandable into a card */
function StepRow({
  icon,
  label,
  summary,
  running,
  meta,
  bold = true,
  diff = false,
  defaultOpen = false,
  content,
}: {
  icon: LucideIcon;
  label: string;
  summary?: string;
  running: boolean;
  meta?: string;
  bold?: boolean;
  diff?: boolean;
  defaultOpen?: boolean;
  content?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const expandable = Boolean(content);
  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!expandable}
          onClick={() => setExpanded((v) => !v)}
          className={clsx(
            'group/step flex min-h-[30px] min-w-0 flex-1 items-center gap-2 rounded-lg pr-1.5 text-left text-[13px] text-ayu-fg transition-colors',
            expandable && 'cursor-pointer hover:bg-ayu-a-fg/[.05]',
          )}
        >
          <StepNode icon={icon} running={running} />
          <span className={clsx('shrink-0', bold ? 'font-medium' : 'text-ayu-a-fg/80')}>{label}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-ayu-a-fg/60">{summary}</span>
          {meta && <span className="shrink-0 font-mono text-[10px] text-ayu-a-fg/45 tabular-nums">{meta}</span>}
          {expandable && (
            <ChevronRight
              className={clsx(
                'h-3 w-3 shrink-0 text-ayu-a-fg/60 opacity-0 transition-[opacity,transform] group-hover/step:opacity-100',
                expanded && 'rotate-90 opacity-100',
              )}
            />
          )}
        </button>
        {diff && !running && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
          >
            <GitCompare className="h-3 w-3" />
          </button>
        )}
      </div>
      {expanded && content && (
        <div className={clsx('mt-1 mb-1.5 ml-[30px] overflow-hidden rounded-lg border bg-ayu-panel shadow-sm', BORDER)}>
          {content}
        </div>
      )}
    </div>
  );
}

function ToolContentView({ content }: { content: Exclude<ToolContent, { kind: 'todos' }> }) {
  if (content.kind === 'output') {
    return (
      <pre className="px-3 py-2 font-mono text-xs leading-relaxed text-ayu-a-fg/60 whitespace-pre-wrap">{content.text}</pre>
    );
  }
  if (content.kind === 'file') {
    return (
      <div className="py-1 font-mono text-[11px] leading-relaxed">
        {content.lines.map((l, i) => (
          <div key={i} className="px-3 whitespace-pre-wrap text-ayu-a-fg/80">
            <span className="mr-3 inline-block w-6 text-right text-ayu-a-fg/35 select-none">{i + 1}</span>
            {l}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="py-1 font-mono text-[11px] leading-relaxed">
      {content.lines.map((l, i) => (
        <div
          key={i}
          className={clsx(
            'px-3 whitespace-pre-wrap',
            l.kind === 'add' && 'bg-ayu-a-green/10 text-ayu-green',
            l.kind === 'del' && 'bg-ayu-a-red/10 text-ayu-red',
            l.kind === 'ctx' && 'text-ayu-a-fg/60',
          )}
        >
          {l.kind === 'add' ? '+ ' : l.kind === 'del' ? '- ' : '  '}
          {l.text}
        </div>
      ))}
    </div>
  );
}

function ToolRow({ step, instant }: { step: Step; instant: boolean }) {
  const { t } = useTranslation();
  const [running, setRunning] = useState(!instant);

  useEffect(() => {
    if (instant) return;
    const timer = setTimeout(() => setRunning(false), 900);
    return () => clearTimeout(timer);
  }, [instant]);

  const content = step.toolContent;
  if (content?.kind === 'todos') return <TodoCard todos={content.items} />;
  const tool = step.tool!;
  return (
    <StepRow
      icon={TOOL_ICONS[tool]}
      label={t(`ensocode.demo.tools.${tool}`)}
      summary={step.target}
      running={running}
      meta={running ? undefined : step.duration}
      bold={tool !== 'read' && tool !== 'search'}
      diff={content?.kind === 'diff'}
      defaultOpen={!instant && content?.kind === 'diff'}
      content={content && <ToolContentView content={content} />}
    />
  );
}

function SubagentRow({ summary, result, ms }: { summary: string; result?: string; ms?: number }) {
  const { t } = useTranslation();
  return (
    <StepRow
      icon={Bot}
      label={t('ensocode.demo.tools.subagent')}
      summary={summary}
      running={result === undefined}
      meta={ms === undefined ? undefined : formatDuration(ms)}
      content={result && <p className="px-3 py-2 text-[13px] leading-relaxed text-ayu-fg">{result}</p>}
    />
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul className="space-y-0.5 text-xs">
      {todos.map((todo) => (
        <li key={todo.content} className="flex items-start gap-1.5">
          {todo.status === 'completed' ? (
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-ayu-green" />
          ) : todo.status === 'in_progress' ? (
            <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-ayu-accent" />
          ) : (
            <Circle className="mt-0.5 h-3 w-3 shrink-0 text-ayu-a-fg/35" />
          )}
          <span
            className={clsx(
              todo.status === 'completed'
                ? 'text-ayu-a-fg/60 line-through'
                : todo.status === 'in_progress'
                  ? 'font-medium text-ayu-fg'
                  : 'text-ayu-a-fg/60',
            )}
          >
            {todo.content}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TodoCard({ todos }: { todos: Todo[] }) {
  const { t } = useTranslation();
  const done = todos.filter((todo) => todo.status === 'completed').length;
  return (
    <div className={clsx('rounded-lg border bg-ayu-a-fg/[.025] px-3 py-2', BORDER)}>
      <div className="mb-1 flex items-center gap-2 text-xs text-ayu-a-fg/60">
        <ListTodo className="h-3.5 w-3.5 shrink-0" />
        <span className="font-medium">{t('ensocode.demo.todos')}</span>
        <span>
          {done}/{todos.length}
        </span>
      </div>
      <TodoList todos={todos} />
    </div>
  );
}

function FoldRow({ steps, ms, expanded, onToggle }: { steps: Step[]; ms: number; expanded: boolean; onToggle: () => void }) {
  const { t } = useTranslation();
  const thinking = steps.filter((s) => s.type === 'thinking').length;
  const tools = steps.length - thinking;
  const parts = [
    thinking > 0 && t('ensocode.demo.fold.thinking', { count: thinking }),
    tools > 0 && t('ensocode.demo.fold.tools', { count: tools }),
  ].filter(Boolean);
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group/step flex min-h-[30px] w-full items-center gap-2 rounded-lg pr-1.5 text-left text-[13px] transition-colors hover:bg-ayu-a-fg/[.05]"
    >
      <StepNode icon={Layers} running={false} />
      <span className="shrink-0 font-medium text-ayu-a-fg/90">
        {t('ensocode.demo.fold.worked', { duration: formatDuration(ms) })}
      </span>
      <span className="min-w-0 flex-1 truncate text-ayu-a-fg/60">{parts.join(' · ')}</span>
      <ChevronRight className={clsx('h-3 w-3 shrink-0 text-ayu-a-fg/60 transition-transform', expanded && 'rotate-90')} />
    </button>
  );
}

function TaskNoteRow({ text }: { text: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="h-px flex-1 bg-ayu-a-fg/[.12]" />
      <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-ayu-a-fg/60">
        <Check className="h-3 w-3 text-ayu-green" />
        {text}
      </span>
      <span className="h-px flex-1 bg-ayu-a-fg/[.12]" />
    </div>
  );
}

function Elapsed() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="font-mono text-[11px] text-ayu-a-fg/60 tabular-nums">{formatElapsed(sec)}</span>;
}

function WorkingRow({ elapsed }: { elapsed: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[26px] items-center gap-2 text-[13px]">
      <span className="relative flex size-[22px] shrink-0 items-center justify-center">
        <span className="absolute size-2 animate-ping rounded-full bg-ayu-a-accent/50" />
        <span className="relative size-2 rounded-full bg-ayu-accent" />
      </span>
      <span className="text-ayu-a-fg/60">{t('ensocode.demo.generating')}</span>
      {elapsed && <Elapsed />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline (shared by desktop and phone)
// ---------------------------------------------------------------------------

type Row = { s: Step; idx: number };
type Item = { kind: 'row'; row: Row; done: boolean } | { kind: 'fold'; key: number; rows: Row[] };

/** tool-like rows drawn as round nodes and chained by a vertical line */
const isStepItem = (item: Item) =>
  item.kind === 'fold' ||
  (['tool', 'dispatch', 'coworker'].includes(item.row.s.type) && item.row.s.toolContent?.kind !== 'todos');
const isTightItem = (item: Item) => isStepItem(item) || (item.kind === 'row' && item.row.s.type === 'thinking');

function Timeline({
  name,
  model,
  script,
  step,
  approval,
  instant,
  elapsed = true,
}: {
  name: string;
  model: string;
  script: Step[];
  step: number;
  approval?: Approval;
  instant: boolean;
  elapsed?: boolean;
}) {
  const [expandedFolds, setExpandedFolds] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const running = step < script.length;
  const visible = script
    .slice(0, step)
    .map((s, idx) => ({ s, idx }))
    .filter(({ s }) => !(s.skipIfRejected && approval === 'rejected'));
  // agent-done folds into its dispatch row (running → finished with result)
  const finished = new Map(visible.filter(({ s }) => s.type === 'agent-done').map(({ s, idx }) => [s.name!, { idx, result: s.result }]));
  const rows = visible.filter(({ s }) => !['goal', 'approval', 'agent-done'].includes(s.type));
  const liveFrom = running
    ? rows.reduce((last, { s }, i) => (s.type === 'user' || s.type === 'text' ? i : last), -1)
    : rows.length;
  const foldable = (i: number) => i < liveFrom && ['thinking', 'tool', 'dispatch', 'coworker'].includes(rows[i].s.type);
  const items: Item[] = [];
  for (let i = 0; i < rows.length; ) {
    let end = i;
    while (end < rows.length && foldable(end)) end += 1;
    if (end - i >= 2) {
      const key = rows[i].idx;
      items.push({ kind: 'fold', key, rows: rows.slice(i, end) });
      if (expandedFolds.has(key)) items.push(...rows.slice(i, end).map((row) => ({ kind: 'row' as const, row, done: true })));
      i = end;
    } else {
      items.push({ kind: 'row', row: rows[i], done: false });
      i += 1;
    }
  }
  const toggleFold = (key: number) =>
    setExpandedFolds((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const renderRow = ({ s, idx }: Row, done: boolean) => {
    switch (s.type) {
      case 'user':
        return <UserBubble text={s.content!} />;
      case 'thinking':
        return <ThinkingRow text={s.content!} live={!instant && !done && idx === step - 1 && running} ms={script[idx + 1]?.gap ?? 1000} />;
      case 'text':
        return <AgentText text={s.content!} />;
      case 'tool':
        return <ToolRow step={s} instant={instant || done} />;
      case 'dispatch':
      case 'coworker': {
        const end = finished.get(s.name!);
        return (
          <SubagentRow
            summary={s.type === 'dispatch' ? s.task! : s.name!}
            result={end?.result}
            ms={end && sumGaps(script, idx + 1, end.idx + 1)}
          />
        );
      }
      case 'tasknote':
        return <TaskNoteRow text={s.content!} />;
      default:
        return null;
    }
  };

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div className={clsx(CHAT_COL, 'pt-4 pb-4 [overflow-wrap:anywhere]')}>
        {items.map((item, i) => {
          const prev = items[i - 1];
          const next = items[i + 1];
          const reply =
            (item.kind === 'fold' || !['user', 'tasknote'].includes(item.row.s.type)) &&
            (!prev || (prev.kind === 'row' && prev.row.s.type === 'user'));
          const isStep = isStepItem(item);
          const linkPrev = isStep && !reply && prev !== undefined && isStepItem(prev);
          const linkNext = isStep && next !== undefined && isStepItem(next);
          const gap = !next ? '' : isTightItem(item) ? (isTightItem(next) ? 'pb-1' : 'pb-3') : 'pb-4';
          const key = item.kind === 'fold' ? `fold-${item.key}` : `${item.row.idx}-${item.done ? 'x' : ''}`;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={clsx('relative', gap)}
            >
              {reply && <ReplyHeader name={name} model={model} />}
              <div className="relative">
                {linkPrev && <span className="absolute top-[-4px] left-[10.5px] h-2 w-px bg-ayu-a-fg/[.12]" />}
                {item.kind === 'fold' ? (
                  <FoldRow
                    steps={item.rows.map(({ s }) => s)}
                    ms={sumGaps(script, item.rows[0].idx, item.rows[item.rows.length - 1].idx + 1)}
                    expanded={expandedFolds.has(item.key)}
                    onToggle={() => toggleFold(item.key)}
                  />
                ) : (
                  renderRow(item.row, item.done)
                )}
              </div>
              {linkNext && <span className="absolute top-[26px] bottom-0 left-[10.5px] w-px bg-ayu-a-fg/[.12]" />}
            </motion.div>
          );
        })}
        {running && (
          <div className={clsx(items.length > 0 && 'pt-4')}>
            <WorkingRow elapsed={elapsed} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bars above composer (ApprovalBar / GoalBar / TodoBar)
// ---------------------------------------------------------------------------

function DemoGoalBar({ text, turns, paused, onTogglePause, onClear }: {
  text: string;
  turns: number;
  paused: boolean;
  onTogglePause: () => void;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className={clsx('mb-1 flex items-center gap-2 rounded-lg border bg-ayu-a-fg/[.02] px-2.5 py-1.5 text-xs text-ayu-fg', BORDER)}>
      <Target className="h-3.5 w-3.5 shrink-0 text-ayu-a-fg/60" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <span className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', paused ? 'bg-ayu-yellow' : 'animate-pulse bg-ayu-green')} />
      <span className="shrink-0 font-mono text-[10px] text-ayu-a-fg/60 tabular-nums">
        {paused ? t('ensocode.demo.paused') : t('ensocode.demo.working')} · {turns}/25
      </span>
      <button type="button" onClick={onTogglePause} className="shrink-0 rounded p-0.5 text-ayu-a-fg/60 transition-colors hover:text-ayu-fg">
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      <button type="button" onClick={onClear} className="shrink-0 rounded p-0.5 text-ayu-a-fg/60 transition-colors hover:text-ayu-red">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function DemoTodoBar({ todos, onHide }: { todos: Todo[]; onHide: () => void }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const done = todos.filter((todo) => todo.status === 'completed').length;
  const current = todos.find((todo) => todo.status === 'in_progress') ?? todos.find((todo) => todo.status === 'pending');
  return (
    <div className={clsx('mb-1 rounded-lg border bg-ayu-a-fg/[.02] px-2.5 py-1.5 text-xs text-ayu-fg', BORDER)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ListTodo className="h-3.5 w-3.5 shrink-0 text-ayu-a-fg/60" />
          <span className="shrink-0 font-medium">{t('ensocode.demo.todos')}</span>
          <span className="shrink-0 font-mono text-[10px] text-ayu-a-fg/60 tabular-nums">
            {done}/{todos.length}
          </span>
          {!expanded && current && <span className="min-w-0 flex-1 truncate text-ayu-a-fg/60">{current.content}</span>}
          {expanded ? (
            <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-ayu-a-fg/60" />
          ) : (
            <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ayu-a-fg/60" />
          )}
        </button>
        <button
          type="button"
          title={t('ensocode.demo.todosHide')}
          onClick={onHide}
          className="shrink-0 rounded p-0.5 text-ayu-a-fg/60 transition-colors hover:text-ayu-fg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {expanded && (
        <div className="mt-1.5 max-h-48 overflow-y-auto">
          <TodoList todos={todos} />
        </div>
      )}
    </div>
  );
}

function DemoApprovalBar({ command, onRespond }: { command: string; onRespond: (v: 'approved' | 'rejected') => void }) {
  const { t } = useTranslation();
  return (
    <div className={clsx('mb-1 rounded-lg border bg-ayu-a-fg/[.02] px-2.5 py-2', BORDER)}>
      <div className="flex items-center gap-2 text-xs">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-ayu-yellow" />
        <span className="shrink-0 text-[10px] font-medium tracking-wide text-ayu-a-fg/60 uppercase">
          {t('ensocode.demo.approval.title')}
        </span>
        <span className="flex min-w-0 items-center gap-1 text-ayu-a-fg/60">
          <TerminalSquare className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate font-mono">bash</span>
        </span>
      </div>
      <pre className="mt-1.5 max-h-24 overflow-auto rounded-md bg-ayu-a-fg/[.04] px-2 py-1.5 font-mono text-xs text-ayu-fg whitespace-pre-wrap">
        {command}
      </pre>
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => onRespond('rejected')}
          className="rounded-md whitespace-nowrap px-2.5 py-1 text-xs text-ayu-red transition-colors hover:bg-ayu-a-red/10"
        >
          {t('ensocode.demo.approval.deny')}
        </button>
        <button
          type="button"
          onClick={() => onRespond('approved')}
          className="rounded-md whitespace-nowrap px-2.5 py-1 text-xs text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
        >
          {t('ensocode.demo.approval.allowSession')}
        </button>
        <button
          type="button"
          onClick={() => onRespond('approved')}
          className="rounded-md whitespace-nowrap bg-ayu-fg px-2.5 py-1 text-xs font-medium text-ayu-panel transition-opacity hover:opacity-90"
        >
          {t('ensocode.demo.approval.allow')}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composer + status line
// ---------------------------------------------------------------------------

function Composer({ model, running, locked, compact = false }: { model: string; running: boolean; locked: boolean; compact?: boolean }) {
  const { t } = useTranslation();
  const [modeIdx, setModeIdx] = useState(1);
  const ModeIcon = approvalModes[modeIdx].icon;
  const pill =
    'flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.05] hover:text-ayu-fg';
  return (
    <div className={clsx('rounded-2xl border bg-ayu-panel shadow-sm', BORDER)}>
      <div className="truncate px-4 pt-3.5 pb-3 text-sm text-ayu-a-fg/45">
        {locked
          ? t('ensocode.demo.composer.locked')
          : running
            ? t('ensocode.demo.composer.running')
            : t('ensocode.demo.composer.idle')}
      </div>
      <div className="flex items-center justify-between gap-1.5 px-2 pt-0.5 pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
          >
            <ImagePlus className="h-3.5 w-3.5" />
          </button>
          {compact ? (
            <button type="button" className={clsx(pill, 'shrink-0 text-[11px]')}>
              {model}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          ) : (
            <>
              <button type="button" className={clsx(pill, 'shrink-0')}>
                <Layers className="h-3.5 w-3.5" />
                {t('ensocode.demo.global')}
              </button>
              <button type="button" className={clsx(pill, 'shrink-0 opacity-60')}>
                <House className="h-3.5 w-3.5" />
                {t('ensocode.demo.local')}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
              <button
                type="button"
                onClick={() => setModeIdx((i) => (i + 1) % approvalModes.length)}
                title={t('ensocode.demo.modesHint')}
                className={clsx(pill, 'shrink-0')}
              >
                <ModeIcon className="h-3.5 w-3.5" />
                {t(`ensocode.demo.modes.${approvalModes[modeIdx].key}`)}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
              <button type="button" className={clsx(pill, 'min-w-0')}>
                <span className="truncate">{model}</span>
                <Brain className="h-3 w-3 shrink-0 text-ayu-accent" />
                <span className="shrink-0 text-ayu-accent">{t('ensocode.demo.med')}</span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
              </button>
            </>
          )}
        </div>
        {running ? (
          <button
            type="button"
            className={clsx('flex size-8 shrink-0 items-center justify-center rounded-[10px] border bg-ayu-panel text-ayu-fg shadow-sm', BORDER)}
          >
            <CircleStop className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-ayu-accent text-ayu-panel opacity-35"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StatsLine({ model, step }: { model: string; step: number }) {
  const { t } = useTranslation();
  const context = Math.min(6 + step, 90);
  const segment = 'flex shrink-0 items-center gap-1';
  return (
    <div className="flex h-7 items-center justify-center gap-3 overflow-hidden px-2 text-[11px] text-ayu-a-fg/55 tabular-nums">
      <span className={segment}>
        <Cpu className="h-3 w-3 opacity-75" />
        {model} · {t('ensocode.demo.med')}
      </span>
      <span className={segment}>
        <Coins className="h-3 w-3 opacity-75" />↑{40 + step * 6}K ↓{(0.3 + step * 0.1).toFixed(1)}K
      </span>
      <span className={segment}>
        <Database className="h-3 w-3 opacity-75" />
        88%
      </span>
      <span className={segment}>
        <span className="h-1 w-7 overflow-hidden rounded-full bg-ayu-a-fg/20">
          <span className="block h-full rounded-full bg-ayu-a-fg/70" style={{ width: `${context}%` }} />
        </span>
        {context}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat area (script player + timeline + dock)
// ---------------------------------------------------------------------------

function ChatArea({
  name,
  model,
  script,
  initialStep,
  instant,
  approval,
  onApproval,
  onProgress,
  onComplete,
}: {
  name: string;
  model: string;
  script: Step[];
  initialStep: number;
  instant: boolean;
  approval?: Approval;
  onApproval?: (v: Approval) => void;
  onProgress: (step: number) => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(initialStep);
  const [goalPaused, setGoalPaused] = useState(false);
  const [goalCleared, setGoalCleared] = useState(false);
  const [hiddenTodo, setHiddenTodo] = useState(-1);

  const approvalIdx = script.findIndex((s) => s.type === 'approval');
  const waitingForApproval =
    Boolean(onApproval) && approvalIdx >= 0 && step > approvalIdx && (!approval || approval === 'pending');

  useEffect(() => {
    if (step >= script.length || waitingForApproval || goalPaused) return;
    const timer = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      onProgress(next);
      if (script[next - 1].type === 'approval') onApproval?.('pending');
      if (next >= script.length) onComplete();
    }, script[step].gap);
    return () => clearTimeout(timer);
  }, [step, waitingForApproval, goalPaused, script, onApproval, onProgress, onComplete]);

  // Auto-approve after a while so passive viewers see the full flow
  useEffect(() => {
    if (!waitingForApproval || !onApproval) return;
    const timer = setTimeout(() => onApproval('approved'), 8000);
    return () => clearTimeout(timer);
  }, [waitingForApproval, onApproval]);

  const visible = script
    .slice(0, step)
    .map((s, idx) => ({ s, idx }))
    .filter(({ s }) => !(s.skipIfRejected && approval === 'rejected'));
  const goalStep = visible.find(({ s }) => s.type === 'goal')?.s;
  const lastTodo = [...visible].reverse().find(({ s }) => s.toolContent?.kind === 'todos');
  const pinnedTodos =
    lastTodo?.s.toolContent?.kind === 'todos' &&
    lastTodo.idx !== hiddenTodo &&
    lastTodo.s.toolContent.items.some((todo) => todo.status !== 'completed')
      ? lastTodo.s.toolContent.items
      : null;
  const running = step < script.length;

  return (
    <>
      <Timeline name={name} model={model} script={script} step={step} approval={approval} instant={instant} />
      <div className="shrink-0 pt-1">
        <div className={CHAT_COL}>
          {waitingForApproval && <DemoApprovalBar command={script[approvalIdx].command!} onRespond={onApproval!} />}
          {goalStep && !goalCleared && (
            <DemoGoalBar
              text={goalStep.content!}
              turns={Math.min(step, 25)}
              paused={goalPaused}
              onTogglePause={() => setGoalPaused((v) => !v)}
              onClear={() => setGoalCleared(true)}
            />
          )}
          {pinnedTodos && <DemoTodoBar todos={pinnedTodos} onHide={() => setHiddenTodo(lastTodo!.idx)} />}
          <Composer model={model} running={running} locked={waitingForApproval} />
        </div>
        <StatsLine model={model} step={step} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Phone companion — the real PWA ChatScreen mirroring the desktop session
// ---------------------------------------------------------------------------

type AgentTab = { key: string; name: string; mode: ChildAgent['mode']; done: boolean };

const tabClass = (active: boolean) =>
  clsx(
    'flex min-w-0 shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
    active ? 'bg-ayu-a-fg/[.06] font-medium text-ayu-fg' : 'text-ayu-a-fg/60 hover:bg-ayu-a-fg/[.04] hover:text-ayu-fg',
  );

function PhoneCompanion({
  session,
  project,
  agents,
  step,
  approval,
  onApproval,
}: {
  session: Session;
  project: string;
  agents: AgentTab[];
  step: number;
  approval: Approval | undefined;
  onApproval: (v: Approval) => void;
}) {
  const running = step < session.script.length;
  const approvalIdx = session.script.findIndex((s) => s.type === 'approval');
  const pending = approvalIdx >= 0 && step > approvalIdx && (!approval || approval === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="absolute -bottom-10 -right-16 z-30 hidden w-[236px] select-none xl:block min-[1400px]:-right-[100px]"
    >
      {/* Device bezel is hardware, intentionally not themed */}
      <div className="rounded-[2.6rem] bg-neutral-900 p-[7px] shadow-2xl ring-1 ring-ayu-a-fg/15">
        <div className="flex h-[480px] flex-col overflow-hidden rounded-[2.2rem] bg-ayu-panel text-ayu-fg transition-colors duration-300">
          <div className="flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="h-[22px] w-[72px] rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <BatteryFull className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col" style={{ zoom: 0.68 }}>
            <div className={clsx('flex shrink-0 items-center gap-1 border-b px-2 py-2', BORDER)}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-ayu-a-fg/60">
                <PanelLeft className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {running && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ayu-green" />}
                  <span className="truncate text-sm font-medium">{session.title}</span>
                </div>
                <div className="truncate font-mono text-[11px] text-ayu-a-fg/60">{project}</div>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-ayu-a-fg/60">
                <SquarePen className="h-4 w-4" />
              </span>
            </div>

            <div className={clsx('flex shrink-0 gap-1 overflow-hidden border-b px-2 py-1', BORDER)}>
              <span className={tabClass(true)}>
                <MessageCircle className="h-3 w-3 shrink-0" />
                <span className="max-w-40 truncate">{session.title}</span>
              </span>
              {agents.map((a) => (
                <span key={a.key} className={tabClass(false)}>
                  {a.mode === 'task' ? <Zap className="h-3 w-3 shrink-0" /> : <Bot className="h-3 w-3 shrink-0" />}
                  <span className="max-w-32 truncate">{a.name}</span>
                  <StatusDot running={!a.done} />
                </span>
              ))}
            </div>

            <Timeline
              key={session.id}
              name="Enso"
              model={session.model}
              script={session.script}
              step={step}
              approval={approval}
              instant={!running}
              elapsed={false}
            />

            <div className="shrink-0 px-3 pt-1 pb-2">
              {pending && <DemoApprovalBar command={session.script[approvalIdx].command!} onRespond={onApproval} />}
              <Composer compact model={session.model} running={running} locked={pending} />
            </div>
          </div>

          <div className="flex h-5 shrink-0 items-center justify-center">
            <span className="h-1 w-24 rounded-full bg-ayu-fg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main preview
// ---------------------------------------------------------------------------

function IconButton({ icon: Icon, title }: { icon: LucideIcon; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-md text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function EnsoCodeDemoPreview() {
  const { t, i18n } = useTranslation();
  const [activeSessionId, setActiveSessionId] = useState('cart');
  const [viewingAgent, setViewingAgent] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [played, setPlayed] = useState<Set<string>>(new Set());
  const [approvals, setApprovals] = useState<Record<string, Approval>>({});

  const handleProgress = useCallback(
    (key: string, step: number) => setProgress((p) => ({ ...p, [key]: step })),
    [],
  );
  const handleApproval = useCallback(
    (key: string, v: Approval) => setApprovals((p) => ({ ...p, [key]: v })),
    [],
  );
  const handleComplete = useCallback(
    (key: string) => setPlayed((p) => new Set(p).add(key)),
    [],
  );

  const activeRepo = repos.find((r) => r.sessions.some((s) => s.id === activeSessionId))!;
  const activeSession = activeRepo.sessions.find((s) => s.id === activeSessionId)!;
  const approval = approvals[activeSessionId];
  const isPlayed = played.has(activeSessionId);
  const currentStep = isPlayed ? activeSession.script.length : (progress[activeSessionId] ?? 0);

  const agents = (activeSession.agents ?? [])
    .filter((a) =>
      activeSession.script
        .slice(0, currentStep)
        .some((s) => (s.type === 'dispatch' || s.type === 'coworker') && s.name === a.name),
    )
    .map((a) => {
      const key = `${activeSessionId}:${a.name}`;
      const done = played.has(key) || isPlayed;
      return { ...a, key, done, step: done ? a.script.length : (progress[key] ?? 0) };
    });

  const sessionState = (s: Session): 'running' | 'waiting' | null => {
    if (played.has(s.id)) return null;
    if (approvals[s.id] === 'pending') return 'waiting';
    return s.id === activeSessionId ? 'running' : null;
  };
  const relativeTime = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'always' });
  const activeSessions = repos.flatMap((r) => r.sessions).filter((s) => sessionState(s) !== null);

  const sessionRow = (s: Session, tree: boolean) => {
    const state = sessionState(s);
    const active = s.id === activeSessionId;
    return (
      <button
        key={s.id}
        type="button"
        onClick={() => { setActiveSessionId(s.id); setViewingAgent(null); }}
        className={clsx(
          'relative grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-lg py-1.5 pr-2 pl-2 text-left text-sm transition-colors',
          active ? 'bg-ayu-a-accent/10 text-ayu-fg' : 'text-ayu-a-fg/60 hover:bg-ayu-a-fg/[.05] hover:text-ayu-fg',
        )}
      >
        {tree && (state ? (
          <>
            <span className="absolute top-0 left-[calc(1rem-0.5px)] h-2 w-px bg-ayu-a-fg/[.12]" />
            <span className="absolute top-6 bottom-0 left-[calc(1rem-0.5px)] w-px bg-ayu-a-fg/[.12]" />
          </>
        ) : (
          <span className="absolute top-0 bottom-0 left-[calc(1rem-0.5px)] w-px bg-ayu-a-fg/[.12]" />
        ))}
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          {state && (
            <span className={clsx('size-2 rounded-full', state === 'waiting' ? 'bg-ayu-yellow' : 'animate-pulse bg-ayu-accent')} />
          )}
        </span>
        <span className="truncate">{s.title}</span>
        <span className="shrink-0 text-[10px] text-ayu-a-fg/55 tabular-nums">{relativeTime.format(-s.ago, 'minute')}</span>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-full max-w-6xl mx-auto"
    >
      {/* Desktop window — ayu tokens, synced with site theme */}
      <div className={clsx('overflow-hidden rounded-xl border bg-ayu-panel text-left text-ayu-fg shadow-2xl transition-colors duration-300', BORDER)}>
        {/* Title bar */}
        <div className={clsx('flex h-11 items-center gap-2 border-b pr-3 pl-4', BORDER)}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-4 text-sm font-medium text-ayu-a-fg/60">EnsoCode</span>
          <div className="ml-auto flex items-center gap-1 text-ayu-a-fg/60">
            <span className="flex h-7 w-7 items-center justify-center">
              <UnfoldHorizontal className="h-4 w-4" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center">
              <PanelRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex h-[620px]">
          {/* Sidebar */}
          <div className={clsx('flex w-64 shrink-0 flex-col border-r bg-ayu-bg transition-colors duration-300', BORDER)}>
            <div className="flex h-12 shrink-0 items-center justify-between pr-3 pl-1.5">
              <button
                type="button"
                className="flex h-7 min-w-0 items-center gap-1.5 rounded-lg px-2 text-xs text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
              >
                <Laptop className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium">{t('ensocode.demo.thisComputer')}</span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
              </button>
              <div className="flex items-center">
                <IconButton icon={Search} />
                <IconButton icon={Plus} />
              </div>
            </div>
            <div className={clsx('flex shrink-0 items-center border-b px-2 pb-2', BORDER)}>
              <div className="flex h-[26px] min-w-0 flex-1 items-center gap-2 rounded-full bg-ayu-a-fg/[.05] pl-2.5 text-xs text-ayu-a-fg/60">
                <TextSearch className="size-3.5 shrink-0" />
                <span className="truncate">{t('ensocode.demo.search')}</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
              {activeSessions.length > 0 && (
                <div>
                  <div className="px-2 py-2 text-xs font-medium text-ayu-a-fg/60">{t('ensocode.demo.active')}</div>
                  {activeSessions.map((s) => sessionRow(s, false))}
                </div>
              )}
              {repos.map((repo) => (
                <div key={repo.name}>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-2">
                    <span className="flex size-4 shrink-0 items-center justify-center text-ayu-a-fg/60">
                      <FolderOpen className="size-4" />
                    </span>
                    <span className="truncate text-sm font-medium">{repo.name}</span>
                  </div>
                  {repo.sessions.map((s) => sessionRow(s, true))}
                </div>
              ))}
            </div>

            <div className={clsx('flex shrink-0 items-center justify-between border-t p-2', BORDER)}>
              <IconButton icon={PanelLeftClose} />
              <div className="flex items-center">
                <IconButton icon={Sparkles} />
                <IconButton icon={Settings} />
              </div>
            </div>
          </div>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Chat header: session tab + child agent tabs + hire + project badge */}
            <div className={clsx('flex items-center gap-1 border-b px-2 py-1', BORDER)}>
              <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
                <button type="button" onClick={() => setViewingAgent(null)} className={tabClass(viewingAgent === null)}>
                  <MessageCircle className="h-3 w-3 shrink-0" />
                  <span className="max-w-48 truncate">{activeSession.title}</span>
                </button>
                {agents.map((a) => (
                  <button key={a.key} type="button" onClick={() => setViewingAgent(a.name)} className={tabClass(viewingAgent === a.name)}>
                    {a.mode === 'task' ? <Zap className="h-3 w-3 shrink-0" /> : <Bot className="h-3 w-3 shrink-0" />}
                    <span className="max-w-48 truncate">{a.name}</span>
                    <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center">
                      <StatusDot running={!a.done} />
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  title={t('ensocode.demo.hire')}
                  className="shrink-0 rounded p-1 text-ayu-a-fg/60 transition-colors hover:bg-ayu-a-fg/[.06] hover:text-ayu-fg"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className={clsx('ml-1.5 hidden h-6 min-w-0 shrink-0 items-center gap-1.5 rounded-full border px-2 font-mono text-[11.5px] text-ayu-a-fg/60 sm:flex', BORDER)}>
                <Folder className="h-3 w-3 shrink-0" />
                <span className="max-w-40 truncate">{activeRepo.name}</span>
                <span className="opacity-40">/</span>
                <GitBranch className="h-3 w-3 shrink-0" />
                <span className="max-w-40 truncate">{activeRepo.branch}</span>
                <StatusDot running={!isPlayed || agents.some((a) => !a.done)} />
              </div>
            </div>

            {/* Main session view */}
            <div className={clsx('flex-1 flex flex-col min-h-0', viewingAgent !== null && 'hidden')}>
              <ChatArea
                key={activeSessionId}
                name="Enso"
                model={activeSession.model}
                script={activeSession.script}
                initialStep={currentStep}
                instant={isPlayed}
                approval={approval}
                onApproval={(v) => handleApproval(activeSessionId, v)}
                onProgress={(step) => handleProgress(activeSessionId, step)}
                onComplete={() => handleComplete(activeSessionId)}
              />
            </div>

            {/* Child agent views — mount when dispatched, keep running in background */}
            {agents.map((a) => (
              <div key={a.key} className={clsx('flex-1 flex flex-col min-h-0', viewingAgent !== a.name && 'hidden')}>
                <ChatArea
                  name={a.name}
                  model={activeSession.model}
                  script={a.script}
                  initialStep={a.step}
                  instant={a.done}
                  onProgress={(step) => handleProgress(a.key, step)}
                  onComplete={() => handleComplete(a.key)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone companion (bottom-right overlay) */}
      <PhoneCompanion
        session={activeSession}
        project={activeRepo.name}
        agents={agents}
        step={currentStep}
        approval={approval}
        onApproval={(v) => handleApproval(activeSessionId, v)}
      />
    </motion.div>
  );
}
