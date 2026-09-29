# Script PowerShell para configurar HTTPS no AWS EC2
# Uso: .\deploy-aws-https.ps1 -Domain seu-dominio.com -KeyPath caminho\para\chave.pem

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,

    [Parameter(Mandatory=$true)]
    [string]$KeyPath,

    [string]$EC2User = "ubuntu",
    [string]$EC2Host = "3.143.251.44"
)

# Verificar se o arquivo de chave existe
if (-not (Test-Path $KeyPath)) {
    Write-Error "Arquivo de chave SSH não encontrado: $KeyPath"
    exit 1
}

# Verificar se o script setup-nginx-ssl.sh existe localmente
$localScriptPath = ".\setup-nginx-ssl.sh"
if (-not (Test-Path $localScriptPath)) {
    Write-Error "Script setup-nginx-ssl.sh não encontrado no diretório atual"
    exit 1
}

Write-Host "=== Iniciando configuração HTTPS no AWS EC2 ===" -ForegroundColor Green
Write-Host "Domínio: $Domain" -ForegroundColor Yellow
Write-Host "Servidor: $EC2User@$EC2Host" -ForegroundColor Yellow
Write-Host ""

# Copiar script para o servidor
Write-Host "1. Copiando script setup-nginx-ssl.sh para o servidor..." -ForegroundColor Cyan
scp -i $KeyPath $localScriptPath "${EC2User}@${EC2Host}:/home/ubuntu/"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao copiar script para o servidor"
    exit 1
}

Write-Host "   Script copiado com sucesso" -ForegroundColor Green
Write-Host ""

# Executar comandos remotamente via SSH
$sshCommands = @"

# Atualizar sistema e instalar nginx/certbot
echo '=== Atualizando sistema e instalando nginx/certbot ==='
sudo apt-get update -y
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Configurar systemd para a aplicação
echo '=== Configurando serviço systemd ==='
sudo cat > /etc/systemd/system/birthhub360.service <<'EOF'
[Unit]
Description=Birth Hub 360 Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/birthhub-360
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOST=0.0.0.0
Environment=TRUST_PROXY=true
ExecStart=/usr/bin/node /home/ubuntu/birthhub-360/dist/server.cjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable birthhub360.service

# Parar aplicação atual se estiver rodando
echo '=== Parando aplicação atual ==='
pkill -f 'node.*server' || true

# Configurar nginx básico (HTTP)
echo '=== Configurando nginx básico ==='
sudo cat > /etc/nginx/sites-available/birthhub360 <<'EOF'
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/birthhub360 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Reiniciar aplicação
echo '=== Reiniciando aplicação ==='
sudo systemctl restart birthhub360.service

# Dar permissão de execução ao script SSL
echo '=== Configurando script SSL ==='
sudo chmod +x /home/ubuntu/setup-nginx-ssl.sh

echo '=== Setup inicial concluído ==='
echo 'Aplicação rodando em HTTP: http://$EC2Host'
"@

Write-Host "2. Executando configuração inicial no servidor..." -ForegroundColor Cyan
$sshCommand = "ssh -i $KeyPath -o StrictHostKeyChecking=no ${EC2User}@${EC2Host} `"$sshCommands`""
Invoke-Expression $sshCommand

if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha na configuração inicial"
    exit 1
}

Write-Host "   Configuração inicial concluída" -ForegroundColor Green
Write-Host ""

# Perguntar se deseja configurar SSL agora
Write-Host "3. Configuração de SSL (Let's Encrypt)" -ForegroundColor Cyan
Write-Host "IMPORTANT: O domínio $Domain deve estar apontando para $EC2Host" -ForegroundColor Yellow
Write-Host "Portas 80 e 443 devem estar abertas no Security Group AWS" -ForegroundColor Yellow
Write-Host ""

$configureSSL = Read-Host "Deseja configurar SSL agora? (s/n)"

if ($configureSSL -eq 's' -or $configureSSL -eq 'S') {
    Write-Host "   Configurando SSL..." -ForegroundColor Cyan

    $sslCommands = @"

# Executar script de configuração SSL
echo '=== Executando configuração SSL ==='
sudo /home/ubuntu/setup-nginx-ssl.sh $Domain

# Atualizar variáveis de ambiente
echo '=== Atualizando variáveis de ambiente ==='
cd /home/ubuntu/birthhub-360

# Backup do .env atual
cp .env .env.backup

# Atualizar configurações HTTPS
sed -i 's/TRUST_PROXY=false/TRUST_PROXY=true/g' .env || echo 'TRUST_PROXY=true' >> .env
sed -i 's|PUBLIC_BASE_URL=http://.*|PUBLIC_BASE_URL=https://$Domain|g' .env || echo "PUBLIC_BASE_URL=https://$Domain" >> .env
sed -i 's|BETTER_AUTH_URL=http://.*|BETTER_AUTH_URL=https://$Domain|g' .env || echo "BETTER_AUTH_URL=https://$Domain" >> .env
sed -i 's|ALLOWED_ORIGINS=http://.*|ALLOWED_ORIGINS=https://$Domain|g' .env || echo "ALLOWED_ORIGINS=https://$Domain" >> .env
sed -i 's/SECURE_COOKIES=false/SECURE_COOKIES=true/g' .env || echo 'SECURE_COOKIES=true' >> .env

# Reiniciar serviços
echo '=== Reiniciando serviços ==='
sudo systemctl restart birthhub360.service
sudo systemctl restart nginx

echo '=== Configuração HTTPS concluída ==='
echo 'Acesse: https://$Domain'
"@

    $sslCommand = "ssh -i $KeyPath -o StrictHostKeyChecking=no ${EC2User}@${EC2Host} `"$sslCommands`""
    Invoke-Expression $sslCommand

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na configuração SSL"
        exit 1
    }

    Write-Host "   SSL configurado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Configuração concluída ===" -ForegroundColor Green
    Write-Host "Acesse sua aplicação em: https://$Domain" -ForegroundColor Yellow
} else {
    Write-Host "   SSL não configurado. Execute mais tarde com:" -ForegroundColor Yellow
    Write-Host "   ssh -i $KeyPath ${EC2User}@${EC2Host} 'sudo /home/ubuntu/setup-nginx-ssl.sh $Domain'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para verificar o status:" -ForegroundColor Cyan
Write-Host "  ssh -i $KeyPath ${EC2User}@${EC2Host} 'sudo systemctl status birthhub360.service'" -ForegroundColor White
Write-Host "  ssh -i $KeyPath ${EC2User}@${EC2Host} 'sudo systemctl status nginx'" -ForegroundColor White
