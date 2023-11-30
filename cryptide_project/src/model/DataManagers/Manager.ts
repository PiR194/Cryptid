import IUserService from "./IUserService";

class Manager{

    public userService: IUserService

    constructor(userService: IUserService){
        this.userService = userService
    }
}

export default Manager