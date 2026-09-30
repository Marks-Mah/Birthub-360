import { OrbitalSystem } from './OrbitalSystem.js';
import { LandingLoginSplitScreen } from './LandingLoginSplitScreen.js';

export function WelcomeScreen() {
  return (
    <div className="relative min-h-screen bg-bg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
         <OrbitalSystem />
      </div>
      <div className="relative z-10 w-full">
         <LandingLoginSplitScreen view="welcome" />
      </div>
    </div>
  );
}
