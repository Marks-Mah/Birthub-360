# Script de setup para ambiente multiagentes (8 worktrees simultâneos)
# Baseado na Onda IA-1 do plano de implementação

Write-Host "=== Setup Ambiente Multiagentes - Onda IA-1 ===" -ForegroundColor Cyan

$baseDir = "C:\Github\Birthub-360"
$branch = "integracao/onda-ia-1"

# Criar branch de integração se não existir
Write-Host "[1/5] Criando branch de integracao: ${branch}" -ForegroundColor Yellow
git checkout -b $branch 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Branch ja existe ou erro ao criar" -ForegroundColor Yellow
}

# Funcao para criar worktree
function Create-AgentWorktree {
    param(
        [string]$agentId,
        [string]$agentSlug
    )
    
    $worktreePath = "..\wt-agente-${agentId}"
    $agentBranch = "agente/${agentId}-${agentSlug}"
    
    Write-Host "[2/5] Criando worktree para Agente ${agentId}: ${worktreePath}" -ForegroundColor Yellow
    
    # Criar branch do agente
    git checkout -b $agentBranch 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Branch $agentBranch ja existe, fazendo checkout" -ForegroundColor Yellow
        git checkout $agentBranch 2>&1 | Out-Null
    }
    
    # Voltar para branch de integracao
    git checkout $branch 2>&1 | Out-Null
    
    # Criar worktree
    git worktree add $worktreePath $agentBranch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Worktree criado: $worktreePath" -ForegroundColor Green
    }
    else {
        Write-Host "ERRO ao criar worktree: $worktreePath" -ForegroundColor Red
    }
}

# Criar worktrees para os 8 agentes da Onda 1
Write-Host "[3/5] Criando worktrees para os 8 agentes..." -ForegroundColor Yellow

# Agentes da Onda 1 (8 especialistas)
Create-AgentWorktree -agentId "07" -agentSlug "security"
Create-AgentWorktree -agentId "01" -agentSlug "data"
Create-AgentWorktree -agentId "10" -agentSlug "infra"
Create-AgentWorktree -agentId "15" -agentSlug "security-applied"
Create-AgentWorktree -agentId "02" -agentSlug "ux"
Create-AgentWorktree -agentId "14" -agentSlug "harness"
Create-AgentWorktree -agentId "16" -agentSlug "workers"
Create-AgentWorktree -agentId "00" -agentSlug "coordenador"

Write-Host "[4/5] Matriz de propriedade da Onda IA-1" -ForegroundColor Yellow
Write-Host "Agente 07: src/lib/ai/**" -ForegroundColor Cyan
Write-Host "Agente 01: prisma/schema.prisma, prisma/migrations/**" -ForegroundColor Cyan
Write-Host "Agente 10: docker-compose.yml, k8s/**, infrastructure/**" -ForegroundColor Cyan
Write-Host "Agente 15: tests/security/**" -ForegroundColor Cyan
Write-Host "Agente 02: src/features/knowledge/**" -ForegroundColor Cyan
Write-Host "Agente 14: tests/harness/**" -ForegroundColor Cyan
Write-Host "Agente 16: src/lib/queue/**" -ForegroundColor Cyan
Write-Host "Agente 00: AGENTS.md, .agents/runs/**, .agents/handoffs/**" -ForegroundColor Cyan

Write-Host "[5/5] Ambiente configurado!" -ForegroundColor Green
Write-Host "Para acessar cada worktree: cd ..\wt-agente-<id>" -ForegroundColor Yellow
Write-Host "Para remover worktrees apos a onda: git worktree remove <path>" -ForegroundColor Yellow
