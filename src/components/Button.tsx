import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ayu-accent/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'bg-ayu-accent text-white hover:bg-ayu-accent/90 shadow-sm': variant === 'primary',
            'bg-white text-ayu-fg border border-ayu-line hover:bg-gray-50 shadow-sm': variant === 'secondary',
            'bg-transparent hover:bg-black/5 text-ayu-fg': variant === 'ghost',
            'border border-ayu-line bg-transparent hover:bg-black/5': variant === 'outline',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
