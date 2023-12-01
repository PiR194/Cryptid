
abstract class Player{
    public id: string
    public pseudo: string;
    public profilePicture: string


    constructor(id: string, pseudo: string, profilePicture: string){
        this.id=id
        this.pseudo=pseudo
        this.profilePicture=profilePicture
    }

    abstract toJson(): any
}

export default Player