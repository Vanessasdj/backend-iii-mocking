const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");

// Configuração do Jest para MongoDB em memória
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Fechar conexão existente se houver
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Limpar todas as collections antes de cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe("Adoption Router Tests", () => {
  let userId;
  let petId;
  let adoptedPetId;

  beforeEach(async () => {
    // Criar usuário de teste
    const userResponse = await request(app).post("/api/users").send({
      first_name: "João",
      last_name: "Silva",
      email: "joao@test.com",
      password: "senha123",
      role: "user",
    });

    userId = userResponse.body.payload._id;

    // Criar pet de teste
    const petResponse = await request(app).post("/api/pets").send({
      name: "Rex",
      specie: "dog",
      birthDate: "2020-01-01T00:00:00.000Z",
      adopted: false,
    });

    petId = petResponse.body.payload._id;

    // Criar pet já adotado para testes
    const adoptedPetResponse = await request(app).post("/api/pets").send({
      name: "Luna",
      specie: "cat",
      birthDate: "2019-01-01T00:00:00.000Z",
      adopted: true,
      owner: userId,
    });

    adoptedPetId = adoptedPetResponse.body.payload._id;
  });

  describe("GET /api/adoptions", () => {
    it("should return all adoptions", async () => {
      const response = await request(app).get("/api/adoptions").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("payload");
      expect(Array.isArray(response.body.payload)).toBe(true);
    });

    it("should return adoptions with adopted pets only", async () => {
      const response = await request(app).get("/api/adoptions").expect(200);

      const adoptions = response.body.payload;
      adoptions.forEach((adoption) => {
        expect(adoption.adopted).toBe(true);
        expect(adoption.owner).toBeTruthy();
      });
    });
  });

  describe("GET /api/adoptions/:aid", () => {
    it("should return specific adoption by ID", async () => {
      const response = await request(app)
        .get(`/api/adoptions/${adoptedPetId}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body.payload).toHaveProperty("_id", adoptedPetId);
      expect(response.body.payload).toHaveProperty("adopted", true);
    });

    it("should return 400 for invalid adoption ID", async () => {
      const response = await request(app)
        .get("/api/adoptions/invalid-id")
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "ID de adoção inválido");
    });

    it("should return 404 for non-existent adoption", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Adoção não encontrada");
    });

    it("should return 404 for non-adopted pet", async () => {
      const response = await request(app)
        .get(`/api/adoptions/${petId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Adoção não encontrada");
    });
  });

  describe("POST /api/adoptions/:uid/:pid", () => {
    it("should create adoption successfully", async () => {
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Adoção realizada com sucesso"
      );
      expect(response.body.payload.adoption).toHaveProperty("adopted", true);
      expect(response.body.payload.adoption).toHaveProperty("owner", userId);
    });

    it("should return 400 for invalid user ID", async () => {
      const response = await request(app)
        .post(`/api/adoptions/invalid-id/${petId}`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "error",
        "IDs de usuário ou pet inválidos"
      );
    });

    it("should return 400 for invalid pet ID", async () => {
      const response = await request(app)
        .post(`/api/adoptions/${userId}/invalid-id`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "error",
        "IDs de usuário ou pet inválidos"
      );
    });

    it("should return 404 for non-existent user", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/adoptions/${fakeUserId}/${petId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Usuário não encontrado");
    });

    it("should return 404 for non-existent pet", async () => {
      const fakePetId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${fakePetId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Pet não encontrado");
    });

    it("should return 400 when trying to adopt already adopted pet", async () => {
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${adoptedPetId}`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Pet já foi adotado");
    });
  });

  describe("DELETE /api/adoptions/:uid/:pid", () => {
    beforeEach(async () => {
      // Garantir que o pet não esteja adotado antes do teste
      const Pet = require("../src/models/Pet");
      await Pet.findByIdAndUpdate(petId, { adopted: false, owner: null });

      // Garantir que temos uma adoção válida para testar
      await request(app).post(`/api/adoptions/${userId}/${petId}`).expect(201);
    });

    it("should cancel adoption successfully", async () => {
      const response = await request(app)
        .delete(`/api/adoptions/${userId}/${petId}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Adoção cancelada com sucesso"
      );
      expect(response.body.payload.pet).toHaveProperty("adopted", false);
      expect(response.body.payload.pet).toHaveProperty("owner", null);
    });

    it("should return 400 for invalid user ID", async () => {
      const response = await request(app)
        .delete(`/api/adoptions/invalid-id/${petId}`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "error",
        "IDs de usuário ou pet inválidos"
      );
    });

    it("should return 400 for invalid pet ID", async () => {
      const response = await request(app)
        .delete(`/api/adoptions/${userId}/invalid-id`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "error",
        "IDs de usuário ou pet inválidos"
      );
    });

    it("should return 404 for non-existent user", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/adoptions/${fakeUserId}/${petId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Usuário não encontrado");
    });

    it("should return 404 for non-existent pet", async () => {
      const fakePetId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/adoptions/${userId}/${fakePetId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Pet não encontrado");
    });

    it("should return 400 when trying to cancel adoption that does not belong to user", async () => {
      // Criar outro usuário
      const userResponse2 = await request(app).post("/api/users").send({
        first_name: "Maria",
        last_name: "Santos",
        email: "maria@test.com",
        password: "senha123",
        role: "user",
      });

      const userId2 = userResponse2.body.payload._id;

      const response = await request(app)
        .delete(`/api/adoptions/${userId2}/${petId}`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "error",
        "Este pet não foi adotado por este usuário"
      );
    });
  });

  describe("GET /api/adoptions/user/:uid", () => {
    beforeEach(async () => {
      // Realizar uma adoção para testar
      await request(app).post(`/api/adoptions/${userId}/${petId}`).expect(201);
    });

    it("should return adoptions for specific user", async () => {
      const response = await request(app)
        .get(`/api/adoptions/user/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("payload");
      expect(Array.isArray(response.body.payload)).toBe(true);
      expect(response.body.payload.length).toBeGreaterThan(0);

      response.body.payload.forEach((pet) => {
        expect(pet.adopted).toBe(true);
        expect(pet.owner._id || pet.owner).toBe(userId);
      });
    });

    it("should return 400 for invalid user ID", async () => {
      const response = await request(app)
        .get("/api/adoptions/user/invalid-id")
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "ID de usuário inválido");
    });

    it("should return 404 for non-existent user", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/adoptions/user/${fakeUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Usuário não encontrado");
    });

    it("should return empty array for user with no adoptions", async () => {
      // Criar novo usuário sem adoções
      const userResponse = await request(app).post("/api/users").send({
        first_name: "Carlos",
        last_name: "Oliveira",
        email: "carlos@test.com",
        password: "senha123",
        role: "user",
      });

      const newUserId = userResponse.body.payload._id;

      const response = await request(app)
        .get(`/api/adoptions/user/${newUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body.payload).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    it("should handle server errors gracefully", async () => {
      // Mock para simular erro do servidor
      jest.spyOn(console, "error").mockImplementation(() => {});

      // Este teste pode variar dependendo de como você queira simular erros do servidor
      // Por exemplo, você pode mockar o service ou o banco de dados

      console.error.mockRestore();
    });
  });
});
