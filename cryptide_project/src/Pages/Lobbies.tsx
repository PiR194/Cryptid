import React, { useEffect, useState } from 'react';

/* Style */
import './Lobbies.css';
import "../Style/Global.css"
import { useTheme } from '../Style/ThemeContext';
import LobbyContainer from '../Components/LobbyContainer';
import Player from '../model/Player';
import User from '../model/User';


function Lobbies() {
    const theme=useTheme();


    const lobbyData = [
        { roomNum: '63194', headPlayer: new User('1', 'Emma', '', null, null), nbPlayer: 6 },
        { roomNum: '81194', headPlayer: new User('2', 'Ray', '', null, null), nbPlayer: 1 },
        { roomNum: '22194', headPlayer: new User('3', 'Norman', '', null, null), nbPlayer: 4 },
        { roomNum: 'null', headPlayer: new User('null', 'tnull', '', null, null), nbPlayer: 1 },
        { roomNum: '111111', headPlayer: new User('11', '1111111', '', null, null), nbPlayer: 1 },
        { roomNum: '741852963', headPlayer: new User('3', 'Guest_741852963', '', null, null), nbPlayer: 6 },
    ];


    const [searchTerm, setSearchTerm] = useState('');

    const filteredLobbies = lobbyData.filter((lobby) =>
    lobby.roomNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lobby.headPlayer.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
);

    

    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h1>Bienvenue dans le lobby des lobbies</h1>
            <input
                type="text"
                className='searchLobby'
                placeholder="Rechercher un lobby..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="lobbyList">
                {filteredLobbies.map((lobby, index) => (
                <LobbyContainer
                    key={index}
                    roomNum={lobby.roomNum}
                    HeadPlayer={lobby.headPlayer}
                    nbPlayer={lobby.nbPlayer}
                />
                ))}
            </div>
        </div>
    );
}

export default Lobbies;
