const UserService = require('../services/UserService');
const DatabaseService = require('../services/DatabaseService');
const bcrypt = require('bcrypt');

class AuthController {
  static async signUp(req, res) {
    const databaseService = new DatabaseService();
    
    try {
        await databaseService.connect();

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

  static async signIn(req, res) {
    const databaseService = new DatabaseService();

    try{
        await databaseService.connect();

        // Vérifier que le pseudo existe
        const pseudo = req.body.pseudo;
        const user = await databaseService.getUserByPseudo(pseudo);
        if (!user) {
            res.status(400).json({ error: 'Le pseudo n\'existe pas.' });
            return;
        }

        // Vérifier que le mot de passe est correct
        const password = req.body.password;
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ error: 'Le mot de passe est incorrect.' });
            return;
        }

        // Stocker l'utilisateur dans la session
        if(!req.session.user && req.body.remember){
            req.session.user = user;
        }

        // Envoyer une réponse réussie
        res.status(200).json({ message: 'Connexion réussie', user: user });
    }
    catch(error){
        // Gérer les erreurs
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
    finally{
        await databaseService.disconnect();
    }
  }
}

module.exports = AuthController;