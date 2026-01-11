import { ReactNode } from 'react';

interface SidebarRightProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

export default function SidebarRight({ children, className = '', sticky = true }: SidebarRightProps) {
  return (
    <aside
      className={`
        w-full lg:w-[300px] lg:flex-shrink-0
        space-y-6
        ${sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}
        ${className}
      `}
    >
      {children}
    </aside>
  );
}

// Announcement widget for sidebar
interface AnnouncementWidgetProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight';
}

export function AnnouncementWidget({ 
  title = 'Annonces', 
  children, 
  className = '',
  variant = 'default'
}: AnnouncementWidgetProps) {
  const variantStyles = {
    default: 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900',
    highlight: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/50',
  };

  return (
    <div
      className={`
        rounded-2xl border p-5 shadow-sm
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// Events widget for sidebar
interface EventsWidgetProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function EventsWidget({ 
  title = 'Événements à venir', 
  children, 
  className = '' 
}: EventsWidgetProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm
        dark:border-slate-800 dark:bg-slate-900
        ${className}
      `}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// Newsletter signup widget
interface NewsletterWidgetProps {
  className?: string;
}

export function NewsletterWidget({ className = '' }: NewsletterWidgetProps) {
  return (
    <div
      className={`
        rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-xl
        ${className}
      `}
    >
      <h3 className="text-lg font-semibold">Recevoir nos actualités</h3>
      <p className="mt-2 text-sm text-indigo-100">
        Inscrivez-vous pour suivre les annonces officielles et événements.
      </p>
      <form className="mt-4 flex flex-col gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Votre email
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="votre@email.com"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition-colors"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
