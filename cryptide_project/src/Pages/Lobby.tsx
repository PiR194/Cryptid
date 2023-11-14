import React from 'react';
import { useState } from 'react';

// import { useId } from 'react';
// import { v4 as uuidv4 } from 'uuid';


/* Style */
import './Lobby.css';
import { useTheme } from '../Style/ThemeContext';

/* res */
import Person from '../res/img/Person.png';
import Bot from '../res/img/bot.png';
import param from '../res/icon/param.png';
import cible from '../res/icon/cible.png';

/* Component */
import ButtonImgNav from '../Components/ButtonImgNav';
import PlayerItemList from '../Components/PlayerItemList'

function Lobby() {
    const theme=useTheme();
    
    const [codeShowed, setCodeShowed] = useState(true);

    const players = [
        { pdp: Person, name: "Dummy (vous)", id: 1 },
        { pdp: Person, name: "Dummy2)", id: 1 },
        //{ pdp: Bot, name: "Boat", id: 2 },
        // { pdp: Bot, name: "Bot-tom", id: 3 },
    ];

    while (players.length < 3) {
        players.push({ pdp: Bot, name: "BotAdded", id: players.length + 1 });
    }

    return (
        <div className='lobby-container'>
            <div className='left-part'>
                <div className='player-board'>
                    <div className='codeDiv' onClick={() => setCodeShowed(!codeShowed)}>
                        {
                            codeShowed ? (
                                <p>Room : 63194</p>
                            ) : (
                                <p>Room : ******</p>
                            )
                        }
                    </div>
                    {/* //! voir pour la gestion avec un liste, utilisateur avec le "+ (vous)" et les pdp avec les lettres grecs (?)*/}
                    {players.map((player) => (
                        <PlayerItemList key={player.id} pdp={player.pdp} name={player.name} id={player.id} />
                    ))}
                </div>
            </div>

            <div className="lobby-vertical-divider" style={{backgroundColor: theme.colors.secondary}}></div>

            <div className='right-part'>
                <div className='title-param-div'>
                    <img src={param} alt="param"/>
                    <h2>Paramètre de la partie</h2>
                </div>
                <ul>
                    <li><h4> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>Niveau des bots : Facile </h4></li> {/* mettre un dropdown ou un swiper */}
                    <li><h4>Thèmes : basique </h4></li> {/* mettre un dropdown*/}
                    {
                        //? mettre un timer pour chaques personne ?
                        //? indice avancé ? ==> négation, voisin du 2e degré etc.
                    }
                </ul>
                <center>
                    <ButtonImgNav dest='/game' img={cible} text=' À la chasse !'/> {/* page de baptiste ici */}
                </center>
            </div>
        </div>
    );
}

export default Lobby;
