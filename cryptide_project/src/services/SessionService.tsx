import {ADRESSE_DBSERVER} from "../AdressSetup"

class SessionService {
    static async getSession() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/session', {
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

    static async addMastermindStats(pseudo: string, score: number, time: number){
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/session/addMastermindStats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    pseudo,
                    score,
                    time
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

    static async addOnlineStats(pseudo: string, win: number, time: number){
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/session/addOnlineStats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    pseudo,
                    win,
                    time
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

    static async UpdatePseudo(pseudo : string, newPseudo : string) {
        console.log("pseudo : " + pseudo + " newpseudo : " + newPseudo)
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/session/updatePseudo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pseudo,
                    newPseudo
                }),
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

export default SessionService;
