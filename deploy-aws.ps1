# Script de Deploy para AWS EC2 - Birth Hub 360 (Docker)
# Uso: .\deploy-aws.ps1

# Configurações
$EC2_HOST = "3.143.251.44"
$EC2_USER = "ubuntu"
$KEY_CANDIDATES = @(
    "C:\Users\marce\OneDrive\Documentos\CHAVE AWS BIRTHUB 360.pem",
    "$env:USERPROFILE\OneDrive\Documentos\CHAVE AWS BIRTHUB 360.pem",
    "$env:USERPROFILE\Documents\CHAVE AWS BIRTHUB 360.pem",
    "$env:USERPROFILE\Desktop\Birthub360.pem",
    "$env:USERPROFILE\OneDrive\Desktop\Birthub360.pem"
)
$KEY_PATH = $KEY_CANDIDATES | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $KEY_PATH) {
    $KEY_PATH = "C:\Users\marce\OneDrive\Documentos\CHAVE AWS BIRTHUB 360.pem"
}
$REMOTE_DIR = "/home/ubuntu/birthhub-360"
$LOCAL_DIST = "./dist"
$CONTAINER_NAME = "birthhub-app"

Write-Host "=== Deploy para AWS EC2 (Docker) ===" -ForegroundColor Cyan
Write-Host "Host: $EC2_HOST" -ForegroundColor Yellow
Write-Host "Usuário: $EC2_USER" -ForegroundColor Yellow
Write-Host "Chave: $KEY_PATH" -ForegroundColor Yellow
Write-Host ""

# Verificar se a chave existe
if (-not (Test-Path $KEY_PATH)) {
    Write-Host "ERRO: Chave SSH não encontrada em $KEY_PATH" -ForegroundColor Red
    exit 1
}

# Verificar se o build existe
if (-not (Test-Path $LOCAL_DIST)) {
    Write-Host "ERRO: Diretório dist/ não encontrado. Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "1. Criando diretório remoto se não existir..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "mkdir -p '$REMOTE_DIR'"

Write-Host "2. Fazendo backup do diretório remoto..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "cd '$REMOTE_DIR' && cp -r dist dist.backup 2>&1 || echo 'Sem backup anterior'"

Write-Host "3. Compactando e copiando arquivos buildados..." -ForegroundColor Yellow
tar -czf dist.tar.gz -C dist .
scp -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 dist.tar.gz "$($EC2_USER)@$($EC2_HOST):$($REMOTE_DIR)/"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 "$($EC2_USER)@$($EC2_HOST)" "mkdir -p '$REMOTE_DIR/dist' && tar -xzf '$REMOTE_DIR/dist.tar.gz' -C '$REMOTE_DIR/dist' && rm -f '$REMOTE_DIR/dist.tar.gz'"
if (Test-Path dist.tar.gz) { Remove-Item -Force dist.tar.gz }

Write-Host "4. Copiando dist atualizado para dentro do container..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "docker cp '$REMOTE_DIR/dist/.' $($CONTAINER_NAME):/app/dist/"

Write-Host "5. Reiniciando container..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "docker restart $($CONTAINER_NAME)"

Write-Host "6. Verificando status do container..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "docker ps --filter name=$($CONTAINER_NAME)"

Write-Host "7. Verificando logs do container..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 $EC2_USER@$EC2_HOST "docker logs $($CONTAINER_NAME) --tail 20"

Write-Host ""
Write-Host "=== Deploy concluído! ===" -ForegroundColor Green
Write-Host "Acesse: http://$EC2_HOST" -ForegroundColor Cyan
