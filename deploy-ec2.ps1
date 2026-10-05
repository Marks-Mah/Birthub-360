param(
    [string]$KeyPath = "C:\Users\marce\.ssh\Birthhub360.pem",
    [string]$EC2Host = "3.143.251.44",
    [string]$EC2User = "ubuntu",
    [string]$RemoteDir = "/home/ubuntu/birthhub-360"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Deploy da Aplicação Principal com Docker (Build no Servidor) ===" -ForegroundColor Cyan
Write-Host "Host: $EC2Host" -ForegroundColor Yellow
Write-Host "Usuário: $EC2User" -ForegroundColor Yellow
Write-Host "Chave: $KeyPath" -ForegroundColor Yellow
Write-Host ""

# Verificar se a chave existe
if (-not (Test-Path $KeyPath)) {
    Write-Host "ERRO: Chave SSH não encontrada em $KeyPath" -ForegroundColor Red
    exit 1
}

Write-Host "1. Criando diretório remoto e limpando anterior..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "mkdir -p $RemoteDir && rm -rf $RemoteDir/*"

Write-Host "2. Copiando arquivos essenciais para o servidor..." -ForegroundColor Yellow
$filesToCopy = @(
    "package.json",
    "package-lock.json",
    ".npmrc",
    "Dockerfile",
    "docker-compose.prod.yml",
    "tsconfig.json",
    "prisma",
    "src",
    "scripts",
    "public"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Write-Host "   Copiando $file..." -ForegroundColor Gray
        scp -i $KEY_PATH -o StrictHostKeyChecking=no -r $file "$($EC2User)@$($EC2Host):$RemoteDir/"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERRO: Falha ao copiar $file" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "   AVISO: $file não encontrado, pulando..." -ForegroundColor Yellow
    }
}

Write-Host "3. Renomeando docker-compose.prod.yml para docker-compose.yml..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd $RemoteDir && mv docker-compose.prod.yml docker-compose.yml"

Write-Host "4. Copiando arquivo .env..." -ForegroundColor Yellow
if (Test-Path .env) {
    scp -i $KEY_PATH -o StrictHostKeyChecking=no .env "$($EC2User)@$($EC2Host):$RemoteDir/"
}
else {
    Write-Host "WARNING: .env não encontrado (usando defaults no servidor)" -ForegroundColor Yellow
}

Write-Host "5. Fazendo build da imagem Docker no servidor..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd $RemoteDir && docker build -t birthhub-360:latest ."

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Build do Docker falhou no servidor" -ForegroundColor Red
    exit 1
}

Write-Host "6. Parando container antigo..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd $RemoteDir && docker compose down"

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Falha ao parar container (pode não existir)" -ForegroundColor Yellow
}

Write-Host "7. Iniciando container novo..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd $RemoteDir && docker compose up -d app"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao iniciar container" -ForegroundColor Red
    exit 1
}

Write-Host "8. Verificando status do container..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "docker ps | grep birthhub"

Write-Host "9. Configurando nginx como reverse proxy..." -ForegroundColor Yellow
$nginxConfig = @"
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
"@

$nginxConfig | ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cat > /tmp/birthhub-app.conf"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo cp /tmp/birthhub-app.conf /etc/nginx/sites-available/birthhub-app && sudo ln -sf /etc/nginx/sites-available/birthhub-app /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo nginx -t && sudo systemctl restart nginx"

Write-Host ""
Write-Host "=== Deploy concluído! ===" -ForegroundColor Green
Write-Host "Acesse: http://$EC2Host" -ForegroundColor Cyan
