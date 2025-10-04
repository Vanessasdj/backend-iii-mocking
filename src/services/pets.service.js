const Pet = require("../models/Pet");

class PetsService {
  async getPets() {
    try {
      const pets = await Pet.find().populate("owner");
      return pets;
    } catch (error) {
      throw new Error(`Erro ao buscar pets: ${error.message}`);
    }
  }

  async getPetById(id) {
    try {
      const pet = await Pet.findById(id).populate("owner");
      return pet;
    } catch (error) {
      throw new Error(`Erro ao buscar pet: ${error.message}`);
    }
  }

  async createPet(petData) {
    try {
      const pet = new Pet(petData);
      await pet.save();
      return pet;
    } catch (error) {
      throw new Error(`Erro ao criar pet: ${error.message}`);
    }
  }

  async createPets(petsData) {
    try {
      const pets = await Pet.insertMany(petsData);
      return pets;
    } catch (error) {
      throw new Error(`Erro ao criar pets: ${error.message}`);
    }
  }

  async updatePet(id, petData) {
    try {
      const pet = await Pet.findByIdAndUpdate(id, petData, { new: true });
      return pet;
    } catch (error) {
      throw new Error(`Erro ao atualizar pet: ${error.message}`);
    }
  }

  async deletePet(id) {
    try {
      await Pet.findByIdAndDelete(id);
      return { message: "Pet deletado com sucesso" };
    } catch (error) {
      throw new Error(`Erro ao deletar pet: ${error.message}`);
    }
  }
}

module.exports = new PetsService();
