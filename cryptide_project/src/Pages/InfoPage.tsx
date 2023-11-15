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

function InfoPage() { //! cette page n'affiche que des informations et est suceptible de changer selon le context.

    return (
        
    <div className='infoPage'>
        <h1>Informations</h1>
        
        <div>
            <h2> Introduction au jeu :</h2>
            <p>
                Bienvenue dans notre jeu de déduction captivant, où l'intrigue et l'esprit d'équipe se rejoignent dans une aventure palpitante ! Plongez-vous dans un monde de mystère et d'intrigue, où chaque interaction compte, et chaque indice vous rapproche de la vérité.
                Imaginez un graphique complexe où chaque sommet représente une personne, chaque axe une relation, et chaque détail compte. Vous êtes plongé dans un défi stimulant pour découvrir qui parmi ces individus est le mystérieux tueur. Chaque joueur détient un indice crucial, et seul le partage stratégique de ces indices vous mènera à la résolution du mystère.
                Explorez notre page de règles pour comprendre les subtilités du jeu, découvrez les indices qui peuvent vous guider, et élaborez des stratégies intelligentes pour identifier le coupable. Êtes-vous prêt à relever le défi et à démasquer le tueur caché dans le graphe ? Que l'enquête commence !  
            </p>
        </div>

        <div>
            <h2> Sommaire </h2>
            <ul>
                <li><Link to="#composants-du-jeu">Composants du jeu</Link></li>
                <li><Link to="#objectif-du-jeu">Objectif du jeu</Link></li>
                <li><Link to="#deroulement-du-jeu">Déroulement du jeu</Link></li>
                <li><Link to="#indice-possible">Indice possible</Link></li>
            </ul>
        </div>

            <section id="composants-du-jeu">
                <h2>Composants du jeu :</h2>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.

Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet
                </p>
            </section>

            <section id="objectif-du-jeu">
                <h2>Objectif du jeu :</h2>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.

Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet
                </p>
            </section>

            <section id="deroulement-du-jeu">
                <h2>Déroulement du jeu :</h2>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.

Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet
                </p>
            </section>

            <section id="indice-possible">
                <h2>Indice possible :</h2>
                <h3>
                    Âge d'une personne :
                </h3>
                <IndiceList instance={AgeIndice} lang='fr'/>
                
                <h3>
                    Couleur de cheveux d'une personne :
                </h3>
                <IndiceList instance={ColorIndice} lang='fr'/>
                <IndiceList instance={ColorEdgesIndice} lang='fr'/>
                <hr/>
                <h3>
                    Sport d'une personne
                </h3>
                <IndiceList instance={SportIndice} lang='fr'/>
                <IndiceList instance={NbSportIndice} lang='fr'/>
                
                
                <h3>
                    Caractèristique des voisins
                </h3>
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
