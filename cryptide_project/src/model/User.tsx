import Player from "./Player";
import defaultImg from "../res/img/Person.png"
class User extends Player{

    public soloStats: any
    public onlineStats: any

    constructor(id: string, pseudo: string, profilePicture: string, soloStats: any, onlineStats: any){
        super(id, pseudo, profilePicture || defaultImg)
        this.soloStats=soloStats
        this.onlineStats=onlineStats
    }

    
    toJson() {
        return {
            type: "User",
            id: this.id,
            profilePicture: this.profilePicture,
            pseudo: this.pseudo,
            soloStats: this.soloStats,
            onlineStats: this.onlineStats
        };
    }
}

export default User