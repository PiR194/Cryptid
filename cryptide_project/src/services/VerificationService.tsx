class ValidationService {
    public static validateSignUpData(data: any): boolean {
        if(!data.pseudo || !data.password || !data.Cpassword) {
            console.error('Veuillez remplir tous les champs.');
            return false;
        }

        // if(data.password !== data.Cpassword) {
        //     console.error('Les mots de passe ne correspondent pas.');
        //     return false;
        // }

        return true;
    }
}

export default ValidationService;