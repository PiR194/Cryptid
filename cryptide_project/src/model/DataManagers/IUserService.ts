import User from "../User";

interface IUserService{
    fetchUserInformation(): Promise<[User | null, boolean]>
    changeNodesIndices(nbNodes: number, nbIndices: number): Promise<void>
    addMastermindStats(pseudo: string, score: number, time: number): Promise<void>
    addEasyEnigmaStats(pseudo: string, win: number, time: number): Promise<void>
    // addMediumEnigmaStats(pseudo: string, win: number, time: number): Promise<void>
    addHardEnigmaStats(pseudo: string, win: number, time: number): Promise<void>
    addOnlineStats(pseudo: string, win: number, time: number): Promise<void>
}


export default IUserService