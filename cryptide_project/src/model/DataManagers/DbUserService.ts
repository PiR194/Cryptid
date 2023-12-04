import { random } from "lodash";
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
                const currentUser = new User(socket.id, sessionData.user.pseudo, sessionData.profilePicture,
                {
                    nbGames: sessionData.user.mastermindStats.nbGames, 
                    bestScore: sessionData.user.mastermindStats.bestScore, 
                    avgNbTry: sessionData.user.mastermindStats.avgNbTry
                },
                {
                    nbGames: sessionData.user.easyEnigmaStats.nbGames,
                    nbWins: sessionData.user.easyEnigmaStats.nbWins,
                    ratio: sessionData.user.easyEnigmaStats.ratio,
                    bestTime: sessionData.user.easyEnigmaStats.bestTime,
                    avgTime: sessionData.user.easyEnigmaStats.avgTime
                },
                {
                    nbGames: sessionData.user.mediumEnigmaStats.nbGames,
                    bestScore: sessionData.user.mediumEnigmaStats.bestScore,
                    avgNbTry: sessionData.user.mediumEnigmaStats.avgNbTry
                },
                {
                    nbGames: sessionData.user.hardEnigmaStats.nbGames,
                    nbWins: sessionData.user.hardEnigmaStats.nbWins,
                    ratio: sessionData.user.hardEnigmaStats.ratio,
                    bestTime: sessionData.user.hardEnigmaStats.bestTime,
                    avgTime: sessionData.user.hardEnigmaStats.avgTime
                },
                {
                    nbGames: sessionData.user.onlineStats.nbGames,
                    nbWins: sessionData.user.onlineStats.nbWins,
                    ratio: sessionData.user.onlineStats.ratio,
                });

                return [currentUser, true];
            } 
            else{
                const guestUser = new User(socket.id, "Guest_" + random(1000, 9999), "",
                {
                    nbGames: 0, 
                    bestScore: 0, 
                    avgNbTry: 0
                },
                {
                    nbGames: 0,
                    nbWins: 0,
                    ratio: 0,
                    bestTime: 0,
                    avgTime: 0
                },
                {
                    nbGames: 0,
                    bestScore: 0,
                    avgNbTry: 0
                },
                {
                    nbGames: 0,
                    nbWins: 0,
                    ratio: 0,
                    bestTime: 0,
                    avgTime: 0
                },
                {
                    nbGames: 0,
                    nbWins: 0,
                    ratio: 0,
                });

                return [guestUser, false];
            }
        } catch (error) {
            console.error(error);
            return [null, false]
        }
    }

    async updateSoloStats(pseudo: string, nbGames: number, bestScore: number, avgNbTry: number): Promise<void> {
        try {
            const result = await SessionService.updateSoloStats(pseudo, nbGames, bestScore, avgNbTry);
            if (result) {
                console.log("Stats solo updated");
            } else {
                console.log("Stats solo not updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async updateOnlineStats(pseudo: string, nbGames: number, bestScore: number, ratio: number): Promise<void> {
        try {
            const result = await SessionService.updateOnlineStats(pseudo, nbGames, bestScore, ratio);
            if (result) {
                console.log("Stats online updated");
            } else {
                console.log("Stats online not updated");
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default DbUserService