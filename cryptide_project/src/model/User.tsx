import Player from "./Player";

class User extends Player{

    public soloStats: any
    public onlineStats: any

    constructor(id: string, name: string, profilePicture: string, soloStats: any, onlineStats: any){
        super(id, name, profilePicture)
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