import e from 'express';
import VerificationService from './VerificationService';

class AuthService{
    // Méthode pour vérifier les données de connexion
    static async validateSignUp(data: any): Promise<{valid: boolean, error: string}> {
        return VerificationService.validateSignUpData(data);
    }

    static async validateSignIn(data: any): Promise<{valid: boolean, error: string}> {
        return VerificationService.validateSignInData(data);
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
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async signIn(data: any) {
        try {
            const response = await fetch('http://localhost:3000/auth/signin', {
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
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            }
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default AuthService;