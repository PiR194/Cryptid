import React, { useEffect, useState } from 'react';

/* Style */
import './Lobby.css';
import "../Style/Global.css"
import { useTheme } from '../Style/ThemeContext';

/* res */
import PlayerItemList from '../Components/PlayerItemList'
import PersonImg from '../res/img/Person.png';
import param from '../res/icon/param.png';
import cible from '../res/icon/cible.png';

import defaultImg from "../res/img/Person.png"

/* Component */
import ButtonImgNav from '../Components/ButtonImgNav';

import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

/* Context */
import { useGame } from '../Contexts/GameContext';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/* Model */
import PersonNetwork from '../model/PersonsNetwork';
import Person from '../model/Person';
import GameCreator from '../model/GameCreator';
import Indice from '../model/Indices/Indice';
import JSONParser from '../JSONParser';
import Player from '../model/Player';
import EasyBot from '../model/EasyBot';
import Bot from '../model/Bot';
import User from '../model/User';
import {loadImageAsync} from "../ImageHelper"


/* serv */
import { socket } from "../SocketConfig";
import { random } from 'lodash';
import SessionService from '../services/SessionService';

import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import { DataSet } from 'vis-network';
import {basePath} from "../AdressSetup"

import { FormattedMessage } from 'react-intl';


let gameStarted = false
let firstLaunch = true

