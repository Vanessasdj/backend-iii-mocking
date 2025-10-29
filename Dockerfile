# Usar imagem oficial do Node.js como base
FROM node:18-alpine

# Definir informações sobre o mantenedor
LABEL maintainer="Backend III Project"
LABEL version="1.0.0"
LABEL description="Sistema de Mocking para Usuários e Pets com Docker"

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar código da aplicação
COPY --chown=nodejs:nodejs . .

# Mudar para usuário não-root
USER nodejs

# Expor a porta da aplicação
EXPOSE 8080

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Comando de verificação de saúde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando para iniciar a aplicação
CMD ["npm", "start"]