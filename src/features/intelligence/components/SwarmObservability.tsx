import { useState, useEffect } from 'react';
import { api } from '../../../lib/api.js';
import { Activity, Server, Cpu, Database, AlertCircle, Clock } from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'WORKING' | 'ERROR';
  tokensUsed: number;
  lastActive: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  level: 'info' | 'warn' | 'error';
}





export function SwarmObservability() {
  const [activeTab, setActiveTab] = useState<'agents' | 'logs' | 'traces'>('agents');
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [agentsRes, logsRes] = (await Promise.all([
        api.get('/api/intelligence/observability/agents'),
        api.get('/api/intelligence/observability/logs')
      ]);
      setAgents(agentsRes.data?.data || []);
      setLogs(logsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch swarm observability data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" /> Swarm Observability
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Painel restrito para ADMIN/Ops. Monitoramento autônomo do enxame.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Tokens (Mês)</p>
              <p className="text-lg font-bold">59.75k</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-md">
              <Server size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Agentes Ativos</p>
              <p className="text-lg font-bold">3 / 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'agents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('agents')}
        >
          Estado dos Agentes
        </button>
        <button
          type="button"
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs Autônomos
        </button>
        <button
          type="button"
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'traces' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('traces')}
        >
          Traces
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        {activeTab === 'agents' && (
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agente / Papel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso (Tokens)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atividade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{agent.name}</span>
                        <span className="text-xs text-gray-500">{agent.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agent.status === 'WORKING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Activity size={12} className="animate-pulse" /> Trabalhando
                        </span>
                      )}
                      {agent.status === 'IDLE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock size={12} /> Ocioso
                        </span>
                      )}
                      {agent.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle size={12} /> Erro
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.tokensUsed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4 bg-gray-900 h-full font-mono text-sm text-gray-300 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="mb-2 flex gap-3">
                <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`font-semibold shrink-0 ${log.level === 'error' ? 'text-red-400' : 'text-blue-400'}`}
                >
                  {log.agent}
                </span>
                <span className={`${log.level === 'error' ? 'text-red-300' : 'text-gray-300'}`}>
                  {log.action}
                </span>
              </div>
            ))}
            <div className="animate-pulse text-gray-600 mt-4">_ aguardando novos logs...</div>
          </div>
        )}

        {activeTab === 'traces' && (
          <div className="p-8 flex flex-col items-center justify-center h-full text-gray-500">
            <Database size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">Traces Detalhados (Em construção)</p>
            <p className="text-sm mt-2">
              A visualização de flamegraphs de traces estará disponível em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


