#!/usr/bin/env node

/**
 * Arquivo principal para inicializar o servidor
 * Este arquivo fica na raiz e importa o app.js de dentro de /src
 */

const app = require("./src/app");

// O app.js já tem toda a lógica de inicialização,
// incluindo conexão com MongoDB e start do servidor
console.log("🚀 Iniciando Backend III - Sistema de Mocking...");
