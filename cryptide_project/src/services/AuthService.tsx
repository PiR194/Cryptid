import VerificationService from './VerificationService';

class AuthService{
    // Méthode pour vérifier les données de connexion
    static async validateSignUp(data: any): Promise<boolean>{
        return VerificationService.validateSignUpData(data);
    }

    static async signUp(data: any) {
        try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Échec de l\'inscription.');
        }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }  
}

export default AuthService;