import React, { Component } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import AuthService from '../services/AuthService';
import '../Style/Global.css';

export default class Login extends Component {
    handleSubmit = async (event: any) => {
        event.preventDefault();
        try{
            const data = {
                pseudo: event.target.pseudo.value,
                password: event.target.password.value,
                remember: event.target.remember.value
            };

            const result = await AuthService.signIn(data);
            console.log(result);
            alert('Connexion réussie !');
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
            </div>
        )
    }
}
