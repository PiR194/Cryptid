import VerificationService from './VerificationService';
import {ADRESSE_DBSERVER} from "../AdressConfig"


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
            const response = await fetch(ADRESSE_DBSERVER + '/auth/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
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
            const response = await fetch(ADRESSE_DBSERVER + '/auth/signin', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
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

    static async logout() {
        try {
            const response = await fetch(ADRESSE_DBSERVER + '/auth/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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
}

export default AuthService;