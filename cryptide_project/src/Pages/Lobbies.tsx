import React, { useEffect, useState } from 'react';

/* Style */
import './Lobbies.css';
import "../Style/Global.css"
import { useTheme } from '../Style/ThemeContext';
import LobbyContainer from '../Components/LobbyContainer';
import Player from '../model/Player';
import User from '../model/User';
import { socket } from '../SocketConfig';
import JSONParser from '../JSONParser';
import Person from '../model/Person';


class LobbyDataProps {
    roomNum : string
    headPlayer: Player
    nbPlayer: number

    constructor(roomNum: string, player: Player, nbPlayer: number){
        this.roomNum = roomNum
        this.headPlayer = player
        this.nbPlayer = nbPlayer
    }
}

function Lobbies() {
    const theme=useTheme();




    const [lobbyData, setLobbyData] = useState<LobbyDataProps[]>([])

    const [searchTerm, setSearchTerm] = useState('');

    const filteredLobbies = lobbyData.filter((lobby) =>
    lobby.roomNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lobby.headPlayer.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
);

    useEffect(() => {
        socket.emit("request lobbies")


        socket.on("request lobbies", (map) => {
            const jsonMap = JSON.parse(map)
            const tmpTab: LobbyDataProps[]=[]
            for(const item of jsonMap){
                tmpTab.push(new LobbyDataProps(item.key, JSONParser.JSONToPlayer(item.value[0]), item.value.length))
            }
            setLobbyData(tmpTab )
        })
    })

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
