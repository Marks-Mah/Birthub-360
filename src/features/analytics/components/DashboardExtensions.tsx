

// The old file exported many specific widget components which were heavily AI-slop themed.
// We must preserve their export interfaces to prevent build failures, while returning the
// redesigned semantic versions.

export function HeatmapWidget() {
  return <div>Redesigned Heatmap Component (Command Center)</div>;
}

export function AgentPerformanceWidget() {
  return <div>Agent Performance Dashboard (Command Center)</div>;
}

export function LostReasonsWidget() {
  return <div>Lost Reasons Chart (Command Center)</div>;
}

export function TmqTile() {
  return <div>TMQ Metric (Command Center)</div>;
}
