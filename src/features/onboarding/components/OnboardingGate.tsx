import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../../../lib/api.js';

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.get('/onboarding/status');
        if (mounted) {
          setSetupCompleted(res.data.setupCompleted);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
        // Fallback fail-open or fail-closed depending on business rule
        // Assuming false to force them to setup if there's an error, or true to avoid locking out.
        // Better to fail-open if the endpoint fails unexpectedly.
        if (mounted) setSetupCompleted(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    checkStatus();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--brand-primary)] w-8 h-8" />
      </div>
    );
  }

  // If not completed and we are not already on the onboarding page, redirect
  if (setupCompleted === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
