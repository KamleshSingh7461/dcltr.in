import React from 'react';
import { X } from 'lucide-react';

const ACCENT = {
  success: 'bg-ink-950',
  error: 'bg-red-500',
  info: 'bg-ink-950',
  gold: 'bg-ink-950',
};

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm animate-pop-in">
      <div className="relative overflow-hidden rounded-2xl p-4 pl-5 shadow-pop-lg flex items-start gap-3 border-[1.5px] border-ink-950 bg-white">
        <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${ACCENT[toast.type] || ACCENT.info}`} />
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-ink-950 text-sm">{toast.title}</div>
          <div className="text-ink-500 text-xs mt-0.5 leading-relaxed">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 w-6 h-6 rounded-full bg-ink-50 text-ink-400 hover:text-ink-900 hover:bg-ink-100 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
