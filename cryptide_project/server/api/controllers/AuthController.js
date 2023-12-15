const bcrypt = require('bcrypt');
const path = require('path');
const DatabaseService = require(path.resolve(__dirname, '../services/DatabaseService.js'));
const UserService = require(path.resolve(__dirname, '../services/UserService.js'));

class AuthController {
    static async signUp(req, res) {
        const databaseService = new DatabaseService();
        const pseudo = req.body.pseudo;
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();

        try {
            await databaseService.connect();
            console.log("Test: ")
            console.log(req.body)

            // Vérifier que le pseudo n'existe pas déjà
            const [verif, fields] = await databaseService.getUserByPseudo(pseudo);
            if (verif) {
                res.status(400).json({ error: 'Le pseudo est déjà utilisé.' });
                return;
            }

            // Créer un nouvel utilisateur
            const currentUser = await UserService.createUser(req.body);
            const insertedUser = await databaseService.insertUser(currentUser);
            
            const user = await databaseService.getUserByPseudo(pseudo);
            
            console.log("[" + hour + ":" + minutes + "] " + user.pseudo + " have been registered.");
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
    console.log(req.url)
    const databaseService = new DatabaseService();
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    try{
        await databaseService.connect();

        // Vérifier que le pseudo existe
        const pseudo = req.body.pseudo;
        const [user, fields] = await databaseService.getUserByPseudo(pseudo);
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

        // Stocker l'utilisateur dans la session)
        req.session.user = user;

        // Envoyer une réponse réussie
        console.log("[" + hour + ":" + minutes + "] " + user.pseudo + " have been connected.");
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

  static async logout(req, res) {
    const pseudo = req.session.user.pseudo;
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    // Détruire la session pour déconnecter l'utilisateur
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
            } else {
                console.log("[" + hour + ":" + minutes + "] " + pseudo + " have been disconnected.");
                res.status(200).json({ message: 'Déconnexion réussie' });
            }
        });
    }

    static async delAccount(req, res){
        const db = new DatabaseService();
        try{
            await db.connect();

            const [user, fields] = await db.getUserByPseudo(req.body.pseudo);
            
            if(!user){
                res.status(400).json({ error: 'Le pseudo n\'existe pas.' });
                return;
            }
            
            await db.deleteUser(user.idUser);
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la supression du compte.' });
        }
        finally{
            db.disconnect();
        }
    }

    static async validatePassword(req, res){
        const db = new DatabaseService();
        try{
            await db.connect();

            const [user, fields] = await db.getUserByPseudo(req.body.pseudo);
            if(!user){
                res.status(400).json({ error: 'Le pseudo n\'existe pas.' });
                return;
            }

            const password = req.body.password;
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword){
                res.status(400).json({ error: 'Le mot de passe est incorrect.' });
                return;
            }

            res.status(200).json({ message: 'Mot de passe correct.' });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe.' });
        }
        finally{
            db.disconnect();
        }
    }

    static async updatePassword(req, res){
        const db = new DatabaseService();
        try{
            await db.connect();

            const [user, fields] = await db.getUserByPseudo(req.body.pseudo);
            if(!user){
                res.status(400).json({ error: 'Le pseudo n\'existe pas.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

            await db.updatePassword(user.idUser, hashedPassword);

            res.status(200).json({ message: 'Mot de passe mis à jour.' });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe.' });
        }
        finally{
            db.disconnect();
        }
    }


    static async getUsers(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const users = await db.getUsers()[0];
            console.log(users)

            res.status(200).json({ tab : users });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats users.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async getGames(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const users = await db.getGames()[0];
            console.log(users)

            res.status(200).json({ tab : users });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats games.' });
        }
        finally{
            await db.disconnect();
        }
    }
}

module.exports = AuthController;