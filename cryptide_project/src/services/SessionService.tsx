class SessionService {
    static async getSession() {
        try {
            const response = await fetch('http://localhost:3003/session', {
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

    static async updateSoloStats(pseudo: string, nbGames: number, bestScore: number, avgNbTry: number){
        try {
            const response = await fetch('http://localhost:3003/session/updateSoloStats', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    pseudo,
                    nbGames,
                    bestScore,
                    avgNbTry
                }),
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

    static async updateOnlineStats(pseudo: string, nbGames: number, nbWins: number, ratio: number){
        try {

            console.log("updateOnlineStats : ", pseudo, nbGames, nbWins, ratio);
            const response = await fetch('http://localhost:3003/session/updateOnlineStats', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    pseudo,
                    nbGames,
                    nbWins,
                    ratio
                }),
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
  
  export default SessionService;
  