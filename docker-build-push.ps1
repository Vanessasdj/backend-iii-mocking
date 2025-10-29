# 🐳 SCRIPT PARA BUILD E PUSH DA IMAGEM DOCKER
# Backend III - Sistema de Mocking
# PowerShell Version

Write-Host "🐳 INICIANDO BUILD E PUSH PARA DOCKERHUB..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow

# Definir variáveis
$DOCKER_USERNAME = "vanessasdj"
$IMAGE_NAME = "backend-iii-mocking"
$VERSION = "1.0.0"
$LATEST_TAG = "latest"

Write-Host "📝 Configurações:" -ForegroundColor Cyan
Write-Host "   - Usuário DockerHub: $DOCKER_USERNAME" -ForegroundColor White
Write-Host "   - Nome da imagem: $IMAGE_NAME" -ForegroundColor White
Write-Host "   - Versão: $VERSION" -ForegroundColor White

# 1. Verificar se Docker está rodando
Write-Host "🔍 Verificando Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Docker não está rodando. Inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# 2. Fazer login no DockerHub
Write-Host "🔐 Fazendo login no DockerHub..." -ForegroundColor Yellow
Write-Host "⚠️  Você será solicitado a inserir suas credenciais do DockerHub" -ForegroundColor Yellow
try {
    docker login
    if ($LASTEXITCODE -ne 0) {
        throw "Falha no login"
    }
    Write-Host "✅ Login realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha no login do DockerHub" -ForegroundColor Red
    exit 1
}

# 3. Build da imagem
Write-Host "🔨 Construindo imagem Docker..." -ForegroundColor Yellow
try {
    docker build -t "$DOCKER_USERNAME/$IMAGE_NAME`:$VERSION" .
    if ($LASTEXITCODE -ne 0) {
        throw "Falha na construção"
    }
    
    # Criar tag latest
    docker tag "$DOCKER_USERNAME/$IMAGE_NAME`:$VERSION" "$DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG"
    
    Write-Host "✅ Imagem construída com sucesso!" -ForegroundColor Green
    Write-Host "   - $DOCKER_USERNAME/$IMAGE_NAME`:$VERSION" -ForegroundColor White
    Write-Host "   - $DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG" -ForegroundColor White
} catch {
    Write-Host "❌ ERRO: Falha na construção da imagem" -ForegroundColor Red
    exit 1
}

# 4. Push para DockerHub
Write-Host "📤 Enviando imagem para DockerHub..." -ForegroundColor Yellow

try {
    # Push da versão específica
    docker push "$DOCKER_USERNAME/$IMAGE_NAME`:$VERSION"
    if ($LASTEXITCODE -ne 0) {
        throw "Falha no push da versão $VERSION"
    }
    
    # Push da tag latest
    docker push "$DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG"
    if ($LASTEXITCODE -ne 0) {
        throw "Falha no push da tag latest"
    }
    
    Write-Host "✅ Imagem enviada com sucesso para DockerHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Verificar imagem no DockerHub
Write-Host "🔗 Links da imagem no DockerHub:" -ForegroundColor Cyan
Write-Host "   - https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME" -ForegroundColor White
Write-Host "   - docker pull $DOCKER_USERNAME/$IMAGE_NAME`:$VERSION" -ForegroundColor White
Write-Host "   - docker pull $DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG" -ForegroundColor White

# 6. Listar imagens locais
Write-Host "📊 Imagens Docker locais:" -ForegroundColor Cyan
docker images | Select-String $IMAGE_NAME

# 7. Testar a imagem localmente (opcional)
Write-Host ""
$testLocal = Read-Host "🧪 Deseja testar a imagem localmente? (y/n)"
if ($testLocal -match "^[Yy]$") {
    Write-Host "🚀 Testando imagem localmente..." -ForegroundColor Yellow
    Write-Host "   - Parando containers existentes..." -ForegroundColor White
    docker-compose down 2>$null
    
    Write-Host "   - Iniciando com docker-compose..." -ForegroundColor White
    docker-compose up -d
    
    Write-Host "   - Aguardando inicialização..." -ForegroundColor White
    Start-Sleep -Seconds 10
    
    Write-Host "   - Testando endpoint..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Teste local bem-sucedido!" -ForegroundColor Green
            Write-Host "🌐 Acesse: http://localhost:8080" -ForegroundColor White
            Write-Host "📚 Documentação: http://localhost:8080/api-docs" -ForegroundColor White
        }
    } catch {
        Write-Host "⚠️  Servidor pode ainda estar inicializando. Verifique manualmente:" -ForegroundColor Yellow
        Write-Host "   docker-compose logs app" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Para parar o teste: docker-compose down" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 PROCESSO CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Yellow
Write-Host "✅ Imagem Docker criada e enviada para DockerHub" -ForegroundColor Green
Write-Host "🔗 DockerHub: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME" -ForegroundColor White
Write-Host "📝 Para usar a imagem:" -ForegroundColor Cyan
Write-Host "   docker pull $DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG" -ForegroundColor White
Write-Host "   docker run -p 8080:8080 $DOCKER_USERNAME/$IMAGE_NAME`:$LATEST_TAG" -ForegroundColor White
Write-Host ""
Write-Host "🐳 Imagem disponível publicamente no DockerHub!" -ForegroundColor Green