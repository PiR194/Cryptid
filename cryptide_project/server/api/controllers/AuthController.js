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
    const databaseService = new DatabaseService();
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

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

            const user = await db.getUserByPseudo(req.body.pseudo);
            
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


    static async UpdateMDP(req, res){
        console.log("UpdateMDP");
        // const db = new DatabaseService();

        // try{
        //     await db.connect();

        //     const user = await db.getUserByPseudo(req.body.pseudo);
        //     console.log("utilisateur" + user.idUser + " pseudo" + user.pseudo)
        //     if (!user) {
        //         res.status(200).json({ error: "true", message: 'User not found' });
        //         return;
        //     }

        //     await db.updatePseudo(user.idUser, req.body.newPseudo); //* update

        //     const updatedUser = await db.getUserByPseudo(req.body.newPseudo);
        //     console.log("updaetdutilisateur" + updatedUser.idUser + " pseudo" + updatedUser.pseudo)
        //     req.session.user.pseudo = updatedUser.pseudo;
        //     console.log("req.session.user.pseudo" + req.session.user.pseudo)
        //     res.status(200).json({ user: req.session.user }); //verif rep
        // }
        // catch(error){
        //     console.error(error);
        //     res.status(500).json({ error: 'Erreur lors de la modification du pseudo de l\'utilisateur.' });
        // }
        // finally{
        //     await db.disconnect();
        // }
    }
}

module.exports = AuthController;