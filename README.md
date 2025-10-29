# Backend III - Sistema de Mocking

## Descrição

Este projeto implementa um sistema de mocking para usuários e pets usando Node.js, Express e MongoDB. Ele permite gerar dados falsos para testes e desenvolvimento.

## Funcionalidades

- **Geração de Pets Mockados**: Endpoint para gerar pets com dados falsos
- **Geração de Usuários Mockados**: Endpoint para gerar usuários com senha encriptada
- **Inserção em Massa**: Endpoint para gerar e inserir dados diretamente na base de dados
- **Sistema de Adoções**: Endpoints para gerenciar adoções de pets por usuários
- **CRUD Completo**: Operações básicas para usuários e pets
- **Documentação Swagger**: Interface interativa para explorar a API
- **Testes Funcionais**: Cobertura completa de testes para todos os endpoints
- **Docker Ready**: Containerização completa com Docker e Docker Compose

## Estrutura do Projeto

```
Backend III/
├── src/
│   ├── app.js           # Aplicação Express principal
│   ├── config/          # Configurações
│   │   └── swagger.js   # Configuração do Swagger
│   ├── models/          # Modelos Mongoose
│   │   ├── User.js
│   │   └── Pet.js
│   ├── routes/          # Routers Express
│   │   ├── users.router.js
│   │   ├── pets.router.js
│   │   ├── mocks.router.js
│   │   └── adoption.router.js
│   ├── services/        # Serviços de negócio
│   │   ├── users.service.js
│   │   └── pets.service.js
│   └── utils/           # Utilitários
│       └── mocking.js
├── tests/               # Testes funcionais
│   └── adoption.test.js
├── server.js           # Arquivo de entrada do servidor
├── Dockerfile          # Configuração Docker
├── docker-compose.yml  # Orquestração de containers
├── package.json
└── README.md
```

## 🐳 Docker Hub

**Imagem oficial disponível no Docker Hub:**

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-vanessasdj%2Fbackend--iii--mocking-blue?logo=docker)](https://hub.docker.com/r/vanessasdj/backend-iii-mocking)

```bash
# Baixar e executar a imagem
docker pull vanessasdj/backend-iii-mocking:latest
docker run -p 8080:8080 vanessasdj/backend-iii-mocking:latest
```

## 🚀 Execução com Docker (RECOMENDADO)

### Método 1: Docker Compose (Mais Fácil)

```bash
# Clone o repositório
git clone https://github.com/Vanessasdj/backend-iii-mocking.git
cd backend-iii-mocking

# Executar com docker-compose
docker-compose up -d

# Acessar aplicação
# - API: http://localhost:8080
# - Swagger: http://localhost:8080/api-docs
# - MongoDB Admin: http://localhost:8081
```

### Método 2: Docker Run

```bash
# Executar MongoDB
docker run -d --name mongo -p 27017:27017 mongo:7-jammy

# Executar aplicação
docker run -d --name backend-app \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/backend-mocking \
  vanessasdj/backend-iii-mocking:latest
```

### Método 3: Build Local

```bash
# Build da imagem
docker build -t backend-iii-mocking .

# Executar
docker-compose up -d
```

## 📋 Pré-requisitos (Instalação Local)

- Node.js (versão 14 ou superior)
- MongoDB (local ou remoto)
- Docker (opcional, mas recomendado)

## 🔧 Instalação Local

1. **Clone ou baixe o projeto**
2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o MongoDB:**

   - Certifique-se de que o MongoDB está rodando localmente na porta padrão (27017)
   - Ou configure a variável de ambiente `MONGODB_URI` com sua string de conexão

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   ou para desenvolvimento:
   ```bash
   npm run dev
   ```

## 📚 Documentação da API

**Swagger UI disponível em:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

A documentação interativa contém todos os endpoints, parâmetros e exemplos de uso.

## 🛣️ Endpoints Principais

### 🏠 Endpoint Principal

- `GET /` - Informações do sistema e lista de endpoints

### 🎭 Rotas de Mocking (`/api/mocks`) - **FUNCIONALIDADE PRINCIPAL**

#### 1. GET `/api/mocks/mockingpets`

- **Descrição**: Gera 100 pets mockados (migrado do endpoint original)
- **Resposta**: Array com pets gerados dinamicamente

#### 2. GET `/api/mocks/mockingusers`

- **Descrição**: Gera 50 usuários mockados
- **Características dos usuários gerados**:
  - Senha: "coder123" (encriptada com bcrypt)
  - Role: Varia entre "user" e "admin"
  - Pets: Array vazio
  - Formato compatível com MongoDB

#### 3. POST `/api/mocks/generateData`

- **Descrição**: Gera e insere dados na base de dados
- **Parâmetros**:
  ```json
  {
    "users": 10, // Número de usuários a gerar
    "pets": 20 // Número de pets a gerar
  }
  ```
- **Resposta**: Registros criados com informações de inserção

### Rotas de Usuários (`/api/users`)

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:uid` - Buscar usuário por ID
- `POST /api/users` - Criar usuário
- `PUT /api/users/:uid` - Atualizar usuário
- `DELETE /api/users/:uid` - Deletar usuário

### 🐾 Rotas de Pets (`/api/pets`)

- `GET /api/pets` - Listar todos os pets
- `GET /api/pets/:pid` - Buscar pet por ID
- `POST /api/pets` - Criar pet
- `PUT /api/pets/:pid` - Atualizar pet
- `DELETE /api/pets/:pid` - Deletar pet

### 🤝 Rotas de Adoções (`/api/adoptions`) - **NOVA FUNCIONALIDADE**

- `GET /api/adoptions` - Listar todas as adoções
- `GET /api/adoptions/:aid` - Buscar adoção por ID
- `POST /api/adoptions/:uid/:pid` - Criar adoção (usuário adota pet)
- `DELETE /api/adoptions/:uid/:pid` - Cancelar adoção
- `GET /api/adoptions/user/:uid` - Listar adoções de um usuário

## Exemplos de Uso

### 1. Gerar usuários mockados

```bash
curl http://localhost:8080/api/mocks/mockingusers
```

### 2. Gerar pets mockados

```bash
curl http://localhost:8080/api/mocks/mockingpets
```

### 3. Gerar e inserir dados na base

```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 5, "pets": 10}'
```

### 4. Verificar dados inseridos

```bash
# Verificar usuários
curl http://localhost:8080/api/users

