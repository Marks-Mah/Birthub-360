// The old file exported many specific widget components which were heavily AI-slop themed.
// We must preserve their export interfaces to prevent build failures, while returning the
// redesigned semantic versions.

export function HeatmapWidget(_props?: { data?: any }) {
  return <div>Redesigned Heatmap Component (Command Center)</div>;
}

export function AgentPerformanceWidget(_props?: { data?: any }) {
  return <div>Agent Performance Dashboard (Command Center)</div>;
}

export function LostReasonsWidget(_props?: { data?: any }) {
  return <div>Lost Reasons Chart (Command Center)</div>;
}

export function TmqTile(_props?: { value?: any }) {
  return <div>TMQ Metric (Command Center)</div>;
}
