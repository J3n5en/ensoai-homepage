import { useEffect, useState } from 'react';
import { Plus, X, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Static terminal simulation data
const terminalHistory = [
  { type: 'input', content: 'cd ~/ensoai/workspaces/awesome-app/main', delay: 0 },
  { type: 'input', content: 'npm install', delay: 800 },
  { type: 'output', content: 'added 1423 packages in 12s', delay: 2000 },
  { type: 'input', content: 'npm run dev', delay: 2800 },
  { type: 'output', content: '', delay: 3500 },
  { type: 'output', content: 'VITE v6.0.5  ready in 234 ms', delay: 3600 },
  { type: 'output', content: '', delay: 3700 },
  { type: 'output', content: '➜  Local:   http://localhost:5173/', delay: 3800 },
  { type: 'output', content: '➜  Network: http://192.168.1.100:5173/', delay: 3900 },
];

interface WebContainerTerminalProps {
  workspacePath?: string;
  worktreeKey: string;
  hasPlayed: boolean;
  onComplete: () => void;
}

export function WebContainerTerminal({
  workspacePath,
  worktreeKey,
  hasPlayed,
  onComplete
}: WebContainerTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<typeof terminalHistory>(
    hasPlayed ? terminalHistory : []
  );

  useEffect(() => {
    if (hasPlayed) {
      setVisibleLines(terminalHistory);
      return;
    }

    setVisibleLines([]);

    const timers: ReturnType<typeof setTimeout>[] = [];

    terminalHistory.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        if (index === terminalHistory.length - 1) {
          onComplete();
        }
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [worktreeKey, hasPlayed, onComplete]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1a1a2e] text-gray-300">
      {/* Terminal tabs */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-700 bg-[#252536]">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a2e] rounded text-xs border border-gray-700">
          <TerminalIcon className="w-3 h-3 text-green-400" />
          <span>zsh</span>
          <X className="w-3 h-3 text-gray-500 hover:text-gray-300 cursor-pointer" />
        </div>
        <button className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal content */}
      <div className="flex-1 p-4 font-mono text-xs overflow-auto">
        {visibleLines.map((line, i) => (
          <div key={i} className={`${line.type === 'input' ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
            {line.type === 'input' && <span className="text-green-400 mr-2">❯</span>}
            {line.content}
          </div>
        ))}
        <div className="flex items-center mt-2">
          <span className="text-green-400 mr-2">❯</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-gray-400"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-gray-700 bg-[#252536] text-[10px] text-gray-500 flex items-center gap-4">
        <span>{workspacePath}</span>
        <span className="text-green-400">zsh</span>
        <span className="ml-auto">UTF-8</span>
      </div>
    </div>
  );
}
