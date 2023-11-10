import React from 'react';

/* Style */
import '../Style/Global.css';

import { FormattedMessage } from 'react-intl';

function InfoPage() { //! cette page n'affiche que des informations et est suceptible de changer selon le context.

    return (
        
    <div>
        <h1>Informations</h1>
        
        <h2>Indice possible :</h2>
        <h3>
            couleur de cheveux d'une personne
        </h3>
        <ul>
            <li>
                Possède les cheveux noir
            </li>
            <li>
                Possède les cheveux roux
            </li>
            <li>
                Possède les cheveux blond
            </li>
            <li>
                Possède les cheveux brun
            </li>
            <li>
                Possède les cheveux blanc
            </li>
        </ul>
        <hr/>
        <h3>
            Sport d'une personne
        </h3>
        <ul>
            <li>
                Effectue du Foot <u>ou</u> du tennis
            </li>
            <li>
                Effectue du rugby <u>ou</u> du tennis
            </li>
        </ul>
        <h3>
            Caractèristique des voisins
        </h3>
        <ul>
            <li>
                Possède deux voisins footballeur
            </li>
            <li>
                Possède aucun voisin rugbyman
            </li>
        </ul>

        <h2>Topographie</h2>
        <p>Legende des différents objet disponible sur la carte.</p>
    </div>
    );
}

export default InfoPage;
