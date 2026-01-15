"use client";

import { ReactNode, useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { publicPost } from '@/lib/public-api';

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
      {title ? (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          {title}
        </h3>
      ) : null}
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
      {title ? (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}

// Newsletter signup widget
interface NewsletterWidgetProps {
  className?: string;
}

export function NewsletterWidget({ className = '' }: NewsletterWidgetProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Merci de renseigner votre adresse e-mail.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');
      const res = await publicPost<{ message: string }>('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(res.message || 'Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.');
      setEmail('');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Impossible d\'envoyer votre inscription. Réessayez.';
      setStatus('error');
      setMessage(msg);
    }
  };

  return (
    <div
      className={`
        rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-xl
        ${className}
      `}
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
        <Mail className="h-3.5 w-3.5" />
        Newsletter
      </div>
      <h3 className="mt-3 text-lg font-semibold">Recevoir nos actualités</h3>
      <p className="mt-2 text-sm text-indigo-100">
        Recevez les annonces officielles et événements.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Votre email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="votre@email.com"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition-colors disabled:opacity-70"
        >
          {status === 'loading' ? (
            'Envoi...'
          ) : (
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" />
              S'inscrire
            </span>
          )}
        </button>
        {message ? (
          <div
            className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
              status === 'success'
                ? 'bg-emerald-500/20 text-emerald-100'
                : 'bg-red-500/20 text-red-100'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4" />
            )}
            <span>{message}</span>
          </div>
        ) : null}
      </form>
    </div>
  );
}
