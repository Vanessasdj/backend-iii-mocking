#!/bin/bash

# 🐳 SCRIPT PARA BUILD E PUSH DA IMAGEM DOCKER
# Backend III - Sistema de Mocking

echo "🐳 INICIANDO BUILD E PUSH PARA DOCKERHUB..."
echo "============================================="

# Definir variáveis
DOCKER_USERNAME="vanessasdj"
IMAGE_NAME="backend-iii-mocking"
VERSION="1.0.0"
LATEST_TAG="latest"

echo "📝 Configurações:"
echo "   - Usuário DockerHub: $DOCKER_USERNAME"
echo "   - Nome da imagem: $IMAGE_NAME"
echo "   - Versão: $VERSION"

# 1. Verificar se Docker está rodando
echo "🔍 Verificando Docker..."
if ! docker info >/dev/null 2>&1; then
    echo "❌ ERRO: Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi
echo "✅ Docker está rodando"

# 2. Fazer login no DockerHub
echo "🔐 Fazendo login no DockerHub..."
echo "⚠️  Você será solicitado a inserir suas credenciais do DockerHub"
if ! docker login; then
    echo "❌ ERRO: Falha no login do DockerHub"
    exit 1
fi
echo "✅ Login realizado com sucesso"

# 3. Build da imagem
echo "🔨 Construindo imagem Docker..."
if ! docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .; then
    echo "❌ ERRO: Falha na construção da imagem"
    exit 1
fi

# Criar tag latest
docker tag $DOCKER_USERNAME/$IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG

echo "✅ Imagem construída com sucesso!"
echo "   - $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo "   - $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG"

# 4. Push para DockerHub
echo "📤 Enviando imagem para DockerHub..."

# Push da versão específica
if ! docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION; then
    echo "❌ ERRO: Falha no push da versão $VERSION"
    exit 1
fi

# Push da tag latest
if ! docker push $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG; then
    echo "❌ ERRO: Falha no push da tag latest"
    exit 1
fi

echo "✅ Imagem enviada com sucesso para DockerHub!"

# 5. Verificar imagem no DockerHub
echo "🔗 Links da imagem no DockerHub:"
echo "   - https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo "   - docker pull $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo "   - docker pull $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG"

# 6. Listar imagens locais
echo "📊 Imagens Docker locais:"
docker images | grep $IMAGE_NAME

# 7. Testar a imagem localmente (opcional)
echo ""
read -p "🧪 Deseja testar a imagem localmente? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Testando imagem localmente..."
    echo "   - Parando containers existentes..."
    docker-compose down 2>/dev/null || true
    
    echo "   - Iniciando com docker-compose..."
    docker-compose up -d
    
    echo "   - Aguardando inicialização..."
    sleep 10
    
    echo "   - Testando endpoint..."
    if curl -f http://localhost:8080/ >/dev/null 2>&1; then
        echo "✅ Teste local bem-sucedido!"
        echo "🌐 Acesse: http://localhost:8080"
        echo "📚 Documentação: http://localhost:8080/api-docs"
    else
        echo "⚠️  Servidor pode ainda estar inicializando. Verifique manualmente:"
        echo "   docker-compose logs app"
    fi
    
    echo ""
    echo "Para parar o teste: docker-compose down"
fi

echo ""
echo "🎉 PROCESSO CONCLUÍDO COM SUCESSO!"
echo "=================================="
echo "✅ Imagem Docker criada e enviada para DockerHub"
echo "🔗 DockerHub: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo "📝 Para usar a imagem:"
echo "   docker pull $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG"
echo "   docker run -p 8080:8080 $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG"
echo ""
echo "🐳 Imagem disponível publicamente no DockerHub!"