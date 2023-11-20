import Player from "./Player";

class Human extends Player{

    constructor(id: string, name: string){
        super(id, name)
    }
    
    toJson() {
        return {
            type: "Human",
            id: this.id,
            name: this.name,
        };
    }
}

export default Human