function Lobby() {
    const theme=useTheme();
    const navigate = useNavigate();
    
    const { indices, setIndicesData, setGameStartData, indice, setIndiceData, person, setPersonData, personNetwork, setPersonNetworkData, players, setPlayersData, setActualPlayerIndexData, setTurnPlayerIndexData, setRoomData, setNodesData } = useGame();
    
    const {user, setUserData, manager, login} = useAuth()
    let first = true

    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');

    function addBot(){
        let json = require("../res/botNames.json")
        const tabNames = [...json.names]
        let name = tabNames[Math.floor(Math.random() * tabNames.length)]
        while (players.find((p) => p.pseudo === name) != undefined){
            name = tabNames[Math.floor(Math.random() * tabNames.length)]
        }
        socket.emit("lobby joined", room, new EasyBot(name, name, "").toJson())
    }

    //* nb Node
    const [enteredNumber, setEnteredNumber] = useState(25);

    //@ts-ignore
    const handleNumberChange = (event) => {
        const newNumber = Math.max(20, Math.min(60, parseInt(event.target.value, 10)));
        setEnteredNumber(newNumber);
    };

    useEffect(() => {
        if (first){
            first=false

            if (user == null){
                manager.userService.fetchUserInformation().then(([u, loggedIn]) => {
                    if (u!=null){
                        if (loggedIn){
                            login()
                            setUserData(u)
                        }
                        else{
                            loadImageAsync(defaultImg).then((blob) => {
                                u.profilePicture=blob
                                setUserData(u)
                            })
                        }
                        socket.emit("lobby joined", room, u.toJson())
                    }
                })
            }
            else{
                socket.emit("lobby joined", room, user.toJson())
            }

            return () => {
                socket.off('game created');
            };
        }
        
    }, [socket.id]);

    socket.on("game created", (jsonNetwork, jsonPersonString, jsonIndicesString, playerIndex)=> {
        const jsonPerson = JSON.parse(jsonPersonString)
        const network: PersonNetwork = JSONParser.JSONToNetwork(jsonNetwork)
        const choosenOne: Person = network.getPersons().filter((i) => i.getId() == jsonPerson.id)[0]
        const choosenIndices : Indice[] = JSONParser.JSONToIndices(jsonIndicesString)
        for (let i=0; i<players.length; i++){
            const player = players[i]
            if(player.id == socket.id){
                setActualPlayerIndexData(i)
                setIndiceData(choosenIndices[i])
            }
            if (player instanceof Bot){
                player.indice = choosenIndices[i]
            }
        }
        if (room != null){
            setRoomData(room)
        }
        setTurnPlayerIndexData(playerIndex)
        setPersonData(choosenOne)
        setPersonNetworkData(network)
        setIndicesData(choosenIndices)
        setGameStartData(true)
        first = true
        gameStarted = true
        //socket.off("player left")
        //socket.off("new player")
        navigate(`${basePath}/game?solo=false&daily=false`);
    });


    socket.on("join during game", (jsonNetwork, jsonPersonString, jsonIndicesString, playerIndex, players, nodes)=> {
        const jsonPerson = JSON.parse(jsonPersonString)
        const networkPerson: PersonNetwork = JSONParser.JSONToNetwork(jsonNetwork)
        const choosenOne: Person = networkPerson.getPersons().filter((i) => i.getId() == jsonPerson.id)[0]
        const choosenIndices : Indice[] = JSONParser.JSONToIndices(jsonIndicesString)
        for (let i=0; i<players.length; i++){
            const player = players[i]
            if(player.id == socket.id){
                setActualPlayerIndexData(i)
                setIndiceData(choosenIndices[i])
            }
            if (player instanceof Bot){
                player.indice = choosenIndices[i]
            }
        }
        const tmpPlayers: Player[] = []
        console.log(players)
        for (const p of players){
            tmpPlayers.push(JSONParser.JSONToPlayer(p))
        }
        setPlayersData(tmpPlayers)
        if (room != null){
            setRoomData(room)
        }
        const tab = JSONParser.JSONToNodePersons(JSON.parse(nodes))
        setNodesData(tab)
        setTurnPlayerIndexData(playerIndex)
        setPersonData(choosenOne)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        setGameStartData(true)
        first = true
        gameStarted = true
        navigate(`${basePath}/game?solo=false&daily=false`)
    });

    socket.on("new player", (tab) =>{
        const tmpTab: Player[] = []
        for (const p of tab.tab){
            tmpTab.push(JSONParser.JSONToPlayer(p))
        }
        setPlayersData(tmpTab);

    });

    socket.on("room full", () => {
        navigate(`${basePath}/`)
    })

    socket.on("game started", () => {
        navigate(`${basePath}/`)
    })

    socket.on("game already started", () => {
        navigate(`${basePath}/`)
    })

    socket.on("player left", (tab, i) => {
        const tmpTab: Player[] = []
        for (const p of tab.tab){
            tmpTab.push(JSONParser.JSONToPlayer(p))
        }
        setPlayersData(tmpTab)
    })

    const [codeShowed, setCodeShowed] = useState(true);


    function StartGame(){
        if (players.length > 2){
            const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(players.length, enteredNumber)
            setPersonData(choosenPerson)
            setPersonNetworkData(networkPerson)
            setIndicesData(choosenIndices)
            let users = players.filter((p) => p instanceof User)
            let u = users[Math.floor(Math.random() * users.length)]
            let start = players.findIndex((p) => p.id == u.id)
            if (start == -1){
                start = 0
            }
            socket.emit('network created', JSON.stringify(networkPerson, null, 2), JSON.stringify(choosenPerson), JSON.stringify(choosenIndices), room, start);
        }
    }

    const copyGameLink = () => {
        setShow(!show)
        
        const gameLink = basePath + "/lobby?room="+ room;
        navigator.clipboard.writeText(gameLink)
            .then(() => {
                console.log('Lien copié avec succès !');
            })
            .catch((err) => {
                console.error('Erreur lors de la copie du lien :', err);
            });
    };

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const linkToCopy = basePath + "/lobby?room="+ room
    const handleCopyClick = () => {
        setShow(!show)
        if(textAreaRef.current != null){
            textAreaRef.current.select();
            document.execCommand('copy');
        }
    };



    const [show, setShow] = useState(false);
        const target = useRef(null);
    return (
        <div className='lobby-container'>
            <div className='left-part'>
                <div className='player-board'>
                    <div>
                        <div className='codeDiv' onClick={() => setCodeShowed(!codeShowed)}>
                            {
                                codeShowed ? (
                                    <p>Room : {room}</p>
                                ) : (
                                    <p>Room : ******</p>
                                )
                            }
                        </div>
                        <div className='NumbDiv'>
                            {players.length == 6 ? (
                                    <p style={{color:'darkred'}}>6/6 <FormattedMessage id='lobby.players'/></p>
                                ) : (
                                    <p>{players.length}/6 <FormattedMessage id='lobby.players'/></p>
                                )
                            }
                        </div>
                    </div>

                    {/* //! voir pour la gestion avec un liste, utilisateur avec le "+ (vous)" et les pdp avec les lettres grecs (?)*/}
                    {players.map((player, index) => (
                        // <PlayerItemList key={player.id} pdp={PersonImg} name={player.name} id={player.id}/>
                        <PlayerItemList key={player.id} player={player} room={room}/>
                    ))}
                    {(players.length < 6) && <div className='centerButton'>
                            <button className='button' onClick={addBot}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.secondary}}>
                                +
                            </button>
                    </div>
                    }
                </div>
            </div>

            <div className="lobby-vertical-divider" style={{backgroundColor: theme.colors.secondary}}></div>

            <div className='right-part'>
                <div className='lobbyR' 
                    style={{flexDirection:'column',
                            alignItems:'space-around'}}>
                        <h3><FormattedMessage id='lobby.bienvenue'/></h3>
                        <p><FormattedMessage id='lobby.wait'/></p>
                        {/* Bouton pour copier le lien */}
                        {/* <Button variant="primary" ref={target} onClick={copyGameLink}>
                            <FormattedMessage id='lobby.invite'/>
                        </Button> */}
                        <Overlay target={target.current} show={show} placement="top">
                            {({
                            placement: _placement,
                            arrowProps: _arrowProps,
                            show: _show,
                            popper: _popper,
                            hasDoneInitialMeasure: _hasDoneInitialMeasure,
                            ...props
                            }) => (
                            <div
                                {...props}
                                style={{
                                position: 'absolute',
                                backgroundColor: theme.colors.secondary,
                                padding: '2px 10px',
                                color: 'white',
                                borderRadius: 3,
                                ...props.style,
                                }}
                            >
                            <FormattedMessage id='lobby.copyLink'/>
                        </div>
                        )}
                    </Overlay>

                <div className='nbNodeDiv'>
                    <label htmlFor="numberInput"> <FormattedMessage id='lobby.nbNode'/> :</label>
                    <div>
                        <button className='valuebutton' onClick={() => { if (enteredNumber>20) setEnteredNumber(enteredNumber-1)}}
                            style={{borderColor:theme.colors.secondary}}> - </button>
                        <input
                            // type="number"
                            style={{textAlign:'center'}}
                            id="numberInput"
                            disabled
                            value={enteredNumber}
                            onChange={handleNumberChange}
                            min={20}
                            max={60}/>
                        <button className='valuebutton' onClick={() => { if (enteredNumber<50) setEnteredNumber(enteredNumber+1)}}
                            style={{borderColor:theme.colors.secondary}}> + </button>
                    </div>
                </div>


                    <button className='button' onClick={StartGame}
                        style={{ 
                            backgroundColor: theme.colors.tertiary,
                            borderColor: theme.colors.secondary,
                            width: 'auto',
                            height: 'auto'
                        }}>
                        <FormattedMessage id='lobby.start'/>
                    </button>
                </div>
            </div>
        </div>
    );

    function shuffleArray(array: Indice[]) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

export default Lobby;
