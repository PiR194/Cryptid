import Player from "./Player";
import defaultpdp from "../res/img/Person.png"

class User extends Player{

    public soloStats: any
    public onlineStats: any

    constructor(id: string, pseudo: string, profilePicture: string = defaultpdp, soloStats: any, onlineStats: any){
        super(id, pseudo, profilePicture)
        this.soloStats=soloStats
        this.onlineStats=onlineStats
    }

    
    toJson() {
        return {
            type: "User",
            id: this.id,
            pseudo: this.pseudo,
            soloStats: this.soloStats,
            onlineStats: this.onlineStats
        };
    }
}

export default User