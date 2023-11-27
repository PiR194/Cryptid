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

    static async updateSoloStats(req, res) {
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);

            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            const soloStats = await db.getSoloStatsByUserId(user.idUser);

            if (!soloStats) {
                res.status(200).json({ error: "true", message: 'Solo stats not found' });
                return;
            }

            await db.updateSoloStatsByUserId(user.idUser, req.body.nbGames, req.body.bestScore, req.body.avgNbTry);

            const newSoloStats = await db.getSoloStatsByUserId(user.idUser);

            req.session.user.soloStats = newSoloStats;

            res.status(200).json({ user: req.session.user });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour des statistiques solo.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async updateOnlineStats(req, res) {
        const db = new DatabaseService();

        console.log(req.body);

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);

            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            const onlineStats = await db.getOnlineStatsByUserId(user.idUser);

            if (!onlineStats) {
                res.status(200).json({ error: "true", message: 'Online stats not found' });
                return;
            }

            await db.updateOnlineStats(user.idUser, req.body.nbGames, req.body.nbWins, req.body.ratio);

            const newOnlineStats = await db.getOnlineStatsByUserId(user.idUser);

            console.log(req.session.user);
            req.session.user.onlineStats = newOnlineStats;

            res.status(200).json({ user: req.session.user });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour des statistiques en ligne.' });
        }
        finally{
            await db.disconnect();
        }
    }
}

module.exports = SessionController;