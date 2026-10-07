import { motion } from 'framer-motion';
import { ArrowLeft, Bell, LogOut, Menu, Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext.js';
import { notificationsApi } from '../../features/notifications/notifications.api.js';
import { useLiveClock } from '../../hooks/useLiveClock.js';
import { OPEN_COMMAND_PALETTE_EVENT } from '../../lib/paletteIntent.js';
import { SoundFX } from '../../lib/soundEffects.js';
import { TAB_META, type TabType } from './tabMeta.js';

interface AppTopbarProps {
  activeTab: TabType;
  /** Abre a Sidebar off-canvas em telas < md. */
  onOpenMobileNav?: () => void;
}

export function AppTopbar({ activeTab, onOpenMobileNav }: AppTopbarProps) {
  const now = useLiveClock();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/app' || location.pathname === '/app/dashboard';
  const handleBack = () => {
    SoundFX.play('navigate');
    if (location.key !== 'default') navigate(-1);
    else navigate('/app');
  };
  const meta = TAB_META[activeTab] ?? TAB_META.dashboard;
  const Icon = meta.icon;
  const [soundEnabled, setSoundEnabled] = useState(() => SoundFX.isEnabled());

  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const loadUnread = async () => {
      try {
        const { unread } = await notificationsApi.list(true);
        if (!cancelled) setUnreadCount(unread);
      } catch {
        if (!cancelled) setUnreadCount(0);
      }
    };
    void loadUnread();
    window.addEventListener('focus', loadUnread);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadUnread);
    };
  }, []);

  const dateLabel = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
  const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const userInitial = currentUser?.name?.charAt(0).toUpperCase() || 'U';

  const toggleSound = () => {
    const next = !soundEnabled;
    SoundFX.setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <header className="relative sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-4 bg-[#15151A] px-4 sm:px-8 border-b border-white/5">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        aria-label="Abrir menu de navegação"
      >
        <Menu className="h-5 w-5" />
      </button>

      {!isHome && (
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Voltar"
          title="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {/* Global Search Bar */}
      <button
        type="button"
        onClick={() => {
          SoundFX.play('focus');
          window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT));
        }}
        className="group hidden max-w-lg flex-1 items-center gap-3 rounded-xl bg-[#1C1D24] px-4 py-2.5 text-slate-400 transition-all hover:bg-[#22232B] lg:flex ml-2"
      >
        <Search className="h-4 w-4 shrink-0 transition-colors group-hover:text-white" />
        <span className="text-sm">Search here...</span>
        <kbd className="ml-auto rounded-lg border border-white/10 bg-[#13151A] px-2 py-1 text-[10px] font-semibold text-slate-400 shadow-sm transition-colors group-hover:border-white/20">
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            SoundFX.play('navigate');
            navigate('/app/notifications');
          }}
          className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={
            unreadCount > 0
              ? `Notificações — ${unreadCount} não lida${unreadCount === 1 ? '' : 's'}`
              : 'Notificações'
          }
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EF4444] shadow-[0_0_0_2px_#15151A]"
              aria-hidden="true"
            />
          )}
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          role="img"
          aria-label={`Avatar de ${currentUser?.name || 'Usuário'}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7DFF] to-[#6D5CE6] text-sm font-bold text-white shadow-md ring-2 ring-white/10 cursor-pointer overflow-hidden"
          title={`${currentUser?.name || 'Usuário'} (${currentUser?.roleTitle || currentUser?.role || ''})`}
        >
          {currentUser?.avatarUrl ? (
             <img src={currentUser.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
             userInitial
          )}
        </motion.div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:text-slate-300 ml-1"
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </motion.button>
      </div>
    </header>
  );
}
