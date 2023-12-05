const path = require('path');
const DatabaseService = require(path.resolve(__dirname, '../services/DatabaseService'));

class SessionController {
    static async getUserInformation(req, res) {
        const ENIGME_FACILE = "enigme_facile";
        const ENIGME_MOYEN = "enigme_moyenne";
        const ENIGME_DIFFICILE = "enigme_difficile";
        
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

            // Récupérer les stats mastermind de l'utilisateur
            const nbGamesMM = await db.getNbGamesMastermindByUserId(req.session.user.idUser) || 0;
            const bestScoreMM = await db.getBestScoreMastermindByUserId(req.session.user.idUser) || 0;
            const avgNbTryMM = await db.getAvgNbTryMastermindByUserId(req.session.user.idUser) || 0;
            req.session.user.mastermindStats = {nbGames: nbGamesMM.nbGames, 
                                                bestScore: bestScoreMM.bestScore, 
                                                avgNbTry: avgNbTryMM.avgNbTry};

            // Récupérer les stats enigme facile
            const nbGamesEF = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE) || 0;
            const nbWinsEF = await db.getNbWinsEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE) || 0;
            const ratioEF = (nbWinsEF.nbWins / nbGamesEF.nbGames) * 100 || 0;
            const bestTimeEF = await db.getBestTimeEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE) || 0;
            const avgTimeEF = await db.getAvgTimeEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE) || 0;

            req.session.user.easyEnigmaStats = {nbGames: nbGamesEF.nbGames,
                                                    nbWins: nbWinsEF.nbWins,
                                                    ratio: ratioEF,
                                                    bestTime: bestTimeEF.bestTime,
                                                    avgTime: avgTimeEF.avgTime};

            // Récupérer les stats enigme moyenne
            const nbGamesEM = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN) || 0;
            const bestScoreEM = await db.getBestScoreEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN) || 0;
            const avgNbTryEM = await db.getAvgScoreEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN) || 0;

            req.session.user.mediumEnigmaStats = {nbGames: nbGamesEM.nbGames,
                                                    bestScore: bestScoreEM.bestScore,
                                                    avgNbTry: avgNbTryEM.avgScore};
            
            // Récupérer les stats enigme difficile
            const nbGamesED = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE) || 0;
            const nbWinsED = await db.getNbWinsEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE) || 0;
            const ratioED = (nbWinsED.nbWins / nbGamesED.nbGames) * 100 || 0;
            const bestTimeED = await db.getBestTimeEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE) || 0;
            const avgTimeED = await db.getAvgTimeEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE) || 0;

            req.session.user.hardEnigmaStats = {nbGames: nbGamesED.nbGames,
                                                    nbWins: nbWinsED.nbWins,
                                                    ratio: ratioED,
                                                    bestTime: bestTimeED.bestTime,
                                                    avgTime: avgTimeED.avgTime};

            // Récupérer les stats en ligne de l'utilisateur
            const nbGamesOL = await db.getNbGamesOnlineByUserId(req.session.user.idUser) || 0;
            const nbWinsOL = await db.getNbWinsOnlineByUserId(req.session.user.idUser) || 0;
            const ratioOL = (nbWinsOL.nbWins / nbGamesOL.nbGames) * 100 || 0;
            req.session.user.onlineStats = {nbGames: nbGamesOL.nbGames, 
                                            nbWins: nbWinsOL.nbWins, 
                                            ratio: ratioOL};
            

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

            await db.updatePseudo(user.idUser, req.body.newPseudo);     //* update

            const updatedUser = await db.getUserByPseudo(req.body.newPseudo);
            console.log("updaetdutilisateur" + updatedUser.idUser + " pseudo" + updatedUser.pseudo)
            req.session.user.pseudo = updatedUser.pseudo;
            console.log("req.session.user.pseudo" + req.session.user.pseudo)
            res.status(200).json({ user: req.session.user });   //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification du pseudo de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async addOnlineStats(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.addOnlineStats(user.idUser, req.body.win, req.body.time);

            const updatedUser = await db.getUserByPseudo(req.body.pseudo);
            req.session.user.onlineStats.nbGames = updatedUser.nbGames;
            req.session.user.onlineStats.nbWins = updatedUser.nbWins;
            req.session.user.onlineStats.ratio = updatedUser.ratio;
            
            res.status(200).json({ user: req.session.user });   //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification des stats en ligne de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }
}

module.exports = SessionController;