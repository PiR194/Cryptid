const UserService = require('../services/UserService');
const DatabaseService = require('../services/DatabaseService');

class AuthController {
  static async signUp(req, res) {
    const databaseService = new DatabaseService();
    
    try {
        await databaseService.connect();

        // Validation côté serveur (vous pouvez utiliser express-validator ici)
        // Vérifier que le pseudo n'est pas déjà utilisé
        const pseudo = req.body.pseudo;
        const verifUser = await databaseService.getUserByPseudo(pseudo);
        if (verifUser) {
            res.status(400).json({ error: 'Le pseudo est déjà utilisé.' });
            return;
        }

        // Créer un nouvel utilisateur
        const currentUser = await UserService.createUser(req.body);
        const insertedUser = await databaseService.insertUser(currentUser);

        // Envoyer une réponse réussie
        res.status(201).json({ message: 'Inscription réussie', user: insertedUser });
    } 
    catch (error) {
        // Gérer les erreurs
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    } 
    finally {
        await databaseService.disconnect();
    }
  }
}

module.exports = AuthController;