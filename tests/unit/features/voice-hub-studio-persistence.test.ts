import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useStudioStore } from '@/features/voice-hub/store/useStudioStore.js';
import { initialNodes, initialEdges } from '@/features/voice-hub/store/initialData.js';

function response(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('Voice Studio workflow persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    useStudioStore.setState({
      nodes: initialNodes,
      edges: initialEdges,
      workflowId: null,
      simulationLogs: [],
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('clears the demonstration graph when the tenant has no saved workflow', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ workflow: null }));

    const loaded = await useStudioStore.getState().loadWorkflowFromServer();

    expect(loaded).toBe(true);
    expect(useStudioStore.getState().nodes).toEqual([]);
    expect(useStudioStore.getState().edges).toEqual([]);
    expect(useStudioStore.getState().workflowId).toBeNull();
  });

  it('preserves the current graph and rejects editor hydration on HTTP failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ error: 'offline' }, 503));

    const loaded = await useStudioStore.getState().loadWorkflowFromServer();

    expect(loaded).toBe(false);
    expect(useStudioStore.getState().nodes).toEqual(initialNodes);
    expect(useStudioStore.getState().simulationLogs[0].type).toBe('error');
  });

  it('refuses an invalid server response rather than considering it loaded', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ workflow: { nodes: [] } }));

    expect(await useStudioStore.getState().loadWorkflowFromServer()).toBe(false);
    expect(useStudioStore.getState().nodes).toEqual(initialNodes);
  });

  it('loads a valid server graph and preserves its workflow identifier', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({ workflow: { id: 'wf-1', nodes: [], edges: [] } }),
    );

    expect(await useStudioStore.getState().loadWorkflowFromServer()).toBe(true);
    expect(useStudioStore.getState().workflowId).toBe('wf-1');
    expect(useStudioStore.getState().nodes).toEqual([]);
  });

  it('does not claim persistence when the server rejects a save', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ error: 'forbidden' }, 403));

    expect(await useStudioStore.getState().saveWorkflowToServer()).toBe(false);
    expect(useStudioStore.getState().workflowId).toBeNull();
    expect(useStudioStore.getState().simulationLogs[0].type).toBe('error');
  });

  it('does not claim persistence without explicit server confirmation', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ success: false }));

    expect(await useStudioStore.getState().saveWorkflowToServer()).toBe(false);
    expect(useStudioStore.getState().simulationLogs[0].type).toBe('error');
  });

  it('confirms persistence only for a successful workflow response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({ success: true, workflow: { id: 'wf-2' } }),
    );

    expect(await useStudioStore.getState().saveWorkflowToServer()).toBe(true);
    expect(useStudioStore.getState().workflowId).toBe('wf-2');
    expect(useStudioStore.getState().simulationLogs[0].type).toBe('info');
    expect(fetch).toHaveBeenCalledWith(
      '/api/workflow',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
