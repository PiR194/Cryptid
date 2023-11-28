const DatabaseService = require('../services/DatabaseService');

class SessionController {
    static async getUserInformation(req, res) {
        const db = new DatabaseService();

        try{
            await db.connect();

            if (!req.session.user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            req.session.user.soloStats = await db.getSoloStatsByUserId(req.session.user.idUser);
            req.session.user.onlineStats = await db.getOnlineStatsByUserId(req.session.user.idUser);

            console.log(req.session.user);

            res.status(200).json({ user: req.session.user });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async UpdatePseudo(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = db.getUserByPseudo(req.body.pseudo);
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.updatePseudo(user.idUser, req.body.newPseudo); //* update

            const updatedUser = db.getUserByPseudo(req.body.newPseudo);

            req.session.user.pseudo = updatedUser.pseudo;
            
            res.status(200).json({ user: req.session.user }); //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification du pseudo de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }
}

module.exports = SessionController;