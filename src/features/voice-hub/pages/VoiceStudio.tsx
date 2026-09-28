import type React from 'react';

export default function VoiceStudioPage(): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-[#0B0D14] text-white p-8 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Voice Studio (Birth Hub Voices)</h2>
        <p className="text-sm text-slate-400">
          O módulo visual de criação de fluxos de voz está em homologação com o enxame autônomo 24/7.
        </p>
      </div>
    </div>
  );
}
