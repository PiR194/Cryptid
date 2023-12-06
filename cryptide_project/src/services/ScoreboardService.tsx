import {ADRESSE_DBSERVER} from '../AdressSetup';

class ScoreboardService {

    // ------------------------------ GET ------------------------------
    // ----------------------------- DAILY -----------------------------
    // ----------------------------- STATS -----------------------------

    static async getDailyMastermindStats() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/scoreboard/getDailyMastermind', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getDailyOnlineStats() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/scoreboard/getDailyOnline', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // ------------------------------ GET ------------------------------
    // ----------------------------- WEEKLY ----------------------------
    // ----------------------------- STATS -----------------------------

    static async getWeeklyMastermindStats() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/scoreboard/getWeeklyMastermind', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getWeeklyOnlineStats() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/scoreboard/getWeeklyOnline', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ScoreboardService;