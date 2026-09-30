
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../../components/ui/index.js';
import { Bot, CheckCircle, Clock, Zap } from 'lucide-react';
import { HubBurstCanvas } from './HubBurstCanvas.js';

export function HubScreen() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-bg">
      {/* Visual Canvas Area */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center border-r border-line bg-surface-subtle overflow-hidden">
        <div className="absolute top-8 left-8">
          <h2 className="font-display text-2xl font-bold text-ink">360&deg; HUB</h2>
          <p className="text-sm text-ink-2 mt-1">Orchestration Center</p>
        </div>
        <HubBurstCanvas />
      </div>

      {/* Action / Data Area */}
      <div className="w-full lg:w-[480px] flex flex-col h-full bg-surface overflow-y-auto">
        <div className="p-6 border-b border-line flex items-center justify-between">
          <h3 className="font-semibold text-lg">Next Actions</h3>
          <Badge variant="outline" className="font-mono">4 Pending</Badge>
        </div>

        <div className="p-6 space-y-4">
          {/* Action Cards */}
          <Card className="hover:border-brand transition-colors cursor-pointer group">
             <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                   <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-info" />
                      AI Follow-up Suggestion
                   </CardTitle>
                   <span className="text-xs text-ink-2">Just now</span>
                </div>
             </CardHeader>
             <CardContent className="p-4 pt-0">
                <p className="text-sm text-ink-2 mb-3">Lead <strong>Acme Corp</strong> showed high intent. Suggesting immediate call.</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="default" className="w-full">Execute Call</Button>
                   <Button size="sm" variant="outline" className="w-full">Dismiss</Button>
                </div>
             </CardContent>
          </Card>

          <Card className="hover:border-brand transition-colors cursor-pointer group">
             <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                   <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-warning" />
                      Pipeline Alert
                   </CardTitle>
                   <span className="text-xs text-ink-2">2h ago</span>
                </div>
             </CardHeader>
             <CardContent className="p-4 pt-0">
                <p className="text-sm text-ink-2 mb-3">Deal <strong>Global Tech</strong> is stalling in negotiation.</p>
                <Button size="sm" variant="secondary" className="w-full">View Deal Context</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
