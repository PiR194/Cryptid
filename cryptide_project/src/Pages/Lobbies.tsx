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
import { useNavigationType } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

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

// let cptNavigation = 0

function Lobbies() {
    const theme=useTheme();


    const [first, setFirst] = useState(true)

    const [lobbyData, setLobbyData] = useState<LobbyDataProps[]>([])

    const [searchTerm, setSearchTerm] = useState('');

    const [showAvailable, setShowAvailable] = useState(true);

    const [cptNavigation, setCptNavigation] = useState(0);

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
    ? filteredLobbies.filter((lobby) => lobby.started == false && lobby.nbPlayer < 6) //* retire les lobbies pleins ou commencés
    : filteredLobbies;



    const setFirstData = (first: boolean) => {
        setFirst(first)
    }

    const navigationType = useNavigationType()
    setCptNavigation((prevCpt) => prevCpt + 1);
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
        }
    }

    if (first){
        setFirst(false)
        socket.emit("request lobbies")
    }

    useEffect(() => {
        socket.on("request lobbies", (map) => {
            const jsonMap = JSON.parse(map)
            const tmpTab: LobbyDataProps[]=[]
            
            for(const item of jsonMap){
                tmpTab.push(new LobbyDataProps(item.key, JSONParser.JSONToPlayer(item.value.tab[0]), item.value.tab.length, item.value.started))
            }
            
            setLobbyData(tmpTab)
        })
    }, [])

    function createLobby(){
        socket.emit("lobby created")
    }


    const intl = useIntl();


    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <input
                type="text"
                className='searchLobby'
                placeholder={intl.formatMessage({ id: 'placeholder.searchLobby' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width:'80%', margin:'10px'}}
            />
            
            <div style={{border:'solid 3px', borderColor:'lightgray', borderRadius:'20px', margin:'10px'}}>
                <button
                    style={{
                        width:'120px',
                        border:'solid',
                        borderStyle:'none',
                        borderRadius: '15px 0px 0px 15px',
                        borderWidth: '2px',
                        padding: '10px 15px',
                        backgroundColor: !showAvailable ? 'white' : 'lightgray',
                    }}
                    onClick={handleShowAllClick}
                >
                    <FormattedMessage id='lobbies.all'/>
                </button>
                <button
                    style={{
                        width:'120px',
                        border:'solid',
                        borderStyle:'none',
                        borderRadius: '0px 15px 15px 0px',
                        padding: '10px 15px',
                        backgroundColor: showAvailable ? 'white' : 'lightgray',
                    }}
                    onClick={handleShowAvailableClick}
                >
                    <FormattedMessage id='lobbies.dispo'/>
                </button>
            </div>

                {filteredLobbiesToShow.length === 0 ? (
                        <button onClick={createLobby}  className='ButtonNav' style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}><FormattedMessage id='play.create' /></button>
                    ) : (
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
                )}
        </div>
    );
}

export default Lobbies;
