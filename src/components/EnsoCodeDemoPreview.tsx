import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowUp,
  Bot,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Folder,
  GitBranch,
  History,
  ListFilter,
  Loader2,
  Lock,
  Mic,
  Paperclip,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  TerminalSquare,
  Wifi,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

// ---------------------------------------------------------------------------
// Script types & data
// ---------------------------------------------------------------------------

type DiffLine = { kind: 'add' | 'del' | 'ctx'; text: string };

type ToolContent =
  | { kind: 'diff'; added: number; removed: number; lines: DiffLine[] }
  | { kind: 'output'; text: string }
  | { kind: 'file'; lines: string[] };

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
  tool?: 'read' | 'bash' | 'edit' | 'search';
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

interface Session {
  id: string;
  title: string;
  model: string;
  script: Step[];
  coworker?: { name: string; script: Step[] };
}

interface Repo {
  name: string;
  branch: string;
  sessions: Session[];
}

const repos: Repo[] = [
  {
    name: 'shop-storefront',
    branch: 'main',
    sessions: [
      {
        id: 'cart',
        title: 'Cart discount logic',
        model: 'Opus 4.5',
        script: [
          { type: 'user', gap: 900, content: 'Cart needs the second-item-half-price promo before Friday\'s campaign.' },
          { type: 'thinking', gap: 1300, content: 'Decomposing the task, planning agent dispatch…' },
          { type: 'goal', gap: 1400, content: 'Ship second-item-half-price cart discount' },
          { type: 'dispatch', gap: 1700, name: 'scout', task: 'Locate cart pricing logic' },
          { type: 'agent-done', gap: 2400, name: 'scout', result: 'Found 3 relevant files: pricing.ts, CartSummary.tsx, cart.test.ts' },
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
          { type: 'approval', gap: 1700, command: 'pnpm test -- cart' },
          {
            type: 'tool', gap: 1500, tool: 'bash', target: 'pnpm test -- cart', duration: '842ms', skipIfRejected: true,
            toolContent: {
              kind: 'output',
              text: '✓ cart.pricing › second item half price\n✓ cart.pricing › odd item count rounds down\n\nTest Files  1 passed (1)\n     Tests  2 passed (2)',
            },
          },
          { type: 'tasknote', gap: 1300, content: 'Checkpoint #12 · before cart discount edit' },
          { type: 'text', gap: 1600, content: 'Done. The discount applies to the cheapest item of every pair, tests pass, and checkpoint #12 is saved for one-click rollback.' },
        ],
      },
      {
        id: 'i18n',
        title: 'Checkout i18n',
        model: 'Gemini 3',
        script: [
          { type: 'user', gap: 900, content: 'Extract checkout page copy into locale files.' },
          {
            type: 'tool', gap: 1500, tool: 'search', target: '"Checkout" in src/**/*.tsx', duration: '0.3s',
            toolContent: { kind: 'output', text: '14 matches in 5 files' },
          },
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
        model: 'GPT-5.2 Codex',
        script: [
          { type: 'user', gap: 900, content: 'The orders table slow query alert is firing again.' },
          { type: 'coworker', gap: 1600, name: 'db-detective' },
          { type: 'text', gap: 1800, content: 'Hired coworker db-detective to investigate in its own tab — click the tab above to watch it work, or steer it anytime.' },
          { type: 'agent-done', gap: 9500, name: 'db-detective', result: 'Root cause: missing composite index on orders(status, created_at). Migration drafted.' },
          { type: 'text', gap: 1600, content: 'Migration ready — p95 should drop from ~1.8s to ~12ms. Review the diff in db-detective\'s tab. Want me to apply it?' },
        ],
        coworker: {
          name: 'db-detective',
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
        model: 'Sonnet 4.5',
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
  { key: 'full' },
  { key: 'auto' },
  { key: 'access' },
] as const;

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function AgentAvatar({ className }: { className?: string }) {
  return (
    <div className={clsx('shrink-0 rounded-md bg-ayu-line/50 flex items-center justify-center', className)}>
      <Bot className="w-[60%] h-[60%] text-ayu-fg/60" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline rows (faithful to enso-code TimelineRow)
// ---------------------------------------------------------------------------

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-ayu-accent px-4 py-2.5 text-sm text-white">
        {text}
      </div>
    </div>
  );
}

function ThinkingRow({ text, live }: { text: string; live: boolean }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-ayu-fg/60 transition-colors hover:text-ayu-fg"
      >
        <Brain className={clsx('h-3.5 w-3.5', live && 'animate-pulse')} />
        <span>{t('ensocode.demo.thinking')}</span>
        <ChevronRight className={clsx('h-3 w-3 transition-transform', expanded && 'rotate-90')} />
      </button>
      {expanded && (
        <p className="mt-1.5 border-l-2 border-ayu-line pl-3 text-xs leading-relaxed text-ayu-fg/60">
          {text}
        </p>
      )}
    </div>
  );
}

function AgentText({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <AgentAvatar className="w-6 h-6 mt-0.5" />
      <div className="min-w-0">
        <span className="text-xs font-semibold text-ayu-fg">{name}</span>
        <p className="text-sm text-ayu-fg/80 leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}

function ToolRow({ step, instant }: { step: Step; instant: boolean }) {
  const { t } = useTranslation();
  const [state, setState] = useState<'running' | 'ok'>(instant ? 'ok' : 'running');
  const [expanded, setExpanded] = useState(!instant && step.toolContent?.kind === 'diff');

  useEffect(() => {
    if (instant) return;
    const timer = setTimeout(() => setState('ok'), 900);
    return () => clearTimeout(timer);
  }, [instant]);

  const expandable = Boolean(step.toolContent);

  return (
    <div className="rounded-lg border border-ayu-line/60 bg-ayu-line/20">
      <button
        type="button"
        disabled={!expandable}
        onClick={() => setExpanded((v) => !v)}
        className={clsx(
          'flex min-w-0 w-full flex-1 items-center gap-2 px-3 py-1.5 text-left text-xs',
          expandable && 'cursor-pointer hover:bg-ayu-line/30',
        )}
      >
        {state === 'running' ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-ayu-fg/60" />
        ) : (
          <Check className="h-3.5 w-3.5 shrink-0 text-ayu-fg/60" />
        )}
        <span className="shrink-0 font-medium text-ayu-fg">{t(`ensocode.demo.tools.${step.tool}`)}</span>
        <span className="text-ayu-fg/40">·</span>
        <span className="min-w-0 flex-1 truncate font-mono text-ayu-fg/60">{step.target}</span>
        {state === 'ok' && step.duration && (
          <span className="shrink-0 font-mono text-[10px] text-ayu-fg/50 tabular-nums">{step.duration}</span>
        )}
        {expandable && (
          <ChevronRight className={clsx('h-3 w-3 shrink-0 text-ayu-fg/60 transition-transform', expanded && 'rotate-90')} />
        )}
      </button>
      {expanded && step.toolContent && (
        <div className="rounded-b-lg border-t border-ayu-line/60">
          {step.toolContent.kind === 'diff' && (
            <div className="font-mono text-[11px] leading-relaxed py-1">
              {step.toolContent.lines.map((l, i) => (
                <div
                  key={i}
                  className={clsx(
                    'px-3 whitespace-pre-wrap',
                    l.kind === 'add' && 'bg-ayu-string/10 text-ayu-string',
                    l.kind === 'del' && 'bg-ayu-tag/10 text-ayu-tag',
                    l.kind === 'ctx' && 'text-ayu-fg/60',
                  )}
                >
                  {l.kind === 'add' ? '+ ' : l.kind === 'del' ? '- ' : '  '}{l.text}
                </div>
              ))}
            </div>
          )}
          {step.toolContent.kind === 'output' && (
            <pre className="px-3 py-2 font-mono text-[11px] leading-relaxed text-ayu-fg/60 whitespace-pre-wrap">
              {step.toolContent.text}
            </pre>
          )}
          {step.toolContent.kind === 'file' && (
            <div className="font-mono text-[11px] leading-relaxed py-1">
              {step.toolContent.lines.map((l, i) => (
                <div key={i} className="px-3 whitespace-pre-wrap text-ayu-fg/70">
                  <span className="inline-block w-6 text-right mr-3 text-ayu-fg/30 select-none">{i + 1}</span>
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DispatchRow({ name }: { name: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 rounded-md border border-ayu-line/60 bg-ayu-line/20 px-2.5 py-2 text-xs">
      <Bot className="h-3.5 w-3.5 shrink-0 text-ayu-fg" />
      <span className="text-ayu-fg/60">{t('ensocode.demo.dispatchedTo')}</span>
      <span className="font-medium text-ayu-fg">{name}</span>
    </div>
  );
}

function AgentDoneRow({ name, result }: { name: string; result?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-2 rounded-md border border-ayu-string/30 bg-ayu-string/5 px-2.5 py-2 text-xs">
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ayu-string" />
      <div className="min-w-0">
        <p className="font-medium text-ayu-fg">{name} · {t('ensocode.demo.completed')}</p>
        {result && <p className="mt-0.5 text-ayu-fg/60">{result}</p>}
      </div>
    </div>
  );
}

function TaskNoteRow({ text }: { text: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="h-px flex-1 bg-ayu-line" />
      <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-ayu-fg/60">
        <Check className="h-3 w-3 text-ayu-string" />
        {text}
      </span>
      <span className="h-px flex-1 bg-ayu-line" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bars above composer (GoalBar / TaskBar / ApprovalBar)
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
    <div className="mb-1 flex items-center gap-2 rounded-lg border border-ayu-line/60 bg-ayu-line/20 px-2.5 py-1.5 text-xs text-ayu-fg">
      <Target className="h-3.5 w-3.5 shrink-0 text-ayu-fg/60" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <span className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', paused ? 'bg-ayu-func' : 'bg-ayu-string animate-pulse')} />
      <span className="shrink-0 font-mono text-[10px] text-ayu-fg/60 tabular-nums">
        {paused ? t('ensocode.demo.paused') : t('ensocode.demo.working')} · {turns}/25
      </span>
      <button type="button" onClick={onTogglePause} className="shrink-0 rounded p-0.5 text-ayu-fg/60 hover:text-ayu-fg">
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      <button type="button" onClick={onClear} className="shrink-0 rounded p-0.5 text-ayu-fg/60 hover:text-ayu-tag">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function DemoTaskBar({ name, task }: { name: string; task?: string }) {
  return (
    <div className="mb-1 rounded-lg border border-ayu-line/60 bg-ayu-line/20">
      <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ayu-string animate-pulse" />
        <Bot className="h-3.5 w-3.5 shrink-0 text-ayu-fg/60" />
        <span className="min-w-0 flex-1 truncate text-ayu-fg/60">
          <span className="mr-1 rounded border border-ayu-line bg-ayu-line/30 px-1 py-px text-[10px]">{name}</span>
          {task}
        </span>
      </div>
    </div>
  );
}

function DemoApprovalBar({ command, onRespond }: { command: string; onRespond: (v: 'approved' | 'rejected') => void }) {
  const { t } = useTranslation();
  return (
    <div className="mb-1 rounded-lg border border-ayu-line/60 bg-ayu-line/20 px-2.5 py-2">
      <div className="flex items-center gap-2 text-xs">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-ayu-func" />
        <span className="shrink-0 text-[10px] font-medium tracking-wide text-ayu-fg/60 uppercase">
          {t('ensocode.demo.approval.title')}
        </span>
        <span className="flex min-w-0 items-center gap-1 text-ayu-fg/60">
          <TerminalSquare className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate font-mono">bash</span>
        </span>
      </div>
      <pre className="mt-1.5 max-h-24 overflow-auto rounded-md bg-ayu-line/30 px-2 py-1.5 font-mono text-xs text-ayu-fg/80 whitespace-pre-wrap">
        {command}
      </pre>
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => onRespond('rejected')}
          className="rounded-md px-2.5 py-1 text-xs text-ayu-tag transition-colors hover:bg-ayu-tag/10"
        >
          {t('ensocode.demo.approval.deny')}
        </button>
        <button
          type="button"
          onClick={() => onRespond('approved')}
          className="rounded-md px-2.5 py-1 text-xs text-ayu-fg/60 transition-colors hover:bg-ayu-line/30 hover:text-ayu-fg"
        >
          {t('ensocode.demo.approval.allowSession')}
        </button>
        <button
          type="button"
          onClick={() => onRespond('approved')}
          className="rounded-md bg-ayu-accent px-2.5 py-1 text-xs font-medium text-white transition-colors hover:opacity-90"
        >
          {t('ensocode.demo.approval.allow')}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat area (timeline player + bars + composer)
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const approvalIdx = script.findIndex((s) => s.type === 'approval');
  const waitingForApproval = approvalIdx >= 0 && step > approvalIdx && !approval;

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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const visible = script
    .slice(0, step)
    .filter((s) => !(s.skipIfRejected && approval === 'rejected'));

  // Derived bars
  const goalStep = visible.find((s) => s.type === 'goal');
  const lastDispatch = [...visible].reverse().find((s) => s.type === 'dispatch' || s.type === 'agent-done');
  const taskActive = lastDispatch?.type === 'dispatch' ? lastDispatch : null;
  const approvalStep = approvalIdx >= 0 && step > approvalIdx ? script[approvalIdx] : null;
  const running = step < script.length;

  return (
    <>
      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Agent identity header */}
        <div className="flex items-center gap-3 pb-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fca5a5] via-[#f472b6] to-[#a78bfa]" />
          <div>
            <div className="text-sm font-semibold text-ayu-fg">{name}</div>
            <div className="text-xs text-ayu-fg/60">{model}</div>
          </div>
        </div>

        {visible.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {s.type === 'user' && <UserBubble text={s.content!} />}
            {s.type === 'thinking' && <ThinkingRow text={s.content!} live={!instant && i === visible.length - 1 && running} />}
            {s.type === 'text' && <AgentText name={name} text={s.content!} />}
            {s.type === 'tool' && <ToolRow step={s} instant={instant} />}
            {s.type === 'dispatch' && <DispatchRow name={s.name!} />}
            {s.type === 'agent-done' && <AgentDoneRow name={s.name!} result={s.result} />}
            {s.type === 'coworker' && <DispatchRow name={s.name!} />}
            {s.type === 'approval' && null /* rendered as ApprovalBar above composer */}
            {s.type === 'tasknote' && <TaskNoteRow text={s.content!} />}
          </motion.div>
        ))}

        {running && !waitingForApproval && (
          <div className="flex items-center gap-1.5 px-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ayu-fg/40" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ayu-fg/40 [animation-delay:0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ayu-fg/40 [animation-delay:0.3s]" />
          </div>
        )}
      </div>

      {/* Bars + composer */}
      <div className="shrink-0 px-3 pb-3 pt-1">
        {taskActive && <DemoTaskBar name={taskActive.name!} task={taskActive.task} />}
        {approvalStep && (!approval || approval === 'pending') && onApproval && (
          <DemoApprovalBar command={approvalStep.command!} onRespond={onApproval} />
        )}
        {goalStep && !goalCleared && (
          <DemoGoalBar
            text={goalStep.content!}
            turns={Math.min(step, 25)}
            paused={goalPaused}
            onTogglePause={() => setGoalPaused((v) => !v)}
            onClear={() => setGoalCleared(true)}
          />
        )}
        <Composer model={model} running={running} />
      </div>
    </>
  );
}

function Composer({ model, running }: { model: string; running: boolean }) {
  const { t } = useTranslation();
  const [modeIdx, setModeIdx] = useState(1);
  return (
    <div className="rounded-xl border border-ayu-line bg-ayu-panel shadow-sm transition-colors">
      <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-2">
        <span className="flex-1 text-sm text-ayu-fg/35 truncate">{t('ensocode.demo.composer')}</span>
        <Mic className="h-4 w-4 text-ayu-fg/40" />
      </div>
      <div className="flex items-center justify-between gap-1.5 px-1.5 pb-1.5">
        <div className="flex items-center gap-1">
          <button type="button" className="rounded-md p-1.5 text-ayu-fg/60 hover:bg-ayu-line/30 hover:text-ayu-fg">
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setModeIdx((i) => (i + 1) % approvalModes.length)}
            title={t('ensocode.demo.modesHint')}
            className="flex items-center gap-1 rounded-md border border-ayu-line bg-ayu-line/20 px-2 py-1 text-[11px] text-ayu-fg/80 hover:bg-ayu-line/30 cursor-pointer"
          >
            {t(`ensocode.demo.modes.${approvalModes[modeIdx].key}`)}
            <ChevronDown className="h-3 w-3 text-ayu-fg/60" />
          </button>
          <button type="button" className="flex items-center gap-1 rounded-md border border-ayu-line bg-ayu-line/20 px-2 py-1 text-[11px] text-ayu-fg/80">
            {model}
            <ChevronDown className="h-3 w-3 text-ayu-fg/60" />
          </button>
        </div>
        {running ? (
          <button type="button" className="h-7 w-7 shrink-0 rounded-lg border border-ayu-line flex items-center justify-center text-ayu-fg/60 hover:text-ayu-fg">
            <CircleStop className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" className="h-7 w-7 shrink-0 rounded-lg bg-ayu-accent flex items-center justify-center text-white hover:opacity-90">
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phone companion — mirrors the desktop session timeline (chat style)
// ---------------------------------------------------------------------------

function PhoneAgentRow({ children, badge }: { children: ReactNode; badge?: ReactNode }) {
  return (
    <div className="flex items-start gap-1.5">
      <AgentAvatar className="w-4 h-4 mt-px" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-semibold text-ayu-fg/60">EnsoCode</span>
          {badge}
        </div>
        <div className="text-[9px] leading-snug mt-px flex flex-col text-ayu-fg/80">{children}</div>
      </div>
    </div>
  );
}

function PhoneCompanion({
  session,
  step,
  approval,
  onApproval,
}: {
  session: Session;
  step: number;
  approval: Approval | undefined;
  onApproval: (v: Approval) => void;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const visible = session.script
    .slice(0, step)
    .filter((s) => !(s.skipIfRejected && approval === 'rejected'));

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 3 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      className="absolute -bottom-8 right-4 xl:-right-8 w-52 z-30 select-none"
    >
      <div className="rounded-[2rem] border-2 border-ayu-line bg-ayu-panel shadow-2xl overflow-hidden flex flex-col h-[400px] transition-colors">
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 text-[9px] text-ayu-fg/60 shrink-0">
          <span className="font-semibold">9:41</span>
          <div className="w-12 h-3.5 bg-black rounded-full" />
          <Wifi className="w-3 h-3" />
        </div>

        {/* App header */}
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-ayu-line shrink-0">
          <ChevronLeft className="w-3.5 h-3.5 text-ayu-fg/60" />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-ayu-fg">EnsoCode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-ayu-string" />
            </div>
            <div className="text-[8px] text-ayu-fg/40 flex items-center gap-1">
              Desktop · {t('ensocode.demo.phone.desktop')}
              <Lock className="w-2 h-2 text-ayu-string" />
            </div>
          </div>
          <RefreshCw className="w-3 h-3 text-ayu-fg/50 ml-auto" />
        </div>

        {/* Timeline mirror */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
          {visible.map((s, i) => (
            <motion.div
              key={`${session.id}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {s.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl rounded-br-sm bg-ayu-accent px-2.5 py-1.5 text-[9px] text-white leading-snug">
                    {s.content}
                  </div>
                </div>
              )}

              {s.type === 'thinking' && (
                <PhoneAgentRow>
                  <span className="text-ayu-fg/40 italic">{t('ensocode.demo.phone.thinking')}</span>
                </PhoneAgentRow>
              )}

              {s.type === 'goal' && (
                <div className="rounded-lg bg-ayu-line/20 border border-ayu-line px-2 py-1.5">
                  <div className="flex items-center gap-1 text-[8px] text-ayu-fg/60">
                    <Target className="w-2.5 h-2.5" />
                    {t('ensocode.demo.goal')}
                    <span className="ml-auto">{Math.min(step, 25)}/25</span>
                  </div>
                  <p className="text-[9px] text-ayu-fg font-medium leading-snug mt-0.5">{s.content}</p>
                  <div className="mt-1 h-0.5 rounded-full bg-ayu-line overflow-hidden">
                    <div className="h-full bg-ayu-string transition-all duration-500" style={{ width: `${Math.min((step / 25) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {s.type === 'tool' && (
                <PhoneAgentRow
                  badge={<span className="text-[7px] px-1 py-px rounded bg-ayu-string/15 text-ayu-string font-medium">{t('ensocode.demo.phone.done')}</span>}
                >
                  <span>{t(`ensocode.demo.tools.${s.tool}`)}</span>
                  <span className="text-ayu-fg/40 font-mono truncate">{s.target}</span>
                </PhoneAgentRow>
              )}

              {s.type === 'dispatch' && (
                <PhoneAgentRow
                  badge={<span className="flex items-center gap-0.5 text-[7px] text-ayu-accent"><span className="w-1 h-1 rounded-full bg-ayu-accent animate-pulse" />live</span>}
                >
                  <span>{t('ensocode.demo.subagent')} · {s.name}</span>
                  <span className="text-ayu-fg/40 truncate">{s.task}</span>
                </PhoneAgentRow>
              )}

              {s.type === 'agent-done' && (
                <PhoneAgentRow
                  badge={<span className="text-[7px] px-1 py-px rounded bg-ayu-string/15 text-ayu-string font-medium">{t('ensocode.demo.phone.done')}</span>}
                >
                  <span>{t('ensocode.demo.subagent')} · {s.name}</span>
                  <span className="text-ayu-fg/40 truncate">{s.result}</span>
                </PhoneAgentRow>
              )}

              {s.type === 'coworker' && (
                <PhoneAgentRow
                  badge={<span className="flex items-center gap-0.5 text-[7px] text-ayu-accent"><span className="w-1 h-1 rounded-full bg-ayu-accent animate-pulse" />live</span>}
                >
                  <span>{t('ensocode.demo.coworker')} · {s.name}</span>
                  <span className="text-ayu-fg/40 truncate">{t('ensocode.demo.phone.coworkerTask')}</span>
                </PhoneAgentRow>
              )}

              {s.type === 'approval' && (
                <div className="rounded-lg bg-ayu-func/10 border border-ayu-func/30 px-2 py-1.5">
                  <div className="flex items-center gap-1 text-[8px] text-ayu-func font-medium">
                    <ShieldAlert className="w-2.5 h-2.5" />
                    {t('ensocode.demo.approval.title')}
                  </div>
                  <div className="mt-1 font-mono text-[8px] text-ayu-fg/80 bg-ayu-line/30 rounded px-1.5 py-1 truncate">{s.command}</div>
                  {!approval || approval === 'pending' ? (
                    <div className="mt-1.5 flex gap-1">
                      <button
                        onClick={() => onApproval('approved')}
                        className="flex-1 rounded bg-ayu-string text-white text-[9px] font-bold py-1 cursor-pointer"
                      >
                        {t('ensocode.demo.approval.approve')}
                      </button>
                      <button
                        onClick={() => onApproval('rejected')}
                        className="flex-1 rounded border border-ayu-tag/60 text-ayu-tag text-[9px] font-bold py-1 cursor-pointer"
                      >
                        {t('ensocode.demo.approval.reject')}
                      </button>
                    </div>
                  ) : (
                    <div className={clsx('mt-1 flex items-center gap-1 text-[8px] font-semibold', approval === 'approved' ? 'text-ayu-string' : 'text-ayu-tag')}>
                      <Check className="w-2.5 h-2.5" /> {t(`ensocode.demo.approval.${approval}`)}
                    </div>
                  )}
                </div>
              )}

              {s.type === 'tasknote' && (
                <div className="flex items-center gap-1 text-[8px] text-ayu-fg/40">
                  <History className="w-2.5 h-2.5" />
                  <span className="truncate">{s.content}</span>
                </div>
              )}

              {s.type === 'text' && (
                <PhoneAgentRow>
                  <span className="leading-snug">{s.content}</span>
                </PhoneAgentRow>
              )}
            </motion.div>
          ))}
        </div>

        {/* Composer */}
        <div className="shrink-0 px-2 pb-4 pt-1.5 border-t border-ayu-line">
          <div className="flex items-center gap-1.5 rounded-full bg-ayu-line/20 border border-ayu-line px-2.5 py-1.5">
            <span className="flex-1 text-[9px] text-ayu-fg/30 truncate">{t('ensocode.demo.phone.composer')}</span>
            <Mic className="w-3 h-3 text-ayu-fg/40" />
            <div className="w-5 h-5 rounded-full bg-ayu-accent flex items-center justify-center">
              <Send className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main preview
// ---------------------------------------------------------------------------

export function EnsoCodeDemoPreview() {
  const { t } = useTranslation();
  const [activeSessionId, setActiveSessionId] = useState('cart');
  const [viewingCoworker, setViewingCoworker] = useState(false);
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

  const coworkerKey = `${activeSessionId}:cw`;
  const coworkerVisible = activeSession.script.slice(0, currentStep).some((s) => s.type === 'coworker');
  const coworkerPlayed = played.has(coworkerKey);
  const coworkerStep = coworkerPlayed
    ? (activeSession.coworker?.script.length ?? 0)
    : (progress[coworkerKey] ?? 0);

  const sessionStatus = (s: Session): 'running' | 'waiting' | 'done' => {
    if (played.has(s.id)) return 'done';
    if (approvals[s.id] === 'pending') return 'waiting';
    return 'running';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-full max-w-6xl mx-auto"
    >
      {/* Desktop window — ayu tokens, synced with site theme */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-ayu-line/50 bg-ayu-panel text-left transition-colors duration-300">
        {/* Title bar */}
        <div className="relative h-11 border-b border-ayu-line flex items-center px-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <img src="/ensocode/logo.png" alt="EnsoCode" className="w-4 h-4 rounded" />
            <span className="text-xs font-medium text-ayu-fg/60">EnsoCode</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xs text-ayu-fg/50">EnsoCode</span>
          </div>
          <div className="ml-auto text-ayu-fg/50">
            <Folder className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex h-[540px]">
          {/* Sidebar */}
          <div className="w-60 shrink-0 border-r border-ayu-line bg-ayu-bg/60 flex flex-col transition-colors duration-300">
            <div className="shrink-0 px-2 py-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ayu-fg/40" />
                <div className="h-8 rounded-md border border-ayu-line bg-ayu-panel pl-8 pr-2 flex items-center text-xs text-ayu-fg/40">
                  {t('ensocode.demo.search')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5">
              <span className="text-xs text-ayu-fg/60">{t('ensocode.demo.repos', { count: repos.length })}</span>
              <div className="ml-auto flex items-center gap-1 text-ayu-fg/40">
                <ListFilter className="h-3.5 w-3.5" />
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <Plus className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
              {repos.map((repo) => (
                <div key={repo.name}>
                  <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-xs">
                    <ChevronDown className="h-3 w-3 shrink-0 text-ayu-fg/40" />
                    <span className="font-semibold text-ayu-fg truncate">{repo.name}</span>
                    <GitBranch className="h-3 w-3 shrink-0 text-ayu-fg/40" />
                    <span className="text-ayu-fg/60 truncate">{repo.branch}</span>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ayu-string" />
                    <span className="ml-auto shrink-0 text-[10px] text-ayu-fg/40">
                      {t('ensocode.demo.sessions', { count: repo.sessions.length })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-0.5">
                    {repo.sessions.map((s) => {
                      const status = sessionStatus(s);
                      const active = s.id === activeSessionId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setActiveSessionId(s.id); setViewingCoworker(false); }}
                          className={clsx(
                            'group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-xs transition-colors w-full text-left',
                            active
                              ? 'bg-ayu-line/40 text-ayu-fg'
                              : 'text-ayu-fg/60 hover:bg-ayu-line/20 hover:text-ayu-fg',
                          )}
                        >
                          <span
                            className={clsx(
                              'h-1.5 w-1.5 shrink-0 rounded-full',
                              status === 'running' && 'bg-ayu-string animate-pulse',
                              status === 'waiting' && 'bg-ayu-func animate-pulse',
                              status === 'done' && 'bg-ayu-accent',
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">{s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 flex items-center gap-2 border-t border-ayu-line px-3 py-2.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                J
              </div>
              <span className="text-xs text-ayu-fg/80">j3n5en</span>
              <SlidersHorizontal className="h-3.5 w-3.5 ml-auto text-ayu-fg/40" />
            </div>
          </div>

          {/* Main column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header: session tab + coworker tab + hire */}
            <div className="flex items-center gap-1 border-b border-ayu-line px-2 py-1.5">
              <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setViewingCoworker(false)}
                  className={clsx(
                    'flex min-w-0 shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
                    !viewingCoworker ? 'bg-ayu-line/40 font-medium text-ayu-fg' : 'text-ayu-fg/60 hover:bg-ayu-line/20',
                  )}
                >
                  <span className="truncate">{activeSession.title}</span>
                </button>
                {coworkerVisible && activeSession.coworker && (
                  <button
                    type="button"
                    onClick={() => setViewingCoworker(true)}
                    className={clsx(
                      'flex min-w-0 shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
                      viewingCoworker ? 'bg-ayu-line/40 font-medium text-ayu-fg' : 'text-ayu-fg/60 hover:bg-ayu-line/20',
                    )}
                  >
                    <Bot className="h-3 w-3 shrink-0" />
                    <span className="truncate">{activeSession.coworker.name}</span>
                    <span
                      className={clsx(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        coworkerPlayed ? 'bg-ayu-fg/30' : 'bg-ayu-accent animate-pulse',
                      )}
                    />
                  </button>
                )}
                <button
                  type="button"
                  title={t('ensocode.demo.hire')}
                  className="shrink-0 rounded-md p-1 text-ayu-fg/60 hover:bg-ayu-line/20 hover:text-ayu-fg"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="hidden xl:flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-ayu-fg/40 max-w-48 truncate">
                {activeRepo.name} · {activeRepo.branch}
                <span className={clsx('h-1.5 w-1.5 rounded-full', isPlayed ? 'bg-ayu-fg/30' : 'bg-ayu-string animate-pulse')} />
              </span>
            </div>

            {/* Main session view */}
            <div className={clsx('flex-1 flex flex-col min-h-0', viewingCoworker && 'hidden')}>
              <ChatArea
                key={activeSessionId}
                name="EnsoCode"
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

            {/* Coworker view — mounts when dispatched, keeps running in background */}
            {coworkerVisible && activeSession.coworker && (
              <div className={clsx('flex-1 flex flex-col min-h-0', !viewingCoworker && 'hidden')}>
                <ChatArea
                  key={coworkerKey}
                  name={activeSession.coworker.name}
                  model={activeSession.model}
                  script={activeSession.coworker.script}
                  initialStep={coworkerStep}
                  instant={coworkerPlayed}
                  onProgress={(step) => handleProgress(coworkerKey, step)}
                  onComplete={() => handleComplete(coworkerKey)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phone companion (bottom-right overlay) */}
      <PhoneCompanion
        session={activeSession}
        step={currentStep}
        approval={approval}
        onApproval={(v) => handleApproval(activeSessionId, v)}
      />
    </motion.div>
  );
}
