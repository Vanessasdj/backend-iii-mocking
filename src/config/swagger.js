const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Backend III - Sistema de Mocking API",
    version: "1.0.0",
    description: "API para gerenciamento de usuários, pets, mocking e adoções",
    contact: {
      name: "Backend III Project",
      email: "backend@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Servidor de desenvolvimento",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["first_name", "last_name", "email", "password"],
        properties: {
          _id: {
            type: "string",
            description: "ID único do usuário",
          },
          first_name: {
            type: "string",
            description: "Primeiro nome do usuário",
          },
          last_name: {
            type: "string",
            description: "Sobrenome do usuário",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
          },
          password: {
            type: "string",
            description: "Senha encriptada do usuário",
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            default: "user",
            description: "Papel do usuário no sistema",
          },
          pets: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Array de IDs dos pets adotados pelo usuário",
          },
        },
      },
      Pet: {
        type: "object",
        required: ["name", "specie", "birthDate"],
        properties: {
          _id: {
            type: "string",
            description: "ID único do pet",
          },
          name: {
            type: "string",
            description: "Nome do pet",
          },
          specie: {
            type: "string",
            description: "Espécie do pet",
          },
          birthDate: {
            type: "string",
            format: "date",
            description: "Data de nascimento do pet",
          },
          adopted: {
            type: "boolean",
            default: false,
            description: "Status de adoção do pet",
          },
          owner: {
            type: "string",
            description: "ID do usuário que adotou o pet",
          },
          image: {
            type: "string",
            description: "URL da imagem do pet",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "string",
            description: "Mensagem de erro",
          },
        },
      },
      Success: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          payload: {
            type: "object",
            description: "Dados retornados pela API",
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Caminho para os arquivos que contêm as anotações do Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
