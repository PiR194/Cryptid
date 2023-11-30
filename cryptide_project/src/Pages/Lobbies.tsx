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
    started: boolean

    constructor(roomNum: string, player: Player, nbPlayer: number, started: boolean){
        this.roomNum = roomNum
        this.headPlayer = player
        this.nbPlayer = nbPlayer
        this.started=started
    }
}

function Lobbies() {
    const theme=useTheme();


    const [first, setFirst] = useState(true)

    const [lobbyData, setLobbyData] = useState<LobbyDataProps[]>([])

    const [searchTerm, setSearchTerm] = useState('');

    const filteredLobbies = lobbyData.filter((lobby) =>
    lobby.roomNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lobby.headPlayer.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
);


    const setFirstData = (first: boolean) => {
        setFirst(first)
    }

    if (first){
        setFirst(false)
        socket.emit("request lobbies")
    }

    useEffect(() => {
        socket.on("request lobbies", (map) => {
            console.log("wesh")
            const jsonMap = JSON.parse(map)
            const tmpTab: LobbyDataProps[]=[]
            for(const item of jsonMap){
                tmpTab.push(new LobbyDataProps(item.key, JSONParser.JSONToPlayer(item.value.tab[0]), item.value.tab.length, item.value.started))
            }
            setLobbyData(tmpTab)
        })
    }, [])

    

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
                    setFirst={setFirstData}
                />
                ))}
            </div>
        </div>
    );
}

export default Lobbies;
