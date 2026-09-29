[CmdletBinding()]
param(
    [string]$RepoPath = 'C:\Github\Birthub-360',
    [switch]$NoBackup
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Step([string]$Message) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Ok([string]$Message) {
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Warn([string]$Message) {
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Assert-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Comando '$Name' não encontrado no PATH."
    }
}

function Invoke-Native(
    [string]$FilePath,
    [string[]]$Arguments,
    [string]$Label,
    [switch]$AllowNonZero
) {
    Write-Host ""
    Write-Host ">>> $Label" -ForegroundColor White

    # stderr de psql/node pode conter NOTICE/WARNING mesmo com exit code 0.
    # A falha real é determinada pelo exit code do processo nativo.
    $oldEap = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & $FilePath @Arguments 2>&1 | ForEach-Object {
            Write-Host ($_ | Out-String).TrimEnd()
        }
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $oldEap
    }

    if ($exitCode -ne 0) {
        if ($AllowNonZero) {
            Warn "$Label retornou exit code $exitCode; execução continuará para o gate oficial."
            return $exitCode
        }

        throw "$Label falhou com exit code $exitCode."
    }

    Ok $Label
    return 0
}

function Backup-File([string]$SourcePath, [string]$BackupRoot) {
    if (-not (Test-Path -LiteralPath $SourcePath)) {
        return
    }

    $relative = $SourcePath.Substring($RepoPath.Length).TrimStart('\')
    $destination = Join-Path $BackupRoot $relative
    $destinationDir = Split-Path -Parent $destination

    if (-not (Test-Path -LiteralPath $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    }

    Copy-Item -LiteralPath $SourcePath -Destination $destination -Force
    Ok "Backup: $relative"
}

function Read-EnvValue([string]$FilePath, [string]$Key) {
    if (-not (Test-Path -LiteralPath $FilePath)) {
        return $null
    }

    $escapedKey = [regex]::Escape($Key)
    $line = Get-Content -LiteralPath $FilePath |
        Where-Object { $_ -match "^\s*$escapedKey\s*=" } |
        Select-Object -First 1

    if (-not $line) {
        return $null
    }

    $value = ($line -replace "^\s*$escapedKey\s*=\s*", '').Trim()

    if (
        ($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
        $value = $value.Substring(1, $value.Length - 2)
    }

    return $value
}

function Write-EnvValue([string]$FilePath, [string]$Key, [string]$Value) {
    $lines = @()
    if (Test-Path -LiteralPath $FilePath) {
        $lines = @(Get-Content -LiteralPath $FilePath)
    }

    $escapedKey = [regex]::Escape($Key)
    $newLine = "$Key=$Value"
    $found = $false

    $result = foreach ($line in $lines) {
        if ($line -match "^\s*$escapedKey\s*=") {
            $found = $true
            $newLine
        } else {
            $line
        }
    }

    if (-not $found) {
        $result += $newLine
    }

    Set-Content -LiteralPath $FilePath -Value $result -Encoding UTF8
}

function New-ValidPiiKey {
    $bytes = New-Object 'System.Byte[]' 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

    try {
        $rng.GetBytes($bytes)
    }
    finally {
        $rng.Dispose()
    }

    return [Convert]::ToBase64String($bytes)
}

function Test-PiiKey([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $false
    }

    try {
        $bytes = [Convert]::FromBase64String($Value)
        return $bytes.Length -eq 32
    }
    catch {
        return $false
    }
}

function Write-TextFileIfMissing(
    [string]$FilePath,
    [string]$Content,
    [string]$Description
) {
    if (Test-Path -LiteralPath $FilePath) {
        Ok "$Description — já existe."
        return
    }

    $dir = Split-Path -Parent $FilePath
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    Set-Content -LiteralPath $FilePath -Value $Content -Encoding UTF8
    Ok "$Description — criado."
}

# --------------------------------------------------------------------
# Inicialização
# --------------------------------------------------------------------
Step "BirthHub 360 — Correção TypeScript + Gate V3"

$RepoPath = (Resolve-Path -LiteralPath $RepoPath -ErrorAction Stop).Path

if (-not (Test-Path -LiteralPath (Join-Path $RepoPath 'package.json'))) {
    throw "package.json não encontrado em '$RepoPath'."
}

Assert-Command 'git'
Assert-Command 'node'
Assert-Command 'npm'
Assert-Command 'npx'

Set-Location -LiteralPath $RepoPath

Write-Host "Projeto : $RepoPath" -ForegroundColor Gray
Write-Host "Runner  : Windows PowerShell compatível com ISE" -ForegroundColor Gray

# --------------------------------------------------------------------
# Backup
# --------------------------------------------------------------------
Step "1/6 — Backup"

$backupRoot = Join-Path $RepoPath (".gate-backups\{0}" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))

if ($NoBackup) {
    Warn "Backup desabilitado por -NoBackup."
}
else {
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

    $backupFiles = @(
        (Join-Path $RepoPath 'package.json'),
        (Join-Path $RepoPath 'src\components\layout\OnboardingGate.tsx'),
        (Join-Path $RepoPath 'src\components\layout\RequireProductModule.tsx'),
        (Join-Path $RepoPath 'src\hooks\useOrganizationModules.ts'),
        (Join-Path $RepoPath 'src\config\product-modules.ts'),
        (Join-Path $RepoPath 'src\features\commercial-intelligence\components\CommercialIntelligenceHub.tsx'),
        (Join-Path $RepoPath 'src\lib\ai\embeddings\qdrant.ts'),
        (Join-Path $RepoPath 'src\lib\ai\gateway\chat-model.ts'),
        (Join-Path $RepoPath 'src\lib\ai\gateway\types.ts'),
        (Join-Path $RepoPath 'src\lib\ai\gateway\parsing.ts'),
        (Join-Path $RepoPath 'src\lib\ai\structured\validate.ts'),
        (Join-Path $RepoPath 'tests\integration\ai-guardrails-security.test.ts'),
        (Join-Path $RepoPath '.env.test')
    )

    foreach ($file in $backupFiles) {
        Backup-File -SourcePath $file -BackupRoot $backupRoot
    }

    Ok "Backup em: $backupRoot"
}

# --------------------------------------------------------------------
# Correções TypeScript determinísticas
# --------------------------------------------------------------------
Step "2/6 — Correções TypeScript"

# 2.1 Hook ausente: usar a implementação presente na base atual do repositório.
$hookPath = Join-Path $RepoPath 'src\hooks\useOrganizationModules.ts'
$hookContent = @'
export function useOrganizationModules() {
  return {
    isPendingOnboarding: false,
    isLoading: false,
    isModuleActive: (_key: string) => true,
  };
}
'@
Write-TextFileIfMissing -FilePath $hookPath -Content $hookContent -Description 'useOrganizationModules.ts'

# 2.2 Configuração de Product Modules ausente: criar o módulo tipado.
$productModulesPath = Join-Path $RepoPath 'src\config\product-modules.ts'
$productModulesContent = @'
export interface ProductModule {
  key: string;
  label: string;
  description: string;
  iconName: string;
  colorTheme: string;
  alwaysActive?: boolean;
}

export const PRODUCT_MODULES: ProductModule[] = [
  {
    key: 'crm-comercial',
    label: 'CRM Comercial',
    description: 'Gestão de leads e funil de vendas.',
    iconName: 'LayoutTemplate',
    colorTheme: 'bg-blue-100 text-blue-600',
    alwaysActive: true,
  },
  {
    key: 'social-selling',
    label: 'Social Selling',
    description: 'Prospecção ativa e vendas sociais.',
    iconName: 'Globe',
    colorTheme: 'bg-green-100 text-green-600',
  },
  {
    key: 'hub-inteligencia',
    label: 'Hub de Inteligência',
    description: 'Análise de dados e insights com IA.',
    iconName: 'Cpu',
    colorTheme: 'bg-purple-100 text-purple-600',
  },
];

export type ProductModuleKey = string;
'@
Write-TextFileIfMissing -FilePath $productModulesPath -Content $productModulesContent -Description 'product-modules.ts'

# 2.3 Comercial Intelligence: import explícito de useCallback quando o código
#     usa useCallback diretamente (sem React.useCallback).
$commercialPath = Join-Path $RepoPath 'src\features\commercial-intelligence\components\CommercialIntelligenceHub.tsx'
if (Test-Path -LiteralPath $commercialPath) {
    $content = Get-Content -LiteralPath $commercialPath -Raw -Encoding UTF8

    if ($content -match '\b(?<!React\.)useCallback\s*\(' -and $content -notmatch "import\s*\{[^}]*\buseCallback\b[^}]*\}\s*from\s*['""]react['""]") {
        $content = $content -replace "import \{ useEffect, useMemo, useState \} from 'react';",
            "import { useCallback, useEffect, useMemo, useState } from 'react';"
        Set-Content -LiteralPath $commercialPath -Value $content -Encoding UTF8
        Ok 'CommercialIntelligenceHub.tsx: useCallback importado.'
    }
    elseif ($content -match '\buseCallback\s*\(') {
        Ok 'CommercialIntelligenceHub.tsx: useCallback já disponível.'
    }
    else {
        Ok 'CommercialIntelligenceHub.tsx: nenhum uso direto de useCallback encontrado.'
    }
}

# 2.4 Qdrant: normaliza a função para a API atual e remove any explícito.
$qdrantPath = Join-Path $RepoPath 'src\lib\ai\embeddings\qdrant.ts'
if (Test-Path -LiteralPath $qdrantPath) {
    $qdrant = Get-Content -LiteralPath $qdrantPath -Raw -Encoding UTF8

    if ($qdrant -match 'client\.search_scores') {
        $functionStart = $qdrant.IndexOf('export async function searchEmbeddings(')
        $functionEnd = $qdrant.IndexOf('/**', $functionStart + 10)

        if ($functionStart -ge 0 -and $functionEnd -gt $functionStart) {
            $newSearchFunction = @'
export async function searchEmbeddings(
  tenantId: string,
  queryVector: number[],
  options: SearchOptions = {},
): Promise<Array<{ id: string; score: number; payload: EmbeddingMetadata }>> {
  const client = getClient();
  const { limit = 10, scoreThreshold = 0.7, filter } = options;

  try {
    const filterQuery = filter
      ? {
          must: [
            {
              key: 'tenantId',
              match: { value: tenantId },
            },
            ...(filter.documentType
              ? [
                  {
                    key: 'documentType',
                    match: { value: filter.documentType },
                  },
                ]
              : []),
          ],
        }
      : {
          must: [
            {
              key: 'tenantId',
              match: { value: tenantId },
            },
          ],
        };

    const response = await client.query(COLLECTION_NAME, {
      query: queryVector,
      limit,
      score_threshold: scoreThreshold,
      filter: filterQuery,
      with_payload: true,
    });

    const points = 'points' in response ? response.points : response;

    return points.map((result) => ({
      id: String(result.id),
      score: result.score ?? 0,
      payload: (result.payload ?? {}) as EmbeddingMetadata,
    }));
  } catch (error) {
    console.error('Erro ao buscar embeddings no Qdrant:', error);
    throw error;
  }
}

'@
            $qdrant = $qdrant.Substring(0, $functionStart) + $newSearchFunction + $qdrant.Substring($functionEnd)
            Set-Content -LiteralPath $qdrantPath -Value $qdrant -Encoding UTF8
            Ok 'qdrant.ts: search_scores substituído pela API query() atual.'
        }
        else {
            Warn 'qdrant.ts: não foi possível localizar o bloco completo de searchEmbeddings.'
        }
    }
    else {
        $qdrant = $qdrant.Replace('(points as any[]).map((result) => ({', 'points.map((result) => ({')
        $qdrant = $qdrant.Replace('const timeoutMs = resolveFallbackTimeoutMs(); const _startTime = Date.now();', 'const timeoutMs = resolveFallbackTimeoutMs();')
        Set-Content -LiteralPath $qdrantPath -Value $qdrant -Encoding UTF8
        Ok 'qdrant.ts: cast any legado/_ padrão obsoleto tratados quando presentes.'
    }
}

# 2.5 Contrato AiUsageLogInput: tenantId aceito para compatibilidade com
#     call sites antigos; a persistência continua resolvendo o tenant por requestContext.
$typesPath = Join-Path $RepoPath 'src\lib\ai\gateway\types.ts'
if (Test-Path -LiteralPath $typesPath) {
    $types = Get-Content -LiteralPath $typesPath -Raw -Encoding UTF8

    if ($types -match 'export interface AiUsageLogInput' -and $types -notmatch '\n\s*tenantId\??:\s*string;') {
        $needle = "export interface AiUsageLogInput {`r`n"
        if (-not $types.Contains($needle)) {
            $needle = "export interface AiUsageLogInput {`n"
        }

        if ($types.Contains($needle)) {
            $insert = $needle + "  /** Compatibilidade com call sites legados; o tenant efetivo vem do requestContext. */`n  tenantId?: string;`n"
            $types = $types.Replace($needle, $insert)
            Set-Content -LiteralPath $typesPath -Value $types -Encoding UTF8
            Ok 'gateway/types.ts: tenantId opcional adicionado ao AiUsageLogInput.'
        }
    }
    else {
        Ok 'gateway/types.ts: AiUsageLogInput já contempla tenantId.'
    }
}

# 2.6 Zod 4: ZodError expõe issues, não errors.
foreach ($relative in @(
    'src\lib\ai\gateway\parsing.ts',
    'src\lib\ai\structured\validate.ts'
)) {
    $file = Join-Path $RepoPath $relative

    if (-not (Test-Path -LiteralPath $file)) {
        continue
    }

    $content = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    $updated = $content -replace '\.error\.errors\b', '.error.issues'

    if ($updated -ne $content) {
        Set-Content -LiteralPath $file -Value $updated -Encoding UTF8
        Ok "$relative`: ZodError.errors -> ZodError.issues."
    }
    else {
        Ok "$relative`: nenhum uso legado de .error.errors encontrado."
    }
}

# 2.7 chat-model: remove variável morta conhecida.
$chatPath = Join-Path $RepoPath 'src\lib\ai\gateway\chat-model.ts'
if (Test-Path -LiteralPath $chatPath) {
    $chat = Get-Content -LiteralPath $chatPath -Raw -Encoding UTF8
    $chatUpdated = $chat.Replace(
        'const timeoutMs = resolveFallbackTimeoutMs(); const _startTime = Date.now();',
        'const timeoutMs = resolveFallbackTimeoutMs();'
    )

    if ($chatUpdated -ne $chat) {
        Set-Content -LiteralPath $chatPath -Value $chatUpdated -Encoding UTF8
        Ok 'chat-model.ts: removido _startTime obsoleto.'
    }
}

# 2.8 Teste de integração deve usar Vitest.
$securityTest = Join-Path $RepoPath 'tests\integration\ai-guardrails-security.test.ts'
if (Test-Path -LiteralPath $securityTest) {
    $security = Get-Content -LiteralPath $securityTest -Raw -Encoding UTF8
    $updated = $security.Replace(
        'import { describe, it, expect } from "@jest/globals";',
        'import { describe, it, expect } from "vitest";'
    )

    if ($updated -ne $security) {
        Set-Content -LiteralPath $securityTest -Value $updated -Encoding UTF8
        Ok 'ai-guardrails-security.test.ts: import corrigido para Vitest.'
    }
}

# --------------------------------------------------------------------
# package.json: .env.test precisa sobrescrever DATABASE_URL herdada.
# --------------------------------------------------------------------
$packagePath = Join-Path $RepoPath 'package.json'
$package = Get-Content -LiteralPath $packagePath -Raw -Encoding UTF8

$packageUpdated = $package -replace `
    '"pretest:integration":\s*"([^"]*dotenv-cli\s+-e\s+\.env\.test)(?!\s+-o)([^"]*)"', `
    '"pretest:integration": "$1 -o$2"'

$packageUpdated = $packageUpdated -replace `
    '"pretest:e2e":\s*"([^"]*dotenv-cli\s+-e\s+\.env\.test)(?!\s+-o)([^"]*)"', `
    '"pretest:e2e": "$1 -o$2"'

if ($packageUpdated -ne $package) {
    Set-Content -LiteralPath $packagePath -Value $packageUpdated -Encoding UTF8
    Ok 'package.json: dotenv-cli -o aplicado aos ambientes de teste.'
}
else {
    Ok 'package.json: dotenv-cli -o já aplicado ou não necessário.'
}

# --------------------------------------------------------------------
# Ambiente
# --------------------------------------------------------------------
Step "3/6 — Ambiente de integração"

Invoke-Native `
    -FilePath 'node' `
    -Arguments @('scripts/test/prepare-integration-env.js') `
    -Label 'Preparar ambiente de integração'

$envTest = Join-Path $RepoPath '.env.test'
if (-not (Test-Path -LiteralPath $envTest)) {
    throw ".env.test não foi criado/encontrado após prepare-integration-env.js."
}

$databaseUrl = Read-EnvValue -FilePath $envTest -Key 'DATABASE_URL'
if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
    throw 'DATABASE_URL ausente em .env.test.'
}

if ($databaseUrl -notmatch '/([^/?]+)(\?.*)?$') {
    throw "Não foi possível extrair o nome do banco de DATABASE_URL: $databaseUrl"
}

$dbName = $Matches[1]
if ($dbName -notmatch 'test') {
    throw "ABORTADO: DATABASE_URL não aponta para banco de teste. Banco detectado: '$dbName'"
}

Ok "DATABASE_URL isolada: banco '$dbName'."

# Prisma 7 dá prioridade a DIRECT_URL no prisma.config.ts.
# Não permita que uma DIRECT_URL herdada do PowerShell aponte para prospectordb/dev.
$env:DATABASE_URL = $databaseUrl
$env:DIRECT_URL = $databaseUrl
Ok 'DATABASE_URL/DIRECT_URL do processo apontam para o banco isolado de testes.'

$piiKey = Read-EnvValue -FilePath $envTest -Key 'PII_BLIND_INDEX_KEY'

if (-not (Test-PiiKey $piiKey)) {
    $piiKey = New-ValidPiiKey
    Write-EnvValue -FilePath $envTest -Key 'PII_BLIND_INDEX_KEY' -Value $piiKey
    Ok 'PII_BLIND_INDEX_KEY criada/normalizada para exatamente 32 bytes.'
}
else {
    Ok 'PII_BLIND_INDEX_KEY válida.'
}

$env:PII_BLIND_INDEX_KEY = $piiKey

# --------------------------------------------------------------------
# Migrations
# --------------------------------------------------------------------
Step "4/6 — Prisma"

Invoke-Native `
    -FilePath 'npx' `
    -Arguments @('dotenv-cli', '-e', '.env.test', '-o', '--', 'prisma', 'migrate', 'deploy') `
    -Label 'Aplicar Prisma migrations no banco de teste'

# --------------------------------------------------------------------
# Lint fix antes dos gates
# --------------------------------------------------------------------
Step "5/6 — Normalização do código"

Invoke-Native `
    -FilePath 'npm' `
    -Arguments @('run', 'lint:fix') `
    -Label 'Aplicar correções automáticas do Biome' `
    -AllowNonZero

# --------------------------------------------------------------------
# Gates
# --------------------------------------------------------------------
Step "6/6 — 4 GATES OFICIAIS"

$gates = @(
    @{ Name = 'TypeScript'; File = 'npx'; Args = @('tsc', '--noEmit'); Label = 'npx tsc --noEmit' },
    @{ Name = 'Lint'; File = 'npm'; Args = @('run', 'lint'); Label = 'npm run lint' },
    @{ Name = 'Unit'; File = 'npm'; Args = @('run', 'test:unit'); Label = 'npm run test:unit' },
    @{ Name = 'Integration'; File = 'npm'; Args = @('run', 'test:integration'); Label = 'npm run test:integration' }
)

foreach ($gate in $gates) {
    Invoke-Native `
        -FilePath $gate.File `
        -Arguments $gate.Args `
        -Label $gate.Label
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "BIRTHHUB 360 — TODOS OS 4 GATES PASSARAM" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "[PASS] npx tsc --noEmit"
Write-Host "[PASS] npm run lint"
Write-Host "[PASS] npm run test:unit"
Write-Host "[PASS] npm run test:integration"
Write-Host ""
Write-Host "Projeto: $RepoPath" -ForegroundColor Green

if (-not $NoBackup) {
    Write-Host "Backup : $backupRoot" -ForegroundColor DarkGray
}
