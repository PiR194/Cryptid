import React, { Component } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import '../Style/Global.css';

export default class SignUp extends Component {
    render() {
        return (
            <div className="form-container">
                <form>
                    <br/>
                    <h3>Sign Up</h3>
                    <div className="mb-3">
                        <label>Pseudo</label>
                        <input
                        type="pseudo"
                        className="form-control"
                        placeholder="Entrez votre pseudo ici"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                        type="password"
                        className="form-control"
                        placeholder="Entrez votre mot de passe ici"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                        type="Cpassword"
                        className="form-control"
                        placeholder="Confirmez votre mot de passe ici"
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
        )
    }
}
