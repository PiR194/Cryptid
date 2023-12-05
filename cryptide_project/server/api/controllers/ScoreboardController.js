const path = require('path');
const DatabaseService = require(path.resolve(__dirname, '../services/DatabaseService'));

const ENIGME_FACILE = "enigme_facile";
const ENIGME_MOYEN = "enigme_moyenne";
const ENIGME_DIFFICILE = "enigme_difficile";

class SessionController {
    static async getDailyMastermind(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const dailyMastermindStats = await db.getDailyMastermindStats();

            res.status(200).json({ dailyMastermindStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération du scoreboard.' });
        }
        finally{
            await db.disconnect();
        }
    }
}

module.exports = SessionController;