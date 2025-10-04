# Backend III - Sistema de Mocking

## Descrição

Este projeto implementa um sistema de mocking para usuários e pets usando Node.js, Express e MongoDB. Ele permite gerar dados falsos para testes e desenvolvimento.

## Funcionalidades

- **Geração de Pets Mockados**: Endpoint para gerar pets com dados falsos
- **Geração de Usuários Mockados**: Endpoint para gerar usuários com senha encriptada
- **Inserção em Massa**: Endpoint para gerar e inserir dados diretamente na base de dados
- **CRUD Completo**: Operações básicas para usuários e pets

## Estrutura do Projeto

```
Backend III/
├── src/
│   ├── models/          # Modelos Mongoose
│   │   ├── User.js
│   │   └── Pet.js
│   ├── routes/          # Routers Express
│   │   ├── users.router.js
│   │   ├── pets.router.js
│   │   └── mocks.router.js
│   ├── services/        # Serviços de negócio
│   │   ├── users.service.js
│   │   └── pets.service.js
│   └── utils/           # Utilitários
│       └── mocking.js
├── app.js              # Arquivo principal
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (local ou remoto)

## Instalação

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

## Endpoints Principais

### Rotas de Mocking (`/api/mocks`)

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

### Rotas de Pets (`/api/pets`)

- `GET /api/pets` - Listar todos os pets
- `GET /api/pets/:pid` - Buscar pet por ID
- `POST /api/pets` - Criar pet
- `PUT /api/pets/:pid` - Atualizar pet
- `DELETE /api/pets/:pid` - Deletar pet

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

## Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MongoDB**: Base de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **Faker.js**: Geração de dados falsos
- **bcrypt**: Encriptação de senhas

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

## Porta Padrão

O servidor roda na porta **8080** por padrão. Acesse: http://localhost:8080

## Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 8080)
- `MONGODB_URI`: String de conexão do MongoDB (padrão: mongodb://localhost:27017/backend-mocking)
