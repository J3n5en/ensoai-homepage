import { Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ayu-bg/90 backdrop-blur-md border-b border-ayu-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EnsoAI Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-ayu-fg">EnsoAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="gap-2 text-ayu-fg/70" onClick={() => window.open('https://github.com/j3n5en/EnsoAI', '_blank')}>
              <Github className="w-4 h-4" />
              <span>{t('nav.star')}</span>
            </Button>
            <Button 
              size="sm" 
              className="rounded-full px-5"
              onClick={() => window.open('https://github.com/j3n5en/EnsoAI/releases/latest', '_blank')}
            >
              {t('nav.download')}
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-ayu-fg hover:text-ayu-accent">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-ayu-line bg-ayu-bg"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="pt-2 flex flex-col gap-2">
                 <Button className="w-full justify-center" onClick={() => window.open('https://github.com/j3n5en/EnsoAI/releases/latest', '_blank')}>{t('nav.download')}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}