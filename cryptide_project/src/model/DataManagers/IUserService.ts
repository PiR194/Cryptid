import User from "../User";

interface IUserService{

    fetchUserInformation(): Promise<[User | null, boolean]>
}


export default IUserService