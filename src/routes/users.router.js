const express = require("express");
const router = express.Router();
const usersService = require("../services/users.service");

// GET /api/users - Buscar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await usersService.getUsers();
    res.status(200).json({
      success: true,
      payload: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/users/:uid - Buscar usuário por ID
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/users - Criar usuário
router.post("/", async (req, res) => {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json({
      success: true,
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/users/:uid - Atualizar usuário
router.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.updateUser(uid, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/users/:uid - Deletar usuário
router.delete("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await usersService.deleteUser(uid);
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
