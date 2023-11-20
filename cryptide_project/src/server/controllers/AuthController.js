const UserService = require('../services/UserService');
const DatabaseService = require('../services/DatabaseService');
const bcrypt = require('bcrypt');

const sqlite3 = require('sqlite3');

class AuthController {
  static async signUp(req, res) {
    const databaseService = new DatabaseService();
    const pseudo = req.body.pseudo;
    try {
        await databaseService.connect();

        // Vérifier que le pseudo n'existe pas déjà
        const verif = await databaseService.getUserByPseudo(pseudo);
        if (verif) {
            res.status(400).json({ error: 'Le pseudo est déjà utilisé.' });
            return;
        }

        // Créer un nouvel utilisateur
        const currentUser = await UserService.createUser(req.body);
        const insertedUser = await databaseService.insertUser(currentUser);
        
        const user = await databaseService.getUserByPseudo(pseudo);

        // Initialiser les stats de l'utilisateur
        await databaseService.initSoloStats(user.idUser);
        await databaseService.initOnlineStats(user.idUser);

        const soloStats = await databaseService.getSoloStatsByUserId(user.idUser);
        const onlineStats = await databaseService.getOnlineStatsByUserId(user.idUser);

        console.log(soloStats);
        console.log(onlineStats);

        await databaseService.updateUserIDStats(user.idUser, soloStats.idSoloStats, onlineStats.idOnlineStats);
        // Envoyer une réponse réussie
        res.status(201).json({ message: 'Inscription réussie', user: insertedUser});
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

        // Stocker l'utilisateur dans la session){
        console.log(req.session);
        req.session.user = user;

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

  static getSession(req, res) {
    console.log(req.session);
    // Vérifier si l'utilisateur est connecté
    if (req.session.user) {
        // Envoyer une réponse réussie
        res.status(200).json({ message: 'Utilisateur connecté', user: req.session.user });
    } else {
        // Envoyer une réponse d'erreur
        res.status(401).json({ error: 'Utilisateur non connecté' });
    }
  }
  
}

module.exports = AuthController;