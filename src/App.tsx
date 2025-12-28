import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-ayu-bg text-ayu-fg selection:bg-ayu-selection selection:text-ayu-selection-text font-sans antialiased">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        
        {/* Themes Section - Refactored for cleaner look */}
        <section id="themes" className="py-24 bg-ayu-bg border-t border-ayu-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-ayu-line p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 overflow-hidden">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold text-ayu-fg tracking-tight">{t('themes.title')}</h2>
                        <p className="text-ayu-fg/70 text-lg leading-relaxed font-light">
                            {t('themes.desc')}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {['Ayu Light', 'Ayu Dark', 'Ayu Mirage', 'Dracula', 'Nord'].map(theme => (
                                <span key={theme} className="px-4 py-1.5 text-sm font-medium rounded-full border border-ayu-line bg-ayu-bg text-ayu-fg/80 hover:border-ayu-accent/50 transition-colors cursor-default">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative h-64 w-full flex items-center justify-center perspective-1000">
                        {/* Abstract cards - flattened and cleaner */}
                        <div className="absolute w-56 h-36 bg-[#0F1419] rounded-lg shadow-xl -rotate-6 z-10 border border-white/10 top-8 left-8 hover:z-50 hover:scale-105 transition-all duration-300"></div>
                        <div className="absolute w-56 h-36 bg-[#FAFAFA] rounded-lg shadow-xl rotate-3 z-20 border border-black/5 top-14 left-20 hover:z-50 hover:scale-105 transition-all duration-300"></div>
                        <div className="absolute w-56 h-36 bg-[#1F2430] rounded-lg shadow-xl -rotate-3 z-30 border border-white/10 top-6 right-10 hover:z-50 hover:scale-105 transition-all duration-300"></div>
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