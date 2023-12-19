import Player from "./Player";
import defaultImg from "../res/img/Person.png"
class User extends Player{

    public mastermindStats: any
    public easyEnigmaStats: any
    public mediumEnigmaStats: any
    public hardEnigmaStats: any
    public onlineStats: any
    public nbNodes: number = 25
    public nbIndices: number = 3

    constructor(id: string, pseudo: string, profilePicture: string, soloStats: any, easyEnigmaStats: any, mediumEnigmaStats: any, hardEnigmaStats: any, onlineStats: any){
        super(id, pseudo, profilePicture || defaultImg)
        this.mastermindStats=soloStats
        this.easyEnigmaStats=easyEnigmaStats
        this.mediumEnigmaStats=mediumEnigmaStats
        this.hardEnigmaStats=hardEnigmaStats
        this.onlineStats=onlineStats
    }

    
    toJson() {
        return {
            type: "User",
            id: this.id,
            profilePicture: this.profilePicture,
            pseudo: this.pseudo,
            easyEnigmaStats: this.easyEnigmaStats,
            mediumEnigmaStats: this.mediumEnigmaStats,
            hardEnigmaStats: this.hardEnigmaStats,
            onlineStats: this.onlineStats
        };
    }
}

export default User