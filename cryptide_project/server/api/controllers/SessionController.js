const path = require('path');
const DatabaseService = require(path.resolve(__dirname, '../services/DatabaseService'));

const ENIGME_FACILE = "enigme_facile";
const ENIGME_MOYEN = "enigme_moyenne";
const ENIGME_DIFFICILE = "enigme_difficile";

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

            // Récupérer les stats mastermind de l'utilisateur
            let [nbGamesMM, i] = await db.getNbGamesMastermindByUserId(req.session.user.idUser);
            nbGamesMM = nbGamesMM.nbGames || 0;
            let [bestScoreMM, j] = await db.getBestScoreMastermindByUserId(req.session.user.idUser);
            bestScoreMM = bestScoreMM.bestScore || 0;
            let [avgNbTryMM, k] = await db.getAvgNbTryMastermindByUserId(req.session.user.idUser);
            avgNbTryMM = avgNbTryMM.avgNbTry || 0;

            req.session.user.mastermindStats = {nbGames: nbGamesMM, 
                                                bestScore: bestScoreMM, 
                                                avgNbTry: avgNbTryMM};

            // Récupérer les stats enigme facile
            let [nbGamesEF, l] = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE);
            nbGamesEF = nbGamesEF.nbGames || 0;
            let [nbWinsEF, m] = await db.getNbWinsEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE);
            nbWinsEF = nbWinsEF.nbWins || 0;
            let ratioEF = (nbWinsEF.nbWins / nbGamesEF.nbGames) * 100 || 0;
            let [bestTimeEF, n] = await db.getBestTimeEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE);
            bestTimeEF = bestTimeEF.bestTime || 0;
            let [avgTimeEF, o] = await db.getAvgTimeEnigmeByUserId(req.session.user.idUser, ENIGME_FACILE);
            avgTimeEF = avgTimeEF.avgTime || 0;

            req.session.user.easyEnigmaStats = {nbGames: nbGamesEF,
                                                    nbWins: nbWinsEF,
                                                    ratio: ratioEF,
                                                    bestTime: bestTimeEF,
                                                    avgTime: avgTimeEF};

            // Récupérer les stats enigme moyenne
            let [nbGamesEM, p] = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN);
            nbGamesEM = nbGamesEM.nbGames || 0;
            let [bestScoreEM, q] = await db.getBestScoreEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN);
            bestScoreEM = bestScoreEM.bestScore || 0;
            let [avgNbTryEM, r] = await db.getAvgScoreEnigmeByUserId(req.session.user.idUser, ENIGME_MOYEN);
            avgNbTryEM = avgNbTryEM.avgScore || 0;

            req.session.user.mediumEnigmaStats = {nbGames: nbGamesEM,
                                                    bestScore: bestScoreEM,
                                                    avgNbTry: avgNbTryEM};
            
            // Récupérer les stats enigme difficile
            let [nbGamesED, s] = await db.getNbGamesEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE);
            nbGamesED = nbGamesED.nbGames || 0;
            let [nbWinsED, t] = await db.getNbWinsEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE);
            nbWinsED = nbWinsED.nbWins || 0;
            let ratioED = (nbWinsED.nbWins / nbGamesED.nbGames) * 100 || 0;
            let [bestTimeED, u] = await db.getBestTimeEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE);
            bestTimeED = bestTimeED.bestTime || 0;
            let [avgTimeED, v] = await db.getAvgTimeEnigmeByUserId(req.session.user.idUser, ENIGME_DIFFICILE);
            avgTimeED = avgTimeED.avgTime || 0;

            req.session.user.hardEnigmaStats = {nbGames: nbGamesED,
                                                    nbWins: nbWinsED,
                                                    ratio: ratioED,
                                                    bestTime: bestTimeED,
                                                    avgTime: avgTimeED};

            // Récupérer les stats en ligne de l'utilisateur
            let [nbGamesOL, w] = await db.getNbGamesOnlineByUserId(req.session.user.idUser);
            nbGamesOL = nbGamesOL.nbGames || 0;
            let [nbWinsOL, x] = await db.getNbWinsOnlineByUserId(req.session.user.idUser);
            nbWinsOL = nbWinsOL.nbWins || 0;
            let ratioOL = (nbWinsOL.nbWins / nbGamesOL.nbGames) * 100 || 0;
            req.session.user.onlineStats = {nbGames: nbGamesOL, 
                                            nbWins: nbWinsOL, 
                                            ratio: ratioOL};
            
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

            const [user, _] = await db.getUserByPseudo(req.body.pseudo);
            console.log("utilisateur" + user.idUser + " pseudo" + user.pseudo)
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.updatePseudo(user.idUser, req.body.newPseudo);     //* update

            const [updatedUser, fields] = await db.getUserByPseudo(req.body.newPseudo);
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

    static async addMastermindStats(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.addMastermindStats(user.idUser, req.body.score, req.body.time);

            res.status(200).json({ user: req.session.user });   //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification des stats mastermind de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async addEasyEnigmaStats(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.addEasyEnigmaStats(user.idUser, ENIGME_FACILE, req.body.win, req.body.time);

            res.status(200).json({ user: req.session.user });   //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification des stats de l\'énigme facile de l\'utilisateur.' });
        }
        finally{
            await db.disconnect();
        }
    }

    // static async addMediumEnigmaStats(req, res)

    static async addHardEnigmaStats(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const user = await db.getUserByPseudo(req.body.pseudo);
            if (!user) {
                res.status(200).json({ error: "true", message: 'User not found' });
                return;
            }

            await db.addHardEnigmaStats(user.idUser, ENIGME_DIFFICILE, req.body.win, req.body.time);

            res.status(200).json({ user: req.session.user });   //verif rep
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification des stats de l\'énigme difficile de l\'utilisateur.' });
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