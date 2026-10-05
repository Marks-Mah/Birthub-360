#!/bin/bash
# Script de deploy para AWS EC2 - Birth Hub 360
# Uso: ./deploy-ec2.sh [caminho/chave.pem]

set -e

# Configurações
EC2_HOST="3.143.251.44"
EC2_USER="ubuntu"
KEY_PATH="${1:-C:/Users/marce/OneDrive/Desktop/Birthub360.pem}"
REMOTE_DIR="/home/ubuntu/birthhub-360"

echo "🚀 Iniciando deploy para AWS EC2: $EC2_HOST"
echo "📁 Chave SSH: $KEY_PATH"

# 1. Build local
echo ""
echo "📦 Build local..."
npm run build

# 2. Copiar arquivos para EC2
echo ""
echo "📤 Copiando arquivos para EC2..."
scp -i "$KEY_PATH" -r dist/ "$EC2_USER@$EC2_HOST:$REMOTE_DIR/dist-new/"
scp -i "$KEY_PATH" -r node_modules/ "$EC2_USER@$EC2_HOST:$REMOTE_DIR/node_modules-new/"
scp -i "$KEY_PATH" package.json "$EC2_USER@$EC2_HOST:$REMOTE_DIR/"
scp -i "$KEY_PATH" server.ts "$EC2_USER@$EC2_HOST:$REMOTE_DIR/"

# 3. Atualizar aplicação no servidor
echo ""
echo "🔄 Atualizando aplicação no servidor..."
ssh -i "$KEY_PATH" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
cd /home/ubuntu/birthhub-360

# Backup do dist atual
if [ -d "dist" ]; then
  mv dist dist-backup-$(date +%Y%m%d-%H%M%S)
fi

# Mover novos arquivos
mv dist-new dist
mv node_modules-new node_modules

# Reiniciar container Docker
docker restart birthhub-app

# Verificar status
docker ps | grep birthhub-app
ENDSSH

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://$EC2_HOST"
