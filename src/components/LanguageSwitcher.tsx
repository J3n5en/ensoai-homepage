import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from './Button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh-CN';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="gap-2 text-ayu-fg/60 hover:text-ayu-accent"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-medium uppercase">
        {i18n.language.startsWith('zh') ? 'EN' : '中文'}
      </span>
    </Button>
  );
}
