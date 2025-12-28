import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

const themes: Record<string, React.CSSProperties> = {
  'Ayu Light': {
    '--ayu-bg': '#f8f9fa',
    '--ayu-fg': '#5c6166',
    '--ayu-accent': '#399ee6',
    '--ayu-line': '#f0f0f0',
    '--ayu-panel': '#ffffff',
    '--ayu-selection': '#035bd6',
    '--ayu-func': '#eca944',
    '--ayu-string': '#86b300',
    '--ayu-regexp': '#4cbf99',
    '--ayu-constant': '#a37acc',
    '--ayu-tag': '#399ee6',
    '--ayu-comment': '#bababa',
  } as React.CSSProperties,
  'Ayu Dark': {
    '--ayu-bg': '#0b1416',
    '--ayu-fg': '#e6e1cf',
    '--ayu-accent': '#39bae6',
    '--ayu-line': '#14191f',
    '--ayu-panel': '#0b1416',
    '--ayu-selection': '#253340',
    '--ayu-func': '#ffb454',
    '--ayu-string': '#c2d94c',
    '--ayu-regexp': '#95e6cb',
    '--ayu-constant': '#d2a6ff',
    '--ayu-tag': '#39bae6',
    '--ayu-comment': '#5c6773',
  } as React.CSSProperties,
  'Ayu Mirage': {
    '--ayu-bg': '#1f2430',
    '--ayu-fg': '#cbccc6',
    '--ayu-accent': '#5ccfe6',
    '--ayu-line': '#191e2a',
    '--ayu-panel': '#1f2430',
    '--ayu-selection': '#34455a',
    '--ayu-func': '#ffd580',
    '--ayu-string': '#bae67e',
    '--ayu-regexp': '#95e6cb',
    '--ayu-constant': '#d4bfff',
    '--ayu-tag': '#5ccfe6',
    '--ayu-comment': '#5c6773',
  } as React.CSSProperties,
  'Dracula': {
    '--ayu-bg': '#282a36',
    '--ayu-fg': '#f8f8f2',
    '--ayu-accent': '#bd93f9',
    '--ayu-line': '#44475a',
    '--ayu-panel': '#282a36',
    '--ayu-selection': '#44475a',
    '--ayu-func': '#50fa7b',
    '--ayu-string': '#f1fa8c',
    '--ayu-regexp': '#ffb86c',
    '--ayu-constant': '#bd93f9',
    '--ayu-tag': '#ff79c6',
    '--ayu-comment': '#6272a4',
  } as React.CSSProperties,
  'Nord': {
    '--ayu-bg': '#2e3440',
    '--ayu-fg': '#d8dee9',
    '--ayu-accent': '#88c0d0',
    '--ayu-line': '#3b4252',
    '--ayu-panel': '#2e3440',
    '--ayu-selection': '#434c5e',
    '--ayu-func': '#88c0d0',
    '--ayu-string': '#a3be8c',
    '--ayu-regexp': '#ebcb8b',
    '--ayu-constant': '#b48ead',
    '--ayu-tag': '#81a1c1',
    '--ayu-comment': '#4c566a',
  } as React.CSSProperties
};

function App() {
  const { t } = useTranslation();
  const [currentTheme, setCurrentTheme] = useState('Ayu Light');

  useEffect(() => {
    const themeVars = themes[currentTheme];
    if (themeVars) {
      const root = document.documentElement;
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value as string);
      });
    }
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-ayu-bg text-ayu-fg selection:bg-ayu-selection selection:text-ayu-selection-text font-sans antialiased transition-colors duration-300">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        
        {/* Themes Section - Refactored for cleaner look */}
        <section id="themes" className="py-24 bg-ayu-bg border-t border-ayu-line transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-ayu-panel rounded-2xl border border-ayu-line p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 transition-colors duration-300">
                    <div className="flex-1 space-y-6 relative z-40 bg-ayu-panel transition-colors duration-300">
                        <h2 className="text-3xl font-bold text-ayu-fg tracking-tight">{t('themes.title')}</h2>
                        <p className="text-ayu-fg/70 text-lg leading-relaxed font-light">
                            {t('themes.desc')}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {Object.keys(themes).map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => {
                                        setCurrentTheme(theme);
                                        document.getElementById('demo-preview')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                    }}
                                    className={clsx(
                                        "px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-300 cursor-pointer",
                                        currentTheme === theme 
                                            ? "bg-ayu-accent text-white border-ayu-accent shadow-md scale-105" 
                                            : "border-ayu-line bg-ayu-bg text-ayu-fg/80 hover:border-ayu-accent/50 hover:bg-ayu-bg/80"
                                    )}
                                >
                                    {theme}
                                </button>
                            ))}
                            <span className="px-4 py-1.5 text-sm font-medium rounded-full border border-dashed border-ayu-accent/30 bg-ayu-accent/5 text-ayu-accent/60 cursor-default flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-ayu-accent animate-pulse" />
                                {t('themes.more')}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-1 relative h-64 w-full items-center justify-center">
                        {/* Abstract cards - spread layout (desktop only) */}
                        <div className="absolute w-56 h-36 bg-[#0F1419] rounded-lg shadow-xl -rotate-6 z-10 border border-white/10 -translate-x-16 hover:z-50 hover:scale-105 transition-all duration-300"></div>
                        <div className="absolute w-56 h-36 bg-[#FAFAFA] rounded-lg shadow-xl rotate-3 z-20 border border-black/5 hover:z-50 hover:scale-105 transition-all duration-300"></div>
                        <div className="absolute w-56 h-36 bg-[#1F2430] rounded-lg shadow-xl -rotate-3 z-30 border border-white/10 translate-x-16 translate-y-6 hover:z-50 hover:scale-105 transition-all duration-300"></div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;