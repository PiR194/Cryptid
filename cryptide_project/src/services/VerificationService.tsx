class ValidationService {
    public static validateSignUpData(data: any): {valid: boolean, error: string} {
        if(!data.pseudo || !data.password || !data.Cpassword) {
            return {valid: false, error: 'Veuillez remplir tous les champs.'};
        }

        if(data.password.length < 8) {
            return {valid: false, error: 'Le mot de passe doit contenir au moins 8 caractères.'};
        }

        if(data.password !== data.Cpassword) {
            return {valid: false, error: 'Les mots de passe ne correspondent pas.'};
        }

        return {valid: true, error: ''};
    }

    public static validateSignInData(data: any): {valid: boolean, error: string} {
        if(!data.pseudo || !data.password) {
            return {valid: false, error: 'Veuillez remplir tous les champs.'};
        }

        if(data.password.length < 8) {
            return {valid: false, error: 'Le mot de passe doit contenir au moins 8 caractères.'};
        }

        return {valid: true, error: ''};
    }
}

export default ValidationService;