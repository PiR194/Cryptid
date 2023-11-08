import React from 'react';
import './Lobby.css';
import PlayerItemList from '../Components/PlayerItemList'
import Person from '../res/img/Person.png';
import Bot from '../res/img/bot.png';
import param from '../res/icon/param.png';
import cible from '../res/icon/cible.png';
import ButtonImgNav from '../Components/ButtonImgNav';

function Lobby() {
    return (
        <div className='lobby-container'>
            <div className='left-part'>
                <div className='player-board'>
                    {/* //! voir pour la gestion avec un liste, utilisateur avec le "+ (vous)" et les pdp avec les lettres grecs (?)*/}
                    <PlayerItemList pdp={Person} name="Dummy"/>
                    <PlayerItemList pdp={Bot} name="Boat"/>
                    <PlayerItemList pdp={Bot} name="Bot-tom"/>
                </div>
            </div>

            <div className="lobby-vertical-divider"></div>

            <div className='right-part'>
                <div className='title-param-div'>
                    <img src={param} alt="param"/>
                    <h2>Paramètre de la partie</h2>
                </div>
                <ul>
                    <li><h4>paramètre surper important pour la partieparamètre surper important pour la partieparamètre surper important pour la partieparamètre surper important pour la partieparamètre surper important pour la partie</h4></li>
                    <li><h4>paramètre surper important pour la partie</h4></li>
                    <li><h4>paramètre surper important pour la partie</h4></li>
                    <li><h4>paramètre surper important pour la partie</h4></li>
                    <li><h4>paramètre surper important pour la partie</h4></li>
                    <li><h4>paramètre surper important pour la partie</h4></li>
                </ul>
                <center>
                    <ButtonImgNav dest='/' img={cible} text=' À la chasse !'/> {/* page de baptiste ici */}
                </center>
            </div>
        </div>
    );
}

export default Lobby;
