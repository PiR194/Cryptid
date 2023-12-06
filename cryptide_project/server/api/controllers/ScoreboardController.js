const path = require('path');
const DatabaseService = require(path.resolve(__dirname, '../services/DatabaseService'));

const ENIGME_FACILE = "enigme_facile";
const ENIGME_MOYEN = "enigme_moyenne";
const ENIGME_DIFFICILE = "enigme_difficile";

class SessionController {
    // ---------------------------------------------------
    // ----------------- GET DAILY STATS -----------------
    // ---------------------------------------------------

    static async getDailyMastermind(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const dailyMastermindStats = await db.getDailyMastermindStats();

            res.status(200).json({ tab : dailyMastermindStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats dailyMastermind.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async getDailyEasyEnigma(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const dailyEasyEnigmaStats = await db.getDailyEnigmaStats(ENIGME_FACILE);

            res.status(200).json({ tab : dailyEasyEnigmaStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats dailyEasyEnigma.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async getDailyOnline(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const dailyOnlineStats = await db.getDailyOnlineStats();

            res.status(200).json({ tab : dailyOnlineStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats dailyOnline' });
        }
        finally{
            await db.disconnect();
        }
    }

    // ---------------------------------------------------
    // ---------------- GET WEEKLY STATS -----------------
    // ---------------------------------------------------

    static async getWeeklyMastermind(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const weeklyMastermindStats = await db.getWeeklyMastermindStats();

            res.status(200).json({ tab : weeklyMastermindStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats weeklyMastermind.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async getWeeklyEasyEnigma(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const weeklyEasyEnigmaStats = await db.getWeeklyEnigmaStats(ENIGME_FACILE);

            res.status(200).json({ tab : weeklyEasyEnigmaStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats weeklyEasyEnigma.' });
        }
        finally{
            await db.disconnect();
        }
    }

    static async getWeeklyOnline(req, res){
        const db = new DatabaseService();

        try{
            await db.connect();

            const weeklyOnlineStats = await db.getWeeklyOnlineStats();

            res.status(200).json({ tab : weeklyOnlineStats });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des stats weeklyOnline' });
        }
        finally{
            await db.disconnect();
        }
    }
    
}

module.exports = SessionController;