import React, { useState, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'; 
import AuthService from '../services/AuthService';
import '../Style/Global.css';

const SignUp = () => {
    const navigate = useNavigate(); 

    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const data = {
                pseudo: (event.target as any).pseudo.value,
                password: (event.target as any).password.value,
                Cpassword: (event.target as any).Cpassword.value,
            };

            const validation = await AuthService.validateSignUp(data);

            if (!validation.valid) {
                setError(validation.error);
            } else {
                setError(null);

                const result = await AuthService.signUp(data);
                // console.log(result);

                setShowConfirmation(true);
                setTimeout(() => {
                    navigate('/login');         // 3 secondes avant de rediriger vers la page de connexion
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
                <h3>Sign Up</h3>
                <div className="mb-3">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input
                        type="text"
                        id="pseudo"
                        name="pseudo"
                        className="form-control"
                        placeholder="Entrez votre pseudo ici"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Entrez votre mot de passe ici"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cpassword">Confirm Password</label>
                    <input
                        type="password"
                        id="Cpassword"
                        name="Cpassword"
                        className="form-control"
                        placeholder="Confirmez votre mot de passe ici"
                        required
                    />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Soumettre <AiOutlineSend/>
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Vous avez déjà un <a href="/login">compte</a> ?
                </p>
            </form>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {showConfirmation && (
                <div className="alert alert-success" role="alert">
                    Inscription réussie ! Vous serez redirigé vers la page de connexion dans 3 secondes.
                </div>
            )}
        </div>
    );
};

export default SignUp;
