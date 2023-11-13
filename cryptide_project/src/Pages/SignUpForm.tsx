import React, { Component } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import AuthService from '../services/AuthService';
import '../Style/Global.css';

export default class SignUp extends Component {
    handleSubmit = async (event: any) => {
        event.preventDefault();
        try{
            const data = {
                pseudo: event.target.pseudo.value,
                password: event.target.password.value,
                Cpassword: event.target.Cpassword.value
            };

            const isValid = await AuthService.validateSignUp(data);

            if(isValid){
                const result = await AuthService.signUp(data);
                console.log(result);
                alert('Inscription réussie !');
            }
        }
        catch(error){
            console.error(error);
        }
    };

    render() {
        return (
            <div className="form-container">
                <form onSubmit={this.handleSubmit}>
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
                            required
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
            </div>
        );
    }
}
