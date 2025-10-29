const User = require("../models/User");

class UsersService {
  async getUsers() {
    try {
      const users = await User.find().populate("pets");
      return users;
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id).populate("pets");
      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async createUsers(usersData) {
    try {
      const users = await User.insertMany(usersData);
      return users;
    } catch (error) {
      throw new Error(`Erro ao criar usuários: ${error.message}`);
    }
  }

  async updateUser(id, userData) {
    try {
      const user = await User.findByIdAndUpdate(id, userData, {
        new: true,
      }).populate("pets");
      return user;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      await User.findByIdAndDelete(id);
      return { message: "Usuário deletado com sucesso" };
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = new UsersService();
