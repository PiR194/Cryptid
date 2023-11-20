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
}

module.exports = SessionController;