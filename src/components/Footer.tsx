import { Github, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-ayu-bg border-t border-ayu-line pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="EnsoAI Logo" className="w-6 h-6 rounded shadow-sm" />
              <span className="font-bold text-lg text-ayu-fg">EnsoAI</span>
            </div>
            <p className="text-ayu-fg/60 text-sm max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-ayu-fg mb-4 text-sm uppercase tracking-wider">{t('footer.product')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors block">{t('nav.features')}</a></li>
              <li><a href="#themes" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors block">{t('nav.themes')}</a></li>
              <li><a href="#" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors block">{t('nav.download')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ayu-fg mb-4 text-sm uppercase tracking-wider">{t('footer.community')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="https://github.com/j3n5en/EnsoAI" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</a></li>
              <li><a href="https://t.me/EnsoAI_news" target="_blank" rel="noopener noreferrer" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors flex items-center gap-2"><Send className="w-4 h-4"/> {t('footer.newsChannel')}</a></li>
              <li><a href="https://t.me/EnsoAi_Offical" target="_blank" rel="noopener noreferrer" className="text-ayu-fg/60 hover:text-ayu-accent transition-colors flex items-center gap-2"><Send className="w-4 h-4"/> {t('footer.discussGroup')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ayu-line mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ayu-fg/40">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <p className="text-sm text-ayu-fg/40">
             {t('footer.designed')}
          </p>
        </div>
      </div>
    </footer>
  );
}
