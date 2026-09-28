import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import type { ProductModuleKey } from '../config/product-modules.js';
import { useAuth } from '../contexts/AuthContext.js';

interface OrganizationModulesData {
  activeModules: ProductModuleKey[];
}

interface OnboardingStatusData {
  status: 'pending' | 'completed';
}

export function useOrganizationModules() {
  const { currentUser } = useAuth();
  const [activeModules, setActiveModules] = useState<ProductModuleKey[]>(['core']);
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingOnboarding, setIsPendingOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchModules() {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const [modulesRes, statusRes] = await Promise.all([
          api.get<OrganizationModulesData>('/api/organization-modules/active'),
          api.get<OnboardingStatusData>('/api/organization-modules/onboarding/status'),
        ]);

        if (mounted) {
          // 'core' é sempre ativo nativamente
          const keys = new Set(modulesRes.activeModules);
          keys.add('core');
          setActiveModules(Array.from(keys));
          setIsPendingOnboarding(statusRes.status === 'pending');
        }
      } catch (err) {
        console.error('Failed to load organization modules', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void fetchModules();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  return {
    activeModules,
    isModuleActive: (key: ProductModuleKey) => activeModules.includes(key),
    isLoading,
    isPendingOnboarding,
  };
}
