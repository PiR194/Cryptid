const DatabaseService = require('../services/DatabaseService');

class SessionController {
    static async getUserInformation(req, res) {
        const db = new DatabaseService();
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();

        try{
            await db.connect();

            if (!req.session.user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            req.session.user.soloStats = await db.getSoloStatsByUserId(req.session.user.idUser);
            req.session.user.onlineStats = await db.getOnlineStatsByUserId(req.session.user.idUser);

            console.log("[" + hour + ":" + minutes + "] " + req.session.user.pseudo + " have a session.");
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
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();

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

            await db.updateSoloStats(user.idUser, req.body.nbGames, req.body.bestScore, req.body.avgNbTry);

            const newSoloStats = await db.getSoloStatsByUserId(user.idUser);

            req.session.user.soloStats = newSoloStats;

            console.log("[" + hour + ":" + minutes + "] " + req.session.user.pseudo + "'s solot_stats are updated.");
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
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();

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

            req.session.user.onlineStats = newOnlineStats;

            console.log("[" + hour + ":" + minutes + "] " + req.session.user.pseudo + "'s online_stats are updated.");
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

    static async UpdatePseudo(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);
            console.log("utilisateur" + user.idUser + " pseudo" + user.pseudo)
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.updatePseudo(user.idUser, req.body.newPseudo); //* update

            const updatedUser = await db.getUserByPseudo(req.body.newPseudo);
            console.log("updaetdutilisateur" + updatedUser.idUser + " pseudo" + updatedUser.pseudo)
            req.session.user.pseudo = updatedUser.pseudo;
            console.log("req.session.user.pseudo" + req.session.user.pseudo)
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