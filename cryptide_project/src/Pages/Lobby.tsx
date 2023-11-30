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


let gameStarted = false

function Lobby() {
    const theme=useTheme();
    const navigate = useNavigate();
    

    const { indices, setIndicesData, indice, setIndiceData, person, setPersonData, personNetwork, setPersonNetworkData, players, setPlayersData, setActualPlayerIndexData, setTurnPlayerIndexData, setRoomData } = useGame();
    
    const {user, setUserData, manager, login} = useAuth()
    let first = true

    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');

    function addBot(){
        socket.emit("lobby joined", room, new EasyBot("botId" + Math.floor(Math.random() * 1000), "Bot" + Math.floor(Math.random() * 100), "").toJson())
    }

    

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
        first = true
        gameStarted = true
        socket.off("player left")
        socket.off("new player")
        navigate('/game?solo=false&daily=false');
    });

    socket.on("new player", (tab) =>{
        const tmpTab: Player[] = []
        for (const p of tab){
            tmpTab.push(JSONParser.JSONToPlayer(p))
        }
        console.log(tmpTab)
        setPlayersData(tmpTab)
    })

    socket.on("player left", (tab, i) => {
        const tmpTab: Player[] = []
        for (const p of tab){
            tmpTab.push(JSONParser.JSONToPlayer(p))
        }
        setPlayersData(tmpTab)
    })

    const [codeShowed, setCodeShowed] = useState(true);


    function StartGame(){
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(players.length, 30)
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



    const copyGameLink = () => {
        setShow(!show)
        
        const gameLink = "http://172.20.10.4:3000/lobby?room="+ room;
        navigator.clipboard.writeText(gameLink)
            .then(() => {
                console.log('Lien copié avec succès !');
            })
            .catch((err) => {
                console.error('Erreur lors de la copie du lien :', err);
            });
    };

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const linkToCopy = "http://172.20.10.4:3000/lobby?room="+ room
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
                    <div className='codeDiv' onClick={() => setCodeShowed(!codeShowed)}>
                        {
                            codeShowed ? (
                                <p>Room : {room}</p>
                            ) : (
                                <p>Room : ******</p>
                            )
                        }
                    </div>
                    {/* //! voir pour la gestion avec un liste, utilisateur avec le "+ (vous)" et les pdp avec les lettres grecs (?)*/}
                    {players.map((player, index) => (
                        // <PlayerItemList key={player.id} pdp={PersonImg} name={player.name} id={player.id}/>
                        <PlayerItemList key={player.id} player={player} room={room}/>
                    ))}
                    <div className='centerButton'>
                            <button className='button' onClick={addBot}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.secondary}}>
                                +
                            </button>
                    </div>
                </div>
            </div>

            <div className="lobby-vertical-divider" style={{backgroundColor: theme.colors.secondary}}></div>

            <div className='right-part'>
                {/* <div className='title-param-div'>
                    <img src={param} alt="param"/>
                    <h2>Paramètre de la partie</h2>
                </div>
                <ul> */}
                    {/* <li><h4> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>paramètre super important pour la partie</h4></li>
                    <li><h4>Niveau des bots : Facile </h4></li>
                    <li><h4>Thèmes : basique </h4></li> */}
                    {
                        //? mettre un timer pour chaques personne ?
                        //? indice avancé ? ==> négation, voisin du 2e degré etc.
                    }
                {/* </ul> */}
                {/* <center >
                    <button className='buttonNabImg' onClick={StartGame}>
                        <img src={cible} alt="Button Image" height="50" width="50" />
                        <p>{"la chasse !"}</p>
                    </button>
                </center> */}

                <div className='lobbyR' 
                    style={{flexDirection:'column',
                            alignItems:'space-around'}}>
                        <h3>Bienvenue dans votre lobby !</h3>
                        <p>Attendez que tous vos amis rejoignent avant de lancer la partie.</p>
                        {/* Bouton pour copier le lien */}
                        {/* <Button variant="primary" ref={target} onClick={copyGameLink}>
                            Inviter des amis
                        </Button> */}
                        <div>
                            <textarea
                                ref={textAreaRef}
                                readOnly
                                value={linkToCopy}
                                style={{ position: 'absolute', left: '-9999px' }}
                            />
                            <Button onClick={handleCopyClick}>Inviter des amis</Button>
                        </div>

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
                            Lien copié
                        </div>
                        )}
                    </Overlay>

                    <button className='button' onClick={StartGame}
                        style={{ 
                            backgroundColor: theme.colors.tertiary,
                            borderColor: theme.colors.secondary,
                            width: 'auto',
                            height: 'auto'
                        }}>
                        Démarrer la partie !
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
