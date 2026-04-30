import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { clsx } from 'clsx';

const PRO_CHECKOUT_URL = 'https://creem.io/product/prod_6kIGaQylTX7M3T01AJFLiO';
const LIFETIME_CHECKOUT_URL = 'https://creem.io/product/prod_6EniSRRzLFbeCagNyao0ax';

export function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      price: t('pricing.plans.free.price'),
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.desc'),
      cta: t('pricing.plans.free.cta'),
      ctaUrl: 'https://github.com/j3n5en/EnsoAI/releases/latest',
      features: [
        t('pricing.plans.free.features.0'),
        t('pricing.plans.free.features.1'),
        t('pricing.plans.free.features.2'),
        t('pricing.plans.free.features.3'),
      ],
      highlighted: false,
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      price: '$12',
      period: t('pricing.plans.pro.period'),
      description: t('pricing.plans.pro.desc'),
      cta: t('pricing.plans.pro.cta'),
      ctaUrl: PRO_CHECKOUT_URL,
      features: [
        t('pricing.plans.pro.features.0'),
        t('pricing.plans.pro.features.1'),
        t('pricing.plans.pro.features.2'),
        t('pricing.plans.pro.features.3'),
        t('pricing.plans.pro.features.4'),
      ],
      highlighted: true,
    },
    {
      id: 'lifetime',
      name: t('pricing.plans.lifetime.name'),
      price: '$99',
      period: t('pricing.plans.lifetime.period'),
      description: t('pricing.plans.lifetime.desc'),
      cta: t('pricing.plans.lifetime.cta'),
      ctaUrl: LIFETIME_CHECKOUT_URL,
      features: [
        t('pricing.plans.lifetime.features.0'),
        t('pricing.plans.lifetime.features.1'),
        t('pricing.plans.lifetime.features.2'),
        t('pricing.plans.lifetime.features.3'),
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-ayu-bg border-t border-ayu-line transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ayu-fg tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 text-ayu-fg/70 text-lg leading-relaxed font-light">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={clsx(
                'relative rounded-2xl border p-8 flex flex-col bg-ayu-panel transition-all duration-300',
                plan.highlighted
                  ? 'border-ayu-accent shadow-lg md:scale-[1.02]'
                  : 'border-ayu-line hover:border-ayu-accent/40',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full bg-ayu-accent text-white shadow">
                  {t('pricing.popular')}
                </span>
              )}

              <h3 className="text-xl font-semibold text-ayu-fg">{plan.name}</h3>
              <p className="mt-2 text-sm text-ayu-fg/60 min-h-[2.5rem]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-ayu-fg tracking-tight">
                  {plan.price}
                </span>
                <span className="text-ayu-fg/60 text-sm">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ayu-fg/80">
                    <Check className="w-4 h-4 text-ayu-accent flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="md"
                variant={plan.highlighted ? 'primary' : 'ghost'}
                className={clsx(
                  'mt-8 w-full justify-center rounded-full',
                  !plan.highlighted && 'border border-ayu-line',
                )}
                onClick={() => window.open(plan.ctaUrl, '_blank')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ayu-fg/50">
          {t('pricing.note')}
        </p>
      </div>
    </section>
  );
}
