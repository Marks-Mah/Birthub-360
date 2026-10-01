import { api } from '../../lib/api.js';
import type { OverviewMetrics } from '../../shared/contracts/analytics.contract.js';

export type { OverviewMetrics };

export interface DistributionSlice {
  label: string;
  count: number;
}

export interface FunnelStage extends DistributionSlice {
  conversionFromPrevious: number | null;
  amount?: number;
  conversionFromPreviousAmount?: number | null;
}

export interface MonthlyPoint {
  month: string;
  created: number;
  won: number;
  lost: number;
}

export interface PerformanceAgentRow {
  agent: string;
  isAi: boolean;
  leadsAssigned: number;
  leadsQualified: number;
  conversionRate: number;
  wonAmount?: number;
}

export interface SalesSummaryMetrics {
  totalWonDeals: number;
  totalWonRevenue: number;
  averageTicket: number | null;
  salesVelocityDays: number | null;
}

export interface AnalyticsDashboard {
  overview: OverviewMetrics;
  funnel: FunnelStage[];
  byTemperature: DistributionSlice[];
  bySource: DistributionSlice[];
  byOwner: Array<DistributionSlice & { won: number; wonAmount?: number }>;
  activitiesByType: DistributionSlice[];
  activitiesByStatus: DistributionSlice[];
  monthly: MonthlyPoint[];
  tmqMetric: number | null;
  lostReasons: DistributionSlice[];
  callHeatmap: { dayOfWeek: number; hour: number; count: number }[];
  performanceReport: PerformanceAgentRow[];
  salesSummary?: SalesSummaryMetrics;
  isEmpty: boolean;
}

export const PERIOD_OPTIONS = [3, 6, 12, 24] as const;

export const analyticsApi = {
  dashboard: (months: number) =>
    api.get<AnalyticsDashboard>(`/api/analytics/dashboard?months=${months}`, {
      timeoutMs: 30_000,
    }),
  salesSummary: () =>
    api.get<SalesSummaryMetrics>('/api/analytics/sales-summary', {
      timeoutMs: 15_000,
    }),
};
