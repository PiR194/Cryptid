import User from "../User";

interface IUserService{
    fetchUserInformation(): Promise<[User | null, boolean]>
    addMastermindStats(pseudo: string, score: number, time: number): Promise<void>
    addOnlineStats(pseudo: string, win: number, time: number): Promise<void>
}


export default IUserService