import React from 'react';
import './Home.css'; // Créez un fichier CSS pour styliser votre composant
import '../App.css';
import { Link } from 'react-router-dom';



function Home() {
    return (
        
    <div className="home-container">

        <div className="left-section">

            <div>
                <h2>L'HISTOIRE</h2>
                <p>
                    "La cryptozoologie étudie les traces des monstres de légende : les cryptides. Yétis, Chupacabra, bête du gévaudan, Dahut, ect., sont des sujets très sérieux pour vous… Croisez les indices et soyez le premier à les découvrir!"
                </p>
            </div>
            <div>
                <h2>LE JEU</h2>
                <p>
                    "Chaque joueur possède un indice sur le terrain où se trouve la créature. En recoupant vos informations, il ne peut y avoir qu'une case qui y corresponde. Mais le but est d'être le premier à la trouver. Interrogez vos collègues, et néanmoins concurrents. Ils ne peuvent vous répondre que par «non» ou «peut-être», avec beaucoup de logique et un brin d'audace, vous pourrez rentrer dans la légende!"
                </p>
            </div>
            <div>
                <h2>LES +</h2>
                <ul>
                    <li>Une mécanique de déduction époustouflante.</li>
                    <li>Une rejouabilité immense.</li>
                    <li>Un thème surprenant et fort.</li>
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
