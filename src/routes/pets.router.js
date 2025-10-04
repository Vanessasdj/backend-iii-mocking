const express = require("express");
const router = express.Router();
const petsService = require("../services/pets.service");

// GET /api/pets - Buscar todos os pets
router.get("/", async (req, res) => {
  try {
    const pets = await petsService.getPets();
    res.status(200).json({
      success: true,
      payload: pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/pets/:pid - Buscar pet por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const pet = await petsService.getPetById(pid);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Pet não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      payload: pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/pets - Criar pet
router.post("/", async (req, res) => {
  try {
    const pet = await petsService.createPet(req.body);
    res.status(201).json({
      success: true,
      payload: pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/pets/:pid - Atualizar pet
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const pet = await petsService.updatePet(pid, req.body);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Pet não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      payload: pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/pets/:pid - Deletar pet
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await petsService.deletePet(pid);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
