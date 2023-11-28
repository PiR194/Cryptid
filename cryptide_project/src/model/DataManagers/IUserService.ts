import User from "../User";

interface IUserService{
    fetchUserInformation(): Promise<[User | null, boolean]>
    updateSoloStats(pseudo: string, nbGames: number, bestScore: number, avgNbTry: number): Promise<void>
    updateOnlineStats(pseudo: string, nbGames: number, bestScore: number, ratio: number): Promise<void>
}


export default IUserService