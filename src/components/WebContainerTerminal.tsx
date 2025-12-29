import { useEffect, useRef, useState, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Plus, X, Terminal as TerminalIcon, ExternalLink, Globe } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';

// WebContainer singleton - boot() can only be called once
let webcontainerPromise: Promise<WebContainer> | undefined;
let webcontainerInstance: WebContainer | undefined;
let filesMounted = false;
let serverReadyListeners: Set<(port: number, url: string) => void> = new Set();

async function getWebContainerInstance(): Promise<WebContainer> {
  if (!webcontainerPromise) {
    webcontainerPromise = WebContainer.boot();
    webcontainerInstance = await webcontainerPromise;

    // Mount Vite React-TS template
    if (!filesMounted) {
      await webcontainerInstance.mount({
        'package.json': {
          file: {
            contents: JSON.stringify(
              {
                name: 'enso-demo',
                private: true,
                version: '0.0.0',
                type: 'module',
                scripts: {
                  dev: 'vite',
                  build: 'tsc -b && vite build',
                  preview: 'vite preview',
                },
                dependencies: {
                  react: '^19.0.0',
                  'react-dom': '^19.0.0',
                },
                devDependencies: {
                  '@types/react': '^19.0.0',
                  '@types/react-dom': '^19.0.0',
                  '@vitejs/plugin-react': '^4.3.4',
                  typescript: '~5.7.2',
                  vite: '^6.0.5',
                },
              },
              null,
              2
            ),
          },
        },
        'tsconfig.json': {
          file: {
            contents: JSON.stringify(
              {
                compilerOptions: {
                  target: 'ES2020',
                  useDefineForClassFields: true,
                  lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                  module: 'ESNext',
                  skipLibCheck: true,
                  moduleResolution: 'bundler',
                  allowImportingTsExtensions: true,
                  isolatedModules: true,
                  moduleDetection: 'force',
                  noEmit: true,
                  jsx: 'react-jsx',
                  strict: true,
                  noUnusedLocals: true,
                  noUnusedParameters: true,
                  noFallthroughCasesInSwitch: true,
                  noUncheckedSideEffectImports: true,
                },
                include: ['src'],
              },
              null,
              2
            ),
          },
        },
        'vite.config.ts': {
          file: {
            contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`,
          },
        },
        'index.html': {
          file: {
            contents: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EnsoAI Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
          },
        },
        src: {
          directory: {
            'main.tsx': {
              file: {
                contents: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
              },
            },
            'App.tsx': {
              file: {
                contents: `import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>EnsoAI Demo</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="hint">
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App
`,
              },
            },
            'index.css': {
              file: {
                contents: `:root {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #ffffffde;
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.app h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.hint {
  color: #888;
}

code {
  background: #1a1a1a;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
`,
              },
            },
            'vite-env.d.ts': {
              file: {
                contents: `/// <reference types="vite/client" />
`,
              },
            },
          },
        },
      });
      filesMounted = true;
    }

    // Listen for server-ready event
    webcontainerInstance.on('server-ready', (port, url) => {
      serverReadyListeners.forEach((listener) => listener(port, url));
    });
  }
  return webcontainerPromise;
}

function addServerReadyListener(listener: (port: number, url: string) => void) {
  serverReadyListeners.add(listener);
  return () => {
    serverReadyListeners.delete(listener);
  };
}

interface TerminalTab {
  id: string;
  name: string;
}

interface TerminalInstance {
  terminal: Terminal;
  fitAddon: FitAddon;
  cleanup?: () => void;
}

interface WebContainerTerminalProps {
  workspacePath?: string;
}

export function WebContainerTerminal({ workspacePath }: WebContainerTerminalProps) {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: '1', name: 'zsh' }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [serverInfo, setServerInfo] = useState<{ port: number; url: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const terminalInstances = useRef<Map<string, TerminalInstance>>(new Map());
  const nextIdRef = useRef(2);

  // Listen for server-ready events
  useEffect(() => {
    const unsubscribe = addServerReadyListener((port, url) => {
      setServerInfo({ port, url });
    });
    return unsubscribe;
  }, []);

  const createTerminalConfig = useCallback(() => ({
    convertEol: true,
    theme: {
      background: '#1a1a2e',
      foreground: '#d1d5db',
      cursor: '#e6b450',
      cursorAccent: '#1a1a2e',
      selectionBackground: 'rgba(255, 255, 255, 0.3)',
      black: '#1a1a2e',
      red: '#f07178',
      green: '#c3e88d',
      yellow: '#ffcb6b',
      blue: '#82aaff',
      magenta: '#c792ea',
      cyan: '#89ddff',
      white: '#d1d5db',
      brightBlack: '#676e95',
      brightRed: '#ff8b92',
      brightGreen: '#ddffa7',
      brightYellow: '#ffe585',
      brightBlue: '#9cc4ff',
      brightMagenta: '#e1acff',
      brightCyan: '#a3f7ff',
      brightWhite: '#ffffff',
    },
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 12,
    lineHeight: 1.2,
    cursorBlink: true,
    cursorStyle: 'block' as const,
  }), []);

  const initTerminal = useCallback(async (tabId: string, container: HTMLDivElement) => {
    if (terminalInstances.current.has(tabId)) return;

    const term = new Terminal(createTerminalConfig());
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();

    const instance: TerminalInstance = { terminal: term, fitAddon };
    terminalInstances.current.set(tabId, instance);

    try {
      const webcontainer = await getWebContainerInstance();
      const shellProcess = await webcontainer.spawn('jsh', {
        terminal: { cols: term.cols, rows: term.rows },
      });

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            term.write(data);
          },
        })
      );

      const input = shellProcess.input.getWriter();
      term.onData((data) => {
        input.write(data);
      });

      const resizeHandler = () => {
        fitAddon.fit();
        shellProcess.resize({ cols: term.cols, rows: term.rows });
      };

      window.addEventListener('resize', resizeHandler);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
        shellProcess.resize({ cols: term.cols, rows: term.rows });
      });
      resizeObserver.observe(container);

      instance.cleanup = () => {
        window.removeEventListener('resize', resizeHandler);
        resizeObserver.disconnect();
      };
    } catch (e) {
      term.write(`\r\n\x1b[31m[Error] ${e}\x1b[0m\r\n`);
      term.write('\x1b[33m[Hint] WebContainers require secure context (HTTPS or localhost)\x1b[0m\r\n');
    }
  }, [createTerminalConfig]);

  const setContainerRef = useCallback((tabId: string, el: HTMLDivElement | null) => {
    if (el) {
      containerRefs.current.set(tabId, el);
      initTerminal(tabId, el);
    }
  }, [initTerminal]);

  const addTab = useCallback(() => {
    const newId = String(nextIdRef.current++);
    setTabs(prev => [...prev, { id: newId, name: 'zsh' }]);
    setActiveTabId(newId);
  }, []);

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const instance = terminalInstances.current.get(tabId);
    if (instance) {
      instance.cleanup?.();
      instance.terminal.dispose();
      terminalInstances.current.delete(tabId);
    }
    containerRefs.current.delete(tabId);

    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      if (newTabs.length === 0) {
        const newId = String(nextIdRef.current++);
        setActiveTabId(newId);
        return [{ id: newId, name: 'zsh' }];
      }
      if (tabId === activeTabId) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  // Fit terminal when tab becomes active
  useEffect(() => {
    const instance = terminalInstances.current.get(activeTabId);
    if (instance) {
      setTimeout(() => {
        instance.fitAddon.fit();
        instance.terminal.focus();
      }, 0);
    }
  }, [activeTabId]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1a1a2e] text-gray-300">
      {/* Terminal tabs */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-700 bg-[#252536]">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
              activeTabId === tab.id
                ? 'bg-[#1a1a2e] border border-gray-700'
                : 'hover:bg-gray-700/50 border border-transparent'
            }`}
          >
            <TerminalIcon className="w-3 h-3 text-green-400" />
            <span>{tab.name}</span>
            <X
              className="w-3 h-3 text-gray-500 hover:text-gray-300"
              onClick={(e) => closeTab(tab.id, e)}
            />
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Terminal content */}
        <div className={`relative overflow-hidden ${showPreview && serverInfo ? 'w-1/2' : 'w-full'}`}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              ref={(el) => setContainerRef(tab.id, el)}
              className={`absolute inset-0 ${activeTabId === tab.id ? 'visible' : 'invisible'}`}
            />
          ))}
        </div>

        {/* Preview iframe */}
        {showPreview && serverInfo && (
          <div className="w-1/2 border-l border-gray-700 flex flex-col">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-700 bg-[#252536] text-xs">
              <Globe className="w-3 h-3 text-blue-400" />
              <span className="text-gray-400 truncate flex-1">{serverInfo.url}</span>
              <a
                href={serverInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <iframe
              src={serverInfo.url}
              className="flex-1 w-full bg-white"
              title="Preview"
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-gray-700 bg-[#252536] text-[10px] text-gray-500 flex items-center gap-4">
        <span>{workspacePath}</span>
        <span className="text-green-400">zsh</span>
        {serverInfo && (
          <>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>:{serverInfo.port}</span>
            </button>
            <a
              href={serverInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </>
        )}
        <span className="ml-auto">UTF-8</span>
      </div>
    </div>
  );
}
