const { faker } = require("@faker-js/faker");

class MockingService {
  // Função para gerar pets mockados
  generateMockPets(count = 100) {
    const pets = [];
    const species = [
      "dog",
      "cat",
      "bird",
      "rabbit",
      "hamster",
      "fish",
      "turtle",
    ];

    for (let i = 0; i < count; i++) {
      const pet = {
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(species),
        birthDate: faker.date.past({ years: 10 }),
        adopted: faker.datatype.boolean(),
        owner: null,
        image: faker.image.url({ width: 300, height: 300 }),
      };
      pets.push(pet);
    }

    return pets;
  }

  // Função para gerar usuários mockados
  generateMockUsers(count = 50) {
    const users = [];

    for (let i = 0; i < count; i++) {
      const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password:
          "$2b$10$Tzy2gUPntHqZfycKYsyoxOtffDVyS6KYp1Cvkz6MK7xwJkHCGn/T.", // "coder123" encriptado
        role: faker.helpers.arrayElement(["user", "admin"]),
        pets: [], // Array vazio como especificado
      };
      users.push(user);
    }

    return users;
  }
}

module.exports = new MockingService();
