import { Button } from './Button';
import { Github, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { EnsoAIDemoPreview } from './EnsoAIDemoPreview';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-40 pb-20 overflow-hidden bg-grid-pattern [background-size:24px_24px]">
      <div className="absolute inset-0 bg-gradient-to-b from-ayu-bg/80 via-ayu-bg/50 to-ayu-bg/80 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ayu-panel border border-ayu-line shadow-sm text-sm font-medium text-ayu-fg/80 mb-8 hover:border-ayu-accent/50 transition-colors cursor-default"
          >
            <span className="w-2 h-2 rounded-full bg-ayu-accent"></span>
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-ayu-fg mb-8 leading-[1.1]"
          >
            {t('hero.title')} <br className="hidden md:block"/>
            <span className="text-ayu-accent relative inline-block">
              {t('hero.titleHighlight')}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-ayu-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-ayu-fg/60 mb-10 leading-relaxed max-w-2xl mx-auto font-light"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-ayu-accent/10 hover:shadow-ayu-accent/20 hover:-translate-y-0.5 transition-all"
              onClick={() => window.open('https://github.com/j3n5en/EnsoAI/releases/latest', '_blank')}
            >
              {t('hero.cta.download')}
              <Download className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-base font-semibold bg-ayu-panel hover:bg-ayu-line/50 hover:-translate-y-0.5 transition-all"
              onClick={() => window.open('https://github.com/j3n5en/EnsoAI', '_blank')}
            >
              {t('hero.cta.manifest')}
              <Github className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Demo Preview - Hidden on mobile */}
        <div className="hidden lg:block relative">
          <EnsoAIDemoPreview />
        </div>
      </div>
    </section>
  );
}
