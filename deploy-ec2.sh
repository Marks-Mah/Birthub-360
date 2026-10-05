#!/bin/bash

# Script de Deploy da Aplicação Principal com Docker (Build no Servidor)
# Uso: ./deploy-ec2.sh

KEY_PATH="$HOME/.ssh/Birthub360.pem"
EC2_HOST="3.143.251.44"
EC2_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/birthhub-360"

echo "=== Deploy da Aplicação Principal com Docker (Build no Servidor) ==="
echo "Host: $EC2_HOST"
echo "Usuário: $EC2_USER"
echo "Chave: $KEY_PATH"
echo ""

# Verificar se a chave existe
if [ ! -f "$KEY_PATH" ]; then
    echo "ERRO: Chave SSH não encontrada em $KEY_PATH"
    exit 1
fi

echo "1. Criando diretório remoto e limpando anterior..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "mkdir -p $REMOTE_DIR && rm -rf $REMOTE_DIR/*"

echo "2. Copiando arquivos essenciais para o servidor..."
files_to_copy=(
    "package.json"
    "package-lock.json"
    ".npmrc"
    "Dockerfile"
    "docker-compose.prod.yml"
    "tsconfig.json"
    "prisma"
    "src"
    "scripts"
    "public"
)

for file in "${files_to_copy[@]}"; do
    if [ -e "$file" ]; then
        echo "   Copiando $file..."
        scp -i "$KEY_PATH" -o StrictHostKeyChecking=no -r "$file" "$EC2_USER@$EC2_HOST:$REMOTE_DIR/"
        if [ $? -ne 0 ]; then
            echo "ERRO: Falha ao copiar $file"
            exit 1
        fi
    else
        echo "   AVISO: $file não encontrado, pulando..."
    fi
done

echo "3. Renomeando docker-compose.prod.yml para docker-compose.yml..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && mv docker-compose.prod.yml docker-compose.yml"

echo "4. Copiando arquivo .env..."
if [ -f .env ]; then
    scp -i "$KEY_PATH" -o StrictHostKeyChecking=no .env "$EC2_USER@$EC2_HOST:$REMOTE_DIR/"
else
    echo "WARNING: .env não encontrado (usando defaults no servidor)"
fi

echo "5. Fazendo build da imagem Docker no servidor..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && docker build -t birthhub-360:latest ."

if [ $? -ne 0 ]; then
    echo "ERRO: Build do Docker falhou no servidor"
    exit 1
fi

echo "6. Parando container antigo..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && docker compose down"

if [ $? -ne 0 ]; then
    echo "WARNING: Falha ao parar container (pode não existir)"
fi

echo "7. Iniciando container novo..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && docker compose up -d app"

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao iniciar container"
    exit 1
fi

echo "8. Verificando status do container..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "docker ps | grep birthhub"

echo "9. Configurando nginx como reverse proxy..."
cat <<'EOF' | ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "cat > /tmp/birthhub-app.conf"
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo cp /tmp/birthhub-app.conf /etc/nginx/sites-available/birthhub-app && sudo ln -sf /etc/nginx/sites-available/birthhub-app /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default"
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo nginx -t && sudo systemctl restart nginx"

echo ""
echo "=== Deploy concluído! ==="
echo "Acesse: http://$EC2_HOST"
