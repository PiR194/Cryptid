import React, { useState, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext'; 
import AuthService from '../services/AuthService';
import '../Style/Global.css';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const data = {
                pseudo: (event.target as any).pseudo.value,
                password: (event.target as any).password.value,
                remember: (event.target as any).remember.checked
            };

            const validation = await AuthService.validateSignIn(data);

            if (!validation.valid) {
                setError(validation.error);
            } else {
                setError(null);

                const result = await AuthService.signIn(data);
                // console.log(result);

                setShowConfirmation(true);
                setTimeout(() => {
                    login();
                    navigate('/play');         // 3 secondes avant de rediriger vers la page de connexion
                }, 3000);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        return () => {
            setShowConfirmation(false);
        };
    }, []);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <br/>
                <h3>Log In</h3>
                <div className="mb-3">
                    <label>Pseudo</label>
                    <input
                        type="pseudo"
                        name='pseudo'
                        className="form-control"
                        placeholder="Entrez votre pseudo ici"
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        name='password'
                        className="form-control"
                        placeholder="Entrez votre mot de passe ici"
                    />
                </div>
                <div className="mb-3">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            name='remember'
                            className="custom-control-input"
                            id="customCheck1"
                        />
                        <label className="custom-control-label" htmlFor="customCheck1">
                            Se souvenir de moi
                        </label>
                    </div>
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Soumettre <AiOutlineSend/>
                    </button>
                </div>
                <p className="forgot-password text-right">
                    <a href="#">Mot de passe</a> oublié ?
                </p>
            </form>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {showConfirmation && (
                <div className="alert alert-success" role="alert">
                    Connexion réussie ! Vous serez redirigé vers votre profil dans 3 secondes.
                </div>
            )}
        </div>
    );
};

export default SignIn;
