const express = require("express");
const router = express.Router();
const mockingService = require("../utils/mocking");
const usersService = require("../services/users.service");
const petsService = require("../services/pets.service");

// GET /api/mocks/mockingpets - Gerar pets mockados (migrado do pets router)
router.get("/mockingpets", async (req, res) => {
  try {
    const mockPets = mockingService.generateMockPets(100);
    res.status(200).json({
      success: true,
      payload: mockPets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/mocks/mockingusers - Gerar 50 usuários mockados
router.get("/mockingusers", async (req, res) => {
  try {
    const mockUsers = mockingService.generateMockUsers(50);
    res.status(200).json({
      success: true,
      payload: mockUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/mocks/generateData - Gerar e inserir dados na base de dados
router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    // Validar parâmetros
    if (
      !Number.isInteger(users) ||
      !Number.isInteger(pets) ||
      users < 0 ||
      pets < 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Os parâmetros "users" e "pets" devem ser números inteiros não negativos',
      });
    }

    const results = {
      usersCreated: 0,
      petsCreated: 0,
      users: [],
      pets: [],
    };

    // Gerar e inserir usuários se solicitado
    if (users > 0) {
      const mockUsers = mockingService.generateMockUsers(users);
      const createdUsers = await usersService.createUsers(mockUsers);
      results.usersCreated = createdUsers.length;
      results.users = createdUsers;
    }

    // Gerar e inserir pets se solicitado
    if (pets > 0) {
      const mockPets = mockingService.generateMockPets(pets);
      const createdPets = await petsService.createPets(mockPets);
      results.petsCreated = createdPets.length;
      results.pets = createdPets;
    }

    res.status(201).json({
      success: true,
      message: `Dados gerados com sucesso: ${results.usersCreated} usuários e ${results.petsCreated} pets`,
      payload: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
