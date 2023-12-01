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

    const [showAvailable, setShowAvailable] = useState(true);

    const handleShowAllClick = () => {
        setShowAvailable(false);
    };
    
    const handleShowAvailableClick = () => {
        setShowAvailable(true);
    };


    const filteredLobbies = lobbyData.filter((lobby) =>
        lobby.roomNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lobby.headPlayer.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLobbiesToShow = showAvailable
    ? filteredLobbies.filter((lobby) => lobby.started == false)
    : filteredLobbies;



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

            {/* <div>
                <button style={{borderColor:'whitesmoke', borderRadius:'15px 0px 0px 15px', padding:'5px'}}
                        onClick={() => setShowAvailable(false)}>Tous</button>
                <button style={{borderColor:'whitesmoke', borderRadius:'0px 15px 15px 0px', padding:'5px'}}
                        onClick={() => setShowAvailable(true)}>Dispo</button>
            </div> */}

        <div style={{border:'solid 3px', borderColor:'lightgray', borderRadius:'20px', margin:'10px'}}>
            <button
                style={{
                    border:'solid',
                    borderStyle:'none',
                    borderRadius: '15px 0px 0px 15px',
                    borderWidth: '2px',
                    padding: '10px 15px',
                    backgroundColor: !showAvailable ? 'white' : 'lightgray',
                }}
                onClick={handleShowAllClick}
            >
                Tous
            </button>
            <button
                style={{
                    border:'solid',
                    borderStyle:'none',
                    borderRadius: '0px 15px 15px 0px',
                    padding: '10px 15px',
                    backgroundColor: showAvailable ? 'white' : 'lightgray',
                }}
                onClick={handleShowAvailableClick}
            >
                Disponible
            </button>
        </div>


            <div className="lobbyList">
                {filteredLobbiesToShow.map((lobby, index) => (
                <LobbyContainer
                    key={index}
                    roomNum={lobby.roomNum}
                    HeadPlayer={lobby.headPlayer}
                    nbPlayer={lobby.nbPlayer}
                    setFirst={setFirstData}
                    started={lobby.started}
                />
                ))}
            </div>
        </div>
    );
}

export default Lobbies;
