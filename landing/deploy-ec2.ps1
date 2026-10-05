# Script de Deploy da Landing Page para AWS EC2
# Uso: .\deploy-ec2.ps1

# Configurações
$EC2_HOST = "3.143.251.44"
$EC2_USER = "ubuntu"
$KEY_PATH = "C:\Users\marce\.ssh\Birthub360.pem"
$REMOTE_DIR = "/home/ubuntu/birthhub-landing"
$LOCAL_DIST = "./dist"
$NGINX_SITE_CONF = "/etc/nginx/sites-available/birthhub-landing"

Write-Host "=== Deploy da Landing Page para AWS EC2 ===" -ForegroundColor Cyan
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
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "mkdir -p '$REMOTE_DIR/dist'"

Write-Host "2. Fazendo backup do diretório remoto..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd '$REMOTE_DIR' && cp -r dist dist.backup 2>&1 || echo 'Sem backup anterior'"

Write-Host "3. Copiando arquivos buildados..." -ForegroundColor Yellow
$absoluteDist = (Resolve-Path $LOCAL_DIST).Path
scp -i $KEY_PATH -o StrictHostKeyChecking=no -r "$absoluteDist/*" "$($EC2_USER)@$($EC2_HOST):$($REMOTE_DIR)/dist/"

Write-Host "4. Configurando Nginx..." -ForegroundColor Yellow
$nginxConfig = @"
server {
    listen 80;
    server_name _;

    root $REMOTE_DIR/dist;
    index index.html;

    location / {
        try_files `$uri `$uri/ /index.html;
    }

    # Cache estático para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sem cache para index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
"@

$nginxConfig | ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cat > /tmp/birthhub-landing.conf"

Write-Host "5. Instalando/configurando Nginx..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo apt-get update && sudo apt-get install -y nginx"

Write-Host "6. Ativando site no Nginx..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo cp /tmp/birthhub-landing.conf $NGINX_SITE_CONF && sudo ln -sf $NGINX_SITE_CONF /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default"

Write-Host "7. Testando configuração do Nginx..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo nginx -t"

Write-Host "8. Reiniciando Nginx..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo systemctl restart nginx"

Write-Host "9. Verificando status do Nginx..." -ForegroundColor Yellow
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "sudo systemctl status nginx --no-pager"

Write-Host ""
Write-Host "=== Deploy concluído! ===" -ForegroundColor Green
Write-Host "Acesse: http://$EC2_HOST" -ForegroundColor Cyan
Write-Host "Ou configure HTTPS com Let's Encrypt: sudo certbot --nginx" -ForegroundColor Yellow
