const bcrypt = require('bcrypt');

class UserService {
  static async createUser(userData) {
    console.log(userData)
    // Hacher le mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Retournez l'utilisateur créé
    return { pseudo: userData.pseudo, password: hashedPassword };
  }

  static async initUserStats(idUser) {
    return { nbGames: 0, nbWins: 0, ratio: 0.0, idUser: idUser };
  }
}

module.exports = UserService;
