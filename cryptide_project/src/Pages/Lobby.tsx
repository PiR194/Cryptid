import React, { useEffect, useState } from 'react';
import './Lobby.css';
import { useTheme } from '../Style/ThemeContext';

/* res */
import PlayerItemList from '../Components/PlayerItemList'
import PersonImg from '../res/img/Person.png';
import param from '../res/icon/param.png';
import cible from '../res/icon/cible.png';

/* Component */
import ButtonImgNav from '../Components/ButtonImgNav';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import PersonNetwork from '../model/PersonsNetwork';
import Person from '../model/Person';
import GameCreator from '../model/GameCreator';
import { useGame } from '../Contexts/GameContext';
import JSONParser from '../JSONParser';
import Indice from '../model/Indices/Indice';
import { useNavigate } from 'react-router-dom';
import { socket } from "../SocketConfig";
import { random } from 'lodash';
import Player from '../model/Player';
import EasyBot from '../model/EasyBot';
import Bot from '../model/Bot';
import User from '../model/User';
import { useAuth } from '../Contexts/AuthContext';
import SessionService from '../services/SessionService';


let gameStarted = false

function Lobby() {
    const theme=useTheme();
    const navigate = useNavigate();


    const { indices, setIndicesData, indice, setIndiceData, person, setPersonData, personNetwork, setPersonNetworkData, players, setPlayersData, setActualPlayerIndexData, setTurnPlayerIndexData, setRoomData } = useGame();
    
    const {user, setUserData} = useAuth()
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
                try {
                    const sessionData = SessionService.getSession();
                    sessionData.then((s) => {
                        if (s.user) {
                            // Il y a une session on récupère les infos du joueur
                            const updatedPlayer: User = new User(socket.id, s.user.pseudo, s.user.profilePicture, {
                                nbGames: s.user.soloStats.nbGames,
                                bestScore: s.user.soloStats.bestScore,
                                avgNbTry: s.user.soloStats.avgNbTry,
                            },
                            {
                                nbGames: s.user.onlineStats.nbGames,
                                nbWins: s.user.onlineStats.nbWins,
                                ratio: s.user.onlineStats.ratio,
                            })
                            setUserData(updatedPlayer);
                            socket.emit("lobby joined", room, updatedPlayer.toJson())
                        } else {
                            // Pas de session on génère un guest random
                            const guestPlayer: User = new User(socket.id, 'Guest_' + Math.floor(Math.random() * 1000000), '',
                            {
                                nbGames: 0,
                                bestScore: 0,
                                avgNbTry: 0,
                            },
                            {
                                nbGames: 0,
                                nbWins: 0,
                                ratio: 0,
                            })
                            setUserData(guestPlayer);
                            socket.emit("lobby joined", room, guestPlayer.toJson())

                        }
                    })
                }
                catch (error) {
                    console.error(error);
                }
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
        navigate('/game?solo=false');
    });

    socket.on("new player", (tab) =>{
        const tmpTab: Player[] = []
        for (const p of tab){
            tmpTab.push(JSONParser.JSONToPlayer(p))
        }
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
                <center >
                    <button className='buttonNabImg' onClick={StartGame}>
                        <img src={cible} alt="Button Image" height="50" width="50"/>
                        <p>{"la chasse !"}</p>
                    </button>
                </center>
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
