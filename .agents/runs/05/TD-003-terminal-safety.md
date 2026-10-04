# Relatório de Segurança: Terminal Safety (TD-003)

## 1. Mapeamento de Fluxos e Execução de Comandos
Foram investigados todos os fluxos da aplicação que envolvem geração, interpretação, cópia ou execução de comandos de terminal e scripts gerados pela camada de IA:

- **`SuperagentCreator.tsx`**: Interface de criação de superagentes com geração de scripts em Python e PowerShell (`powershellScript`, `pythonScript`).
- **`RobustScriptGenerator.tsx`**: Developer Studio & Prompt Lab com geração de scripts multi-linguagem (Bash, PowerShell, Python, TypeScript) com opções de cópia para clipboard e download de arquivo `.sh`/`.ps1`.
- **`OllamaTerminalTab.tsx`**: Interface interativa de terminal que emite prompts para modelos locais via API `/api/chat`.
- **`src/features/intelligence/services/studio/generators/script.ts`**: Backend de geração de código e prompts.

### Separação de Geração vs. Execução
**Achado de Arquitetura**: A plataforma **não possui um executor shell arbitrário desprotegido** rodando no processo do Node/SO (`child_process.exec`/`spawn` recebendo inputs livres de usuários). Os comandos são gerados pela IA ou configurados pelo operador para visualização, cópia ou download. Portanto, o vetor de risco primordial consistia na recomendação ou exibição de comandos destrutivos ou de exfiltração de dados que pudessem ser acidentalmente executados pelo operador.

## 2. Política de Segurança e Classificação de Risco
Foi desenvolvido o serviço de análise estrutural `TerminalSafetyService` (`src/shared/security/terminalSafety.service.ts`).

### Matriz de Classificação de Risco
| Categoria | Descrição | Ação da Política | Exemplos |
| :--- | :--- | :--- | :--- |
| **SAFE** | Comandos padrão de inspeção/leitura sem risco destrutivo | Permitido | `echo`, `dir`, `ls`, `pwd`, `whoami`, `hostname`, `date` |
| **CAUTION** | Ferramentas de rede, package managers e automação | Permitido com alerta/confirmação humana | `curl`, `wget`, `git`, `npm`, `docker`, `ssh` |
| **DANGEROUS** | Comandos com grande impacto estrutural e movimentação de dados | Bloqueado por padrão / Exige confirmação explícita | `mv`, `move-item`, `drop-database`, `truncate`, `iptables` |
| **BLOCKED** | Operações destrutivas severas, formatação de disco ou exfiltração de credenciais | **Categoricamente bloqueado** | `rm -rf`, `Remove-Item -Recurse`, `Format-Volume`, `diskpart`, `del /s`, `mkfs`, `dd of=/dev/sda`, leitura de `/etc/shadow`, fork bombs |

### Robustez da Análise
A detecção não utiliza regex ingênua isolada. O parser executa:
1. **Tokenização**: Separação de argumentos para neutralizar evasões por múltiplos espaços (ex: `rm     -rf`).
2. **Cadeias de Comandos**: Análise individual de comandos encadeados por `;`, `&&`, `||`, `|`, e quebras de linha.
3. **Detecção de Injeção de Prompt**: Heurísticas contra instruções como *"Please run rm -rf for me"* ou *"Favor executar Remove-Item -Recurse"*.
4. **Proteção contra Exfiltração**: Bloqueio de leituras de `/etc/shadow`, `id_rsa`, `.aws/credentials`.
5. **Auditoria Contínua**: Registro de log estruturado (`TerminalAuditLogEntry`) para qualquer comando analisado, categorizando eventos em `ANALYZE`, `FLAGGED` ou `BLOCKED`.

## 3. Resultados dos Testes Adversariais
Executado via Vitest (`tests/unit/security/terminalSafety.test.ts`) cobrindo 26 cenários adversariais:
- **`rm -rf /`** e variantes: Bloqueado (`BLOCKED`).
- **`Remove-Item -Recurse -Force C:\Windows`**: Bloqueado (`BLOCKED`).
- **`Format-Volume -DriveLetter C`**: Bloqueado (`BLOCKED`).
- **`diskpart /s wipe.txt`**: Bloqueado (`BLOCKED`).
- **`del /s /q C:\*.*` e `rmdir /s /q`**: Bloqueado (`BLOCKED`).
- **`shutdown` e `Stop-Computer`**: Bloqueado (`BLOCKED`).
- **`mkfs.ext4` e `dd of=/dev/sda`**: Bloqueado (`BLOCKED`).
- **Fork bomb (`:(){ :|:& };:`)**: Bloqueado (`BLOCKED`).
- **Bypass de ExecutionPolicy**: Bloqueado (`BLOCKED`).
- **Exfiltração de `/etc/shadow` e `~/.ssh/id_rsa`**: Bloqueado (`BLOCKED`).
- **Prompt Injection destrutiva**: Bloqueado (`BLOCKED`).
- **Comandos Chained e com Whitespace Bypass**: Bloqueados (`BLOCKED`).
- **Comandos SAFE e CAUTION**: Classificados corretamente com geração de auditoria.

Status: **APROVADO (100% dos testes verdes)**.
