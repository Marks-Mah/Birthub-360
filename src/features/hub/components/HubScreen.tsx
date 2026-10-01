
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../../components/ui/index.js';
import { Bot, CheckCircle, Clock, Zap } from 'lucide-react';
import { HubBurstCanvas } from './HubBurstCanvas.js';

export function HubScreen() {
  return (
    <div
      className="relative h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between select-none text-white"
      style={{
        background: 'linear-gradient(160deg, #0b132b 0%, #0f1d3d 45%, #0b132b 100%)',
      }}
    >
      {/* Command Center Background Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Gold Glow — top-left authority */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: '480px',
          height: '480px',
          top: '-120px',
          left: '-80px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Ambient Blue Glow — bottom-right intelligence */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: '400px',
          height: '400px',
          bottom: '-80px',
          right: '-60px',
          background: 'radial-gradient(circle, rgba(22,119,255,0.06) 0%, transparent 70%)',
        }}
      />

      <HubBurstCanvas ref={burstRef} />

      <div className="relative z-10 flex flex-col h-full w-full justify-between overflow-hidden">
        {/* Topbar Birth Hub 360° */}
        <header className="flex items-center gap-3 px-6 pt-3 pb-1.5 shrink-0 border-b border-white/8">
          <BirthHubLogo variant="horizontal" className="h-7 text-white" />

          <div className="ml-auto hidden items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-white/70 backdrop-blur-md sm:flex shadow-xs">
            <span className="hub-beacon h-2 w-2 rounded-full bg-brand" />
            {brandInfo.name} &middot; {brandInfo.ecosystemLabel}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </div>

          <button
            type="button"
            onClick={() => {
              const next = SoundFX.toggleMute();
              setSoundOn(next);
              if (next) SoundFX.play('focus');
            }}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/50 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/80"
            aria-label={soundOn ? 'Desativar som de interação' : 'Ativar som de interação'}
            title={soundOn ? 'Desativar som de interação' : 'Ativar som de interação'}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              SoundFX.play('focus');
              toggleTheme();
            }}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/50 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/80"
            aria-label="Alternar tema"
            title={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {currentUser && (
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 py-0.5 pl-1 pr-3 backdrop-blur-md">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-on-brand">
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden text-xs font-semibold text-white/80 sm:inline">
                {currentUser.name}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/80 text-critical backdrop-blur-md transition-colors hover:bg-critical/10 shadow-xs"
            aria-label="Encerrar sessão"
            title="Encerrar sessão e sair da conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        {/* Hero Section & Widgets */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2 shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              Birth Hub 360° &middot; Central Executiva
            </div>
            <h1 className="mt-0.5 font-display text-xl sm:text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-white">
              {clock.greeting}, <span className="text-brand font-bold">{firstName}</span>
            </h1>
            <p className="mt-0.5 text-xs font-normal text-white/45">{brandInfo.slogan}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center rounded-full bg-white/8 p-0.5 border border-white/12 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('orbit')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  viewMode === 'orbit'
                    ? 'bg-brand text-on-brand shadow-xs'
                    : 'text-white/50 hover:text-white/80'
                }`}
                title="Visualização em Órbita 360°"
              >
                <CircleDot className="h-3.5 w-3.5" />
                Órbita 360°
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cockpit')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  viewMode === 'cockpit'
                    ? 'bg-brand text-on-brand shadow-xs'
                    : 'text-white/50 hover:text-white/80'
                }`}
                title="Visualização em Cockpit Executivo"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Cockpit
              </button>
            </div>

            <div className="hidden items-stretch gap-2 lg:flex">
              <div
                className="hub-widget flex min-w-[105px] flex-col items-center justify-center px-3 py-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: '18px',
                }}
              >
                <span className="font-mono text-lg font-bold tabular-nums text-brand leading-none">
                  {clock.time}
                </span>
                <span className="text-[9px] font-semibold capitalize text-white/45 mt-0.5">
                  {clock.dateLabel}
                </span>
              </div>

              <div
                className="w-[150px] px-2 py-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: '18px',
                }}
              >
                <p className="mb-0.5 text-center text-[8.5px] font-bold uppercase tracking-wider text-brand/80">
                  {clock.monthLabel}
                </p>
                <div className="grid grid-cols-7 gap-0.5">
                  {WEEKDAYS_SHORT.map((d, i) => (
                    <span
                      key={`wd-${i}`}
                      className="text-center text-[7.5px] font-bold text-white/30"
                    >
                      {d}
                    </span>
                  ))}
                  {calendarCells.map((cell, i) =>
                    cell ? (
                      <span
                        key={cell.day}
                        className={
                          cell.isToday
                            ? 'grid place-items-center rounded bg-brand py-0.2 text-[8.5px] font-black text-on-brand shadow-glow-brand'
                            : 'grid place-items-center rounded py-0.2 text-[8.5px] font-semibold text-white/40'
                        }
                      >
                        {cell.day}
                      </span>
                    ) : (
                      <span key={`empty-${i}`} />
                    ),
                  )}
                </div>
              </div>

              <HubTaskWidget />
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="mx-auto flex w-full max-w-[1250px] items-center gap-2.5 px-6 py-0.5 shrink-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            Da prospecção ao contrato — Ecossistema de Inteligência Comercial{' '}
            <span className="inline-flex items-center gap-1 font-bold text-white/55">
              <BirthHubLogo variant="symbol" className="h-3.5 w-auto text-brand" />
              BIRTH HUB 360°
            </span>
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
        </div>

        <main className="flex-1 min-h-0 w-full relative flex items-center justify-center overflow-hidden px-4">
          {!isLoading && grantedCatalog.length === 0 && (
            <p className="absolute top-1 left-6 text-[11px] text-white/40 z-20 pointer-events-none">
              Nenhum módulo executivo liberado para a sua conta ainda — a central exibe as
              ferramentas base.
            </p>
          )}
          {isLoading && (
            <div className="absolute top-1 left-6 flex items-center gap-1.5 text-[11px] text-white/40 z-20 pointer-events-none">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Carregando módulos...
            </div>
          )}

          {isDesktopOrbit && viewMode === 'orbit' ? (
            <div
              ref={orbitContainerRef}
              className="hub-orbit"
              role="group"
              aria-label="Órbita do Birth Hub 360°"
            >
              {orbitLines}
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={(e) => handleCardClick(e, item)}
                    className={`hub-card ${item.primary ? 'primary' : ''}`}
                    title={item.description}
                    aria-label={`${item.label} - ${item.description}`}
                    data-orbit-accent={item.colorVar}
                    style={{ '--orbit-accent': `var(--${item.colorVar})` } as React.CSSProperties}
                  >
                    <div className="hc-orb">
                      <div className="hc-icon-wrap">
                        <Icon className={item.primary ? 'h-8 w-8' : 'h-5 w-5'} />
                      </div>
                      <div className="hc-title">{item.label}</div>
                      {item.primary && (
                        <div className="hc-tag hc-tag-inside">{item.description}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : isDesktopOrbit && viewMode === 'cockpit' ? (
            <ExecutiveCockpitView items={items} onCardClick={handleCardClick} />
          ) : (
            <div className="h-full overflow-y-auto w-full py-2">
              <MobileDestinationList items={items} />
            </div>
          )}

          <div className="mx-auto w-full max-w-[1250px] px-8 pb-10 pt-6">
            <CommercialAgentCellPanel />
          </div>
        </main>
      </div>
    </div>

      </div>
    </div>
  );
}
