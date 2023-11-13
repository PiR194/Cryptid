const bcrypt = require('bcrypt');

class UserService {
  static async createUser(userData) {
    // Hacher le mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Retournez l'utilisateur créé
    return { pseudo: userData.pseudo, password: hashedPassword };
  }
}

module.exports = UserService;
