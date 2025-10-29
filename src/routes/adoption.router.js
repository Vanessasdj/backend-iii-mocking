const express = require("express");
const router = express.Router();
const usersService = require("../services/users.service");
const petsService = require("../services/pets.service");
const mongoose = require("mongoose");

// GET /api/adoptions - Listar todas as adoções
router.get("/", async (req, res) => {
  try {
    // Buscar pets que foram adotados (têm owner)
    const adoptedPets = await petsService.getPets();
    const adoptions = adoptedPets.filter((pet) => pet.adopted && pet.owner);

    res.status(200).json({
      success: true,
      payload: adoptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/adoptions/:aid - Buscar adoção por ID
router.get("/:aid", async (req, res) => {
  try {
    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({
        success: false,
        error: "ID de adoção inválido",
      });
    }

    const adoption = await petsService.getPetById(aid);

    if (!adoption || !adoption.adopted) {
      return res.status(404).json({
        success: false,
        error: "Adoção não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      payload: adoption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/adoptions/:uid/:pid - Criar adoção (usuário adota pet)
router.post("/:uid/:pid", async (req, res) => {
  try {
    const { uid, pid } = req.params;

    // Validar IDs
    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res.status(400).json({
        success: false,
        error: "IDs de usuário ou pet inválidos",
      });
    }

    // Verificar se usuário existe
    const user = await usersService.getUserById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se pet existe
    const pet = await petsService.getPetById(pid);
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Pet não encontrado",
      });
    }

    // Verificar se pet já foi adotado
    if (pet.adopted) {
      return res.status(400).json({
        success: false,
        error: "Pet já foi adotado",
      });
    }

    // Atualizar pet para adotado
    const updatedPet = await petsService.updatePet(pid, {
      adopted: true,
      owner: uid,
    });

    // Adicionar pet ao array de pets do usuário
    const updatedUser = await usersService.updateUser(uid, {
      $push: { pets: pid },
    });

    res.status(201).json({
      success: true,
      message: "Adoção realizada com sucesso",
      payload: {
        adoption: updatedPet,
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/adoptions/:uid/:pid - Cancelar adoção
router.delete("/:uid/:pid", async (req, res) => {
  try {
    const { uid, pid } = req.params;

    // Validar IDs
    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res.status(400).json({
        success: false,
        error: "IDs de usuário ou pet inválidos",
      });
    }

    // Verificar se usuário existe
    const user = await usersService.getUserById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se pet existe
    const pet = await petsService.getPetById(pid);
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Pet não encontrado",
      });
    }

    // Verificar se o pet realmente pertence ao usuário
    const petOwnerId =
      pet.owner && pet.owner._id
        ? pet.owner._id.toString()
        : pet.owner
        ? pet.owner.toString()
        : null;

    if (!pet.adopted || !pet.owner || petOwnerId !== uid) {
      return res.status(400).json({
        success: false,
        error: "Este pet não foi adotado por este usuário",
      });
    }

    // Atualizar pet para não adotado
    const updatedPet = await petsService.updatePet(pid, {
      adopted: false,
      owner: null,
    });

    // Remover pet do array de pets do usuário
    const updatedUser = await usersService.updateUser(uid, {
      $pull: { pets: pid },
    });

    res.status(200).json({
      success: true,
      message: "Adoção cancelada com sucesso",
      payload: {
        pet: updatedPet,
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/adoptions/user/:uid - Listar adoções de um usuário específico
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({
        success: false,
        error: "ID de usuário inválido",
      });
    }

    const user = await usersService.getUserById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Buscar pets adotados pelo usuário
    const userPets = [];
    for (const petId of user.pets) {
      const pet = await petsService.getPetById(petId);
      if (pet && pet.adopted) {
        userPets.push(pet);
      }
    }

    res.status(200).json({
      success: true,
      payload: userPets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