# Verificar pets
curl http://localhost:8080/api/pets
```

### 5. Testar sistema de adoções

```bash
# Criar adoção (usuário adota pet)
curl -X POST http://localhost:8080/api/adoptions/USER_ID/PET_ID

# Listar adoções
curl http://localhost:8080/api/adoptions

# Listar adoções de um usuário
curl http://localhost:8080/api/adoptions/user/USER_ID
```

## 🧪 Testes

### Executar testes localmente:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm test -- --coverage
```

### Testes incluídos:

- ✅ **Testes funcionais completos** para router de adoções
- ✅ **Cobertura de todos os endpoints** de adoção
- ✅ **Casos de sucesso e erro** testados
- ✅ **Validações de parâmetros** testadas
- ✅ **Integração com MongoDB** em memória

## 🐳 Docker

### Comandos úteis:

```bash
# Build da imagem
docker build -t backend-iii-mocking .

# Executar com docker-compose
docker-compose up -d

# Ver logs
docker-compose logs app

# Parar containers
docker-compose down

# Build para DockerHub
./docker-build-push.sh  # Linux/Mac
./docker-build-push.ps1 # Windows PowerShell
```

### Variáveis de ambiente Docker:

- `NODE_ENV=production`
- `PORT=8080`
- `MONGODB_URI=mongodb://mongo:27017/backend-mocking`

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MongoDB**: Base de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **Faker.js**: Geração de dados falsos
- **bcrypt**: Encriptação de senhas
- **Swagger**: Documentação da API
- **Jest**: Framework de testes
- **Supertest**: Testes de API
- **Docker**: Containerização
- **Docker Compose**: Orquestração de containers

## Critérios Atendidos

✅ **Router Mocks**: Criado `mocks.router.js` com rota base `/api/mocks`

✅ **Migração do Endpoint**: `/mockingpets` migrado com sucesso para o router mocks

✅ **Módulo de Mocking**: Desenvolvido com geração de usuários conforme especificado:

- Senha "coder123" encriptada
- Role variando entre "user" e "admin"
- Array de pets vazio

✅ **Endpoint mockingusers**: Implementado para gerar 50 usuários

✅ **Endpoint generateData**: Implementado para receber parâmetros e inserir dados

✅ **Verificação**: Dados inseridos podem ser verificados via endpoints GET

## 🌐 Links Importantes

- **🐳 Docker Hub**: [vanessasdj/backend-iii-mocking](https://hub.docker.com/r/vanessasdj/backend-iii-mocking)
- **📚 Documentação Swagger**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **🌍 API Base URL**: [http://localhost:8080](http://localhost:8080)
- **🗄️ MongoDB Admin**: [http://localhost:8081](http://localhost:8081) (via docker-compose)

## ⚙️ Configuração

### Portas utilizadas:

- **8080**: Aplicação principal
- **27017**: MongoDB
- **8081**: MongoDB Express (admin interface)

### Variáveis de Ambiente:

- `NODE_ENV`: Ambiente de execução (development/production)
- `PORT`: Porta do servidor (padrão: 8080)
- `MONGODB_URI`: String de conexão do MongoDB

## 🎯 Status do Projeto

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Tests](https://img.shields.io/badge/Tests-Passing-green?logo=jest)
![Swagger](https://img.shields.io/badge/API-Documented-orange?logo=swagger)

**🏆 Status: PROJETO COMPLETO E DOCKERIZADO**
