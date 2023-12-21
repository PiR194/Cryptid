import React, {useEffect} from 'react';
import { useAuth } from '../Contexts/AuthContext';
import SessionService from '../services/SessionService';
import './Home.css';
import '../App.css';
import { useTheme } from '../Style/ThemeContext';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ButtonImgNav from '../Components/ButtonImgNav';
import defaultImg from "../res/img/Person.png"
import {loadImageAsync} from "../ImageHelper"
import { socket } from '../SocketConfig';
import JSONParser from '../JSONParser';

import {basePath} from "../AdressSetup"


// @ts-ignore
function Home() {
    const theme=useTheme();
    const {isLoggedIn, login, user, setUserData, manager } = useAuth();

    useEffect(() => {

        if (user == null){
            manager.userService.fetchUserInformation().then(([user, loggedIn]) =>{
                if (user!=null){
                    if (loggedIn){
                        login()
                        setUserData(user)
                    }
                    else{
                        loadImageAsync(defaultImg).then((blob) => {
                            user.profilePicture=blob
                            setUserData(user)
                        })
                    }
                }
            })
        }
    }, [isLoggedIn]);

    return (        
        <div className="home-container" style={{overflow:"hidden"}}>
            <div className="left-section">
                <div>
                    {/* <h2><FormattedMessage id="home.histoire.title"/></h2> */}
                    <h2>Introduction</h2>
                    <p style={{fontSize:"14px"}}>
                        {/* <FormattedMessage id="home.histoire" /> */}
                        Bienvenue dans notre jeu de déduction captivant, où l'intrigue et la malice se rejoignent dans une aventure palpitante ! 
                        Plongez-vous dans un monde de mystère et d'intrigue, où chaque interaction compte, et chaque indice vous rapproche de la vérité.
                        Imaginez un graphique complexe où chaque sommet représente une personne, chaque axe une relation, et chaque détail compte. 
                        Vous êtes plongé dans un défi stimulant pour découvrir qui parmi ces individus est le mystérieux coupable. 
                        Chaque joueur détient un indice crucial, et seul le partage stratégique de ces indices vous mènera à la résolution du mystère. 
                        Explorez notre page de règles pour comprendre les subtilités du jeu, découvrez les indices qui peuvent vous guider, et élaborez des stratégies intelligentes pour identifier le coupable. 
                        Manipuler vos amis, afin d'être le premier à découvrir qui est le meurtrier ! 
                        Êtes-vous prêt à relever le défi et à démasquer le coupable caché dans le graphe ? Que l'enquête commence !
                    </p>
                </div>

                <hr/>

                <div>
                    <h2><FormattedMessage id="home.jeu.title"/></h2>
                    <p style={{fontSize:"14px"}}>
                        {/* <FormattedMessage id="home.jeu" /> */}
                        Dans l'univers captivant de notre jeu de déduction, la tromperie et la ruse sont les maîtres mots de la réussite. Explorez le mystère qui se dissimule derrière chaque interaction de notre graphique complexe, dévoilant les liens entre les individus. 
                    </p>

                    <p style={{fontSize:"14px"}}>
                        {/* <FormattedMessage id="home.jeu" /> */}
                        Votre mission ultime ? Découvrir qui parmi les individus est le coupable, mais n'attendez pas une collaboration ouverte. Utilisez plutôt la manipulation subtile pour embrouiller les pistes, détourner l'attention de vos adversaires. Posez des questions stratégiques, répondez avec malice et plantez des indices trompeurs pour vous rapprocher du dénouement.
                    </p>

                    <p style={{fontSize:"14px"}}>
                        {/* <FormattedMessage id="home.jeu" /> */}
                        Chaque occasion offre la possibilité de semer le doute parmi vos adversaires. Lorsqu'un joueur vous interroge, répondez en plaçant adroitement un jeton carré pour suggérer que "selon votre indice, cette personne ne peut être le coupable", ou un jeton rond pour indiquer qu'elle reste dans la liste des suspects. Soyez vigilant, chaque geste peut être interprété, et la vérité se dissimule souvent derrière une façade d'indices trompeurs.
                    </p>

                    <p style={{fontSize:"14px"}}>
                        {/* <FormattedMessage id="home.jeu" /> */}
                        Si un joueur place un jeton carré, le questionneur doit également jouer son jeu en plaçant un jeton carré de sa couleur sur un nœud du graphique. La contre-manipulation devient ainsi une arme redoutable pour détourner l'accusation et semer la confusion. Pour en savoir plus, plongez-vous dans les détails de ce passionnant récit sur une autre page.
                    </p>

                    <h5>Pour des informations plus détaillées, consulter les <Link to={`${basePath}/info`}>règles</Link>.</h5>
                    <hr/>
                </div>
                
                <div>
                    <h6>Jeu inspiré par le jeu de société "Cryptide"</h6>
                </div>
            </div>
                
            <div className="vertical-divider"></div>

            <div className="right-section">
                {/* <h3><FormattedMessage id="game.time"/></h3>
                <h3><FormattedMessage id="game.players"/></h3>
                <h3><FormattedMessage id="game.age"/></h3> */}
                <h3>
                    Temps : 20 minutes<br/>
                    Joueurs : 1 à 6<br/>
                    Âge : 8ans et +<br/>
                </h3>

                <hr/>
                
                <h3> 
                    <u><FormattedMessage id="game.createdBy"/></u><br/>
                    Chazot Thomas<br/>
                    Ferreira Pierre<br/>
                    Marcel Baptiste<br/>
                </h3>
                {/* <h3> <u><FormattedMessage id="game.illustratedBy"/></u><br/> Kwanchai Moriya</h3> */}
                {/* <button>Jouer au jeu</button> */}
                <br/>

                <Link to={`${basePath}/`} className='button'
                    style={{ 
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.secondary
                    }}>
                    <FormattedMessage id="play"/> 
                </Link>
            </div>
        </div>
    );
}

export default Home;
