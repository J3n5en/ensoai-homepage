import { Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { products, type ProductId } from '../products';

interface NavbarProps {
  product: ProductId;
  onProductChange: (product: ProductId) => void;
}

export function Navbar({ product, onProductChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const active = products[product];

  const switcher = (
    <div className="flex items-center gap-1 p-1 rounded-full bg-ayu-panel border border-ayu-line">
      {Object.values(products).map((p) => (
        <button
          key={p.id}
          onClick={() => onProductChange(p.id)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
            product === p.id
              ? "bg-ayu-accent text-white shadow-sm"
              : "text-ayu-fg/60 hover:text-ayu-fg"
          )}
        >
          <img src={p.logo} alt={p.name} className="w-4 h-4 rounded" />
          {p.name}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ayu-bg/90 backdrop-blur-md border-b border-ayu-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src={active.logo} alt={`${active.name} Logo`} className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-ayu-fg">{active.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {switcher}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="gap-2 text-ayu-fg/70" onClick={() => window.open(active.githubUrl, '_blank')}>
              <Github className="w-4 h-4" />
              <span>{t('nav.star')}</span>
            </Button>
            <Button
              size="sm"
              className="rounded-full px-5"
              onClick={() => window.open(active.downloadUrl, '_blank')}
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
              <div className="flex justify-center">{switcher}</div>
              <div className="pt-2 flex flex-col gap-2">
                 <Button className="w-full justify-center" onClick={() => window.open(active.downloadUrl, '_blank')}>{t('nav.download')}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
