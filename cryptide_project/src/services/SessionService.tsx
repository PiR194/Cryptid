import {ADRESSE_DBSERVER} from "../AdressConfig"

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
}
  
  export default SessionService;
  