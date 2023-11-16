import React from 'react';

/* Style */
import '../Style/Global.css';
import './InfoPage.css';
import { FormattedMessage } from 'react-intl';
import { useGame } from '../Contexts/GameContext';
import ColorIndice from '../model/Indices/ColorIndice';
import Stub from '../model/Stub';
import SportIndice from '../model/Indices/SportIndice';
import EdgesIndice from '../model/Indices/EdgesIndice';
import NbEdgesIndice from '../model/Indices/NbEdgesIndice';
import NbSportIndice from '../model/Indices/NbSportIndice';
import AgeIndice from '../model/Indices/AgeIndice';
import ColorEdgesIndice from '../model/Indices/ColorEdgesIndice';
import IndiceList from '../Components/IndiceList';
import { HashLink as Link } from 'react-router-hash-link';
import { ColorToHexa } from '../model/EnumExtender';
import Color from '../model/Color';

function InfoPage() { //! cette page n'affiche que des informations et est suceptible de changer selon le context.
    const styles = {
        roux: { backgroundColor: ColorToHexa(Color.REDHEAD), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        blond: { backgroundColor: ColorToHexa(Color.BLOND), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        noir: { backgroundColor: ColorToHexa(Color.BLACK), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        blanc: { backgroundColor: ColorToHexa(Color.WHITE), border: '1px solid #ccc', width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        chatain: { backgroundColor: ColorToHexa(Color.BROWN), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
    };
    return (
        
    <div className='infoPage'>
        <h1>Informations</h1>
        
        <div>
            <h2> Introduction au jeu :</h2>
            <p>
                Bienvenue dans notre jeu de déduction captivant, où l'intrigue et la malice se rejoignent dans une aventure palpitante ! Plongez-vous dans un monde de mystère et d'intrigue, où chaque interaction compte, et chaque indice vous rapproche de la vérité.
                Imaginez un graphique complexe où chaque sommet représente une personne, chaque axe une relation, et chaque détail compte. Vous êtes plongé dans un défi stimulant pour découvrir qui parmi ces individus est le mystérieux tueur. Chaque joueur détient un indice crucial, et seul le partage stratégique de ces indices vous mènera à la résolution du mystère.
                Explorez notre page de règles pour comprendre les subtilités du jeu, découvrez les indices qui peuvent vous guider, et élaborez des stratégies intelligentes pour identifier le coupable. Manipuler vos amis, afin d'être le premier à découvrir qui est le meurtrier ! Êtes-vous prêt à relever le défi et à démasquer le tueur caché dans le graphe ? Que l'enquête commence !  
            </p>
        </div>

        <div className="list">
            <h2> Sommaire </h2>
            <ul>
                <li><Link to="#composants-du-jeu"><span>Composants du jeu</span></Link></li>
                <li><Link to="#objectif-du-jeu"><span>Objectif du jeu</span></Link></li>
                <li><Link to="#deroulement-du-jeu"><span>Déroulement du jeu</span></Link></li>
                <li><Link to="#indice-possible"><span>Indice possible</span></Link></li>
            </ul>
        </div>

            <section id="composants-du-jeu">
                <h2>Composants du jeu :</h2>
                    <h4>
                        Pions
                    </h4>
                    <h6>Chaque joueur possèdera une couleur désigné, elle différencira les actions représenté par les pions suivant :</h6>
                <ul>
                    <p>
                        <li><h5 className='h5title'>Les jetons <b>carrés</b> : 🟪🟦🟩🟨🟥🟫</h5></li>
                        Il designe une négation, le joueur ayant déposé celui ci indique que son indice innocente la personne designé.

                        <li><h5 className='h5title'>Les jetons <b>rond</b> : 🟣🔵🟢🟡🔴🟤</h5></li>
                        Il designe un "peut être", l'indice du joueur l'ayant déposé afirme qu'il est un suspect, cependant, il n'est pas forcément coupable.
                        Il y a un seul suspect ayant un jeton rond pour tout les joueurs de la partie, il s'agit du coupable ! 
                    </p>
                </ul>
                    <h4>
                    <hr/>
                        Caractèristiques des personnages
                    </h4>
                    <h6>En plus de leur nom, les personnages sont représenté avec d'autres caractèristique :</h6>
                    <p>
                        {/* 
                            //TODO mettre icon des ages apres le merge
                        */}
                        <h5 className='h5title'>Les Âges :</h5> 
                        Chaque personne possède un age pour les authentifiers, cet âge varie entre 0 et 60ans.
                        L'age est une caractèristique qui sera authentifier avec les indices par <Link to="#indice-possible">tranche d'âge</Link>.

                        <h5 className='h5title'>Les Couleurs de cheveux</h5>
                        Les personnages Possède aussi une couleur de cheveux, que l'on retrouve dans les couleurs suivante :
                        <ul>
                            <li>
                                <span style={styles.blanc}></span>
                                Blanc
                            </li>
                            <li>
                                <span style={styles.blond}></span>
                                Blond
                            </li>
                            <li>
                                <span style={styles.roux}></span>
                                Roux
                            </li>
                            <li>
                                <span style={styles.chatain}></span>
                                Chatain
                            </li>
                            <li>
                                <span style={styles.noir}></span>
                                Noir
                            </li>
                        </ul>

                        <h5 className='h5title'>Les Sports : ⚾🏀🎳⚽🎾</h5>
                        Les hobbies des personnages sont designé par 5 sports, respectivement :
                            <ul>
                                <li>⚾ Baseball</li>
                                <li>🏀 Basketball</li>
                                <li>🎳 Bowling</li>
                                <li>⚽ Football</li>
                                <li>🎾 Tennis</li>
                            </ul>
                        Parmis eux, ils auront entre 0 à 3 sports chacun, permettant de les identifiers avec les indices que vous possédez.
                    </p>
            </section>
            <hr/>
            <section id="objectif-du-jeu">
                <h2>Objectif du jeu :</h2>
                <p>
                    Bienvenue dans l'univers astucieux de notre jeu de déduction, où la tromperie et la ruse sont les clés du succès. Votre mission est de démêler le mystère qui se cache derrière chaque interaction du graphique complexe représentant les relations entre les individus.
                </p>
                <h4>
                    Manipulation Subtile :
                </h4>
                <p>
                    Le but ultime est de découvrir qui parmi les individus est le tueur, mais pas par une collaboration ouverte. Au contraire, vous utiliserez la manipulation subtile pour brouiller les pistes et détourner l'attention de vos adversaires. Posez des questions stratégiques, répondez avec malice, et plantez des indices trompeurs pour vous rapprocher du dénouement.
                </p>
                <h4>Jeu de Duperie :</h4>
                <p>
                    Chaque tour offre l'opportunité de semer le doute parmi vos adversaires. Lorsqu'un joueur vous interroge, répondez en plaçant habilement un jeton carré pour indiquer que "selon votre indice, cette personne ne peut être le coupable" ou un jeton rond pour suggérer qu'elle reste dans la liste des suspects. Soyez prudent, car chaque geste peut être interprété, et la vérité est souvent cachée derrière une façade d'indices trompeurs.
                </p>
                <h4>Contre-manipulation :</h4>
                <p>
                    Si un joueur place un jeton carré, le questionneur doit également jouer son jeu en posant un jeton carré de sa couleur sur un nœud du graphique. La contre-manipulation devient une arme redoutable pour détourner l'accusation et semer la confusion.
                </p>

                <h4>
                    Interface :
                </h4>
            </section>
            <hr/>
            <section id="deroulement-du-jeu">
                <h2>Déroulement du jeu :</h2>
                <h4>
                    <u>Étape 1</u> : Poser des Questions Stratégiques
                </h4>
                <p>
                    Chaque tour commence par un joueur posant une question à un autre joueur concernant une personne sur le graphe. Les réponses sont formulées en plaçant des jetons carrés ou ronds pour indiquer la certitude ou le doute quant à l'implication de cette personne.
                </p>
                <h4>
                    <u>Étape 2</u> : Contre-manipulation et Contre-questions
                </h4>
                <p>
                    Si un joueur place un jeton carré, le questionneur doit également poser un jeton carré sur un nœud du graphique. Les contre-questions sont un moyen de semer la confusion parmi les joueurs et de détourner l'accusation.
                </p>
                <h4>
                    <u>Étape 3</u> : Le "Guess" Final
                </h4>
                <p>
                    La partie atteint son apogée lorsqu'un joueur tente le "Guess" final, affirmant que telle personne est le tueur. Les autres joueurs peuvent alors contredire cette affirmation en plaçant leurs propres jetons carrés. Si aucune réfutation n'est faite, le joueur ayant fait le "Guess" remporte la partie, démontrant ainsi sa maîtrise dans l'art de la manipulation.
                </p>
            </section>
            <hr/>
            <section id="indice-possible">
                <h2>Indice possible :</h2>
                <br/>
                <h4>
                    Âge d'une personne :
                </h4>
                <IndiceList instance={AgeIndice} lang='fr'/>
                
                <h4>
                    Couleur de cheveux d'une personne :
                </h4>
                <IndiceList instance={ColorIndice} lang='fr'/>
                <IndiceList instance={ColorEdgesIndice} lang='fr'/>
                <hr/>
                <h4>
                    Sport d'une personne
                </h4>
                <IndiceList instance={SportIndice} lang='fr'/>
                <IndiceList instance={NbSportIndice} lang='fr'/>
                
                
                <h4>
                    Caractèristique des voisins
                </h4>
                <IndiceList instance={EdgesIndice} lang='fr'/>
                <IndiceList instance={NbEdgesIndice} lang='fr'/>
                <hr/>
            </section>
        
        {/* 
            //! Topographie présente uniquement sur Cryptide
            <h2>Topographie</h2>
            <p>Legende des différents objet disponible sur la carte.</p> 
        */}
    </div>
    );
}

export default InfoPage;
