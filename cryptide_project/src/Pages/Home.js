import React from 'react';
import './Home.css'; // Créez un fichier CSS pour styliser votre composant
import '../App.css';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


function Home() {
    return (
        
    <div className="home-container">

        <div className="left-section">

            <div>
                <h2>L'HISTOIRE</h2>
                <p>
                    <FormattedMessage id="home.histoire" />
                </p>
            </div>
            <div>
                <h2>LE JEU</h2>
                <p>
                <FormattedMessage id="home.jeu" />
                </p>
            </div>
            <div>
                <h2>LES +</h2>
                <ul>
                    <li><FormattedMessage id="home.plus.truc"/></li>
                    <li><FormattedMessage id="home.plus.2"/></li>
                    <li><FormattedMessage id="home.plus.3"/></li>
                </ul>
            </div>
        </div>
            
        <div className="vertical-divider"></div>

        <div className="right-section">
            <h3>Temps :<t/> 45 minutes</h3>
            <h3>Joueurs :<t/> 3 à 5 joueurs</h3>
            <h3>Age :<t/> 10 ans et +</h3>
            <p>-------------------------------</p>
            <h3> <u>Créé par :</u><br/> Hal Duncan & Ruth Veevers</h3>
            <h3> <u>Illustré par :</u><br/> Kwanchai Moriya</h3>
            {/* <button>Jouer au jeu</button> */}
            <br/>
            <Link to="/jouer" className='button'>Aller à la page Page2</Link>
        </div>
    </div>
    );
}

export default Home;
