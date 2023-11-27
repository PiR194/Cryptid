import SessionService from "../../services/SessionService";
import { socket } from "../../SocketConfig";
import User from "../User";
import IUserService from "./IUserService";

class DbUserService implements IUserService{
    async fetchUserInformation(): Promise<[User | null, boolean]> {
        try {
            const sessionData = await SessionService.getSession();
            
            // Vérifie si il y a une session
            if (sessionData.user) {
                // Il y a une session on récupère les infos du joueur
                const updatedPlayer: User = new User(socket.id, sessionData.user.pseudo, sessionData.user.profilePicture, {
                    nbGames: sessionData.user.soloStats.nbGames,
                    bestScore: sessionData.user.soloStats.bestScore,
                    avgNbTry: sessionData.user.soloStats.avgNbTry,
                },
                {
                    nbGames: sessionData.user.onlineStats.nbGames,
                    nbWins: sessionData.user.onlineStats.nbWins,
                    ratio: sessionData.user.onlineStats.ratio,
                })
                return [updatedPlayer, true]
            } else {
                // Pas de session on génère un guest random
                const guestPlayer: User = new User(socket.id, 'Guest_' + Math.floor(Math.random() * 1000000), '',
                {
                    nbGames: 0,
                    bestScore: 0,
                    avgNbTry: 0,
                },
                {
                    nbGames: 0,
                    nbWins: 0,
                    ratio: 0,
                })
                return [guestPlayer, false]
                
            }
        } catch (error) {
            console.error(error);
            return [null, false]
        }
    }

}

export default DbUserService