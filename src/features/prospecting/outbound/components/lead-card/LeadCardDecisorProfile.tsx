import type React from 'react';
import { Linkedin, Phone, Mail } from 'lucide-react';

interface LeadCardDecisorProfileProps {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
}

export function LeadCardDecisorProfile({
  name,
  title,
  email,
  phone,
  linkedinUrl,
}: LeadCardDecisorProfileProps): React.ReactElement {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="py-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs shrink-0">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {name || 'Decisor não identificado'}
          </span>
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-500 transition-colors"
              aria-label="Perfil no LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-white/60 truncate">
          {title || 'Cargo não especificado'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/40">
        {phone && <Phone className="w-3.5 h-3.5 text-emerald-500" title={phone} />}
        {email && <Mail className="w-3.5 h-3.5 text-blue-500" title={email} />}
      </div>
    </div>
  );
}
