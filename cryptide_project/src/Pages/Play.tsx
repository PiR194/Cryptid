import React, { useEffect, useRef, useState } from 'react';

/* Context */
import { useAuth } from '../Contexts/AuthContext';

/* Style */
import './Play.css';
import { useTheme } from '../Style/ThemeContext';

/* Component */
import ButtonImgNav from "../Components/ButtonImgNav";

/* Img */
/* Icon */
import { socket } from '../SocketConfig';
import { useNavigate } from 'react-router-dom';
import GameCreator from '../model/GameCreator';
import { useGame } from '../Contexts/GameContext';
import ScoreBoard from '../Components/ScoreBoard';

import defaultImg from "../res/img/Person.png"

/* Types */
import User from '../model/User';
import EnigmeDuJourCreator from '../model/EnigmeDuJourCreator';
import Stub from '../model/Stub';

import SessionService from '../services/SessionService';
import { loadImageAsync } from '../ImageHelper';


import { Overlay, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


function Play() {
    let first = true

    const theme=useTheme()
    const {isLoggedIn, login, user, setUserData, manager } = useAuth();
    const {setDailyEnigmeData} = useGame()

    const target = useRef(null);


    useEffect(() => {
        const fetchUserInformation = async () => {
            try {
                const sessionData = await SessionService.getSession();
                
                // Vérifie si il y a une session
                if (sessionData.user) {
                    // Il y a une session on récupère les infos du joueur
                    const updatedPlayer: User = new User(socket.id, sessionData.user.pseudo, sessionData.user.profilePicture, {
                        nbGames: sessionData.user.soloStats.nbGames,
                        bestScore: sessionData.user.soloStats.bestScore,
                        avgNbTry: sessionData.user.soloStats.avgNbTry,
                    },
                    {
                        nbGames: sessionData.user.onlineStats.nbGames,
                        nbWins: sessionData.user.onlineStats.nbWins,
                        ratio: sessionData.user.onlineStats.ratio,
                    })
                    login();
                    setUserData(updatedPlayer);
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
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserInformation();
    }, [isLoggedIn]);


    const { setIndicesData, setPersonData, setPersonNetworkData } = useGame();


    useEffect(() => {

        if (user == null){
            manager.userService.fetchUserInformation().then(([user, loggedIn]) =>{
                if (user!=null){
                    if (loggedIn){
                        login()
                        setUserData(user)
                    }
                    else{
                        loadImageAsync(defaultImg).then((blob) => {
                            user.profilePicture=blob
                            setUserData(user)
                        })
                    }
                }
            })
        }
    }, [isLoggedIn]);

    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    function createLobby(){
        socket.emit("lobby created")
    }

    useEffect(() => {
        console.log(user)
    }, [user])

    function launchMastermind(){
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(3, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        setIndicesData(choosenIndices)
        navigate('/game?solo=true&daily=false');
    }

    
    function launchEngimeJour(){
        //* overlay
        
        if (!showOverlay)setShowOverlay(true)
        else setShowOverlay(true)

    }
    

    useEffect(() => {
        const handleLobbyCreated = (newRoom: any) => {
            setRoom(newRoom);
        };
    
        // Ajouter l'event listener
        socket.on('lobby created', handleLobbyCreated);
    
        // Nettoyer l'event listener lors du démontage du composant
        return () => {
            socket.off('lobby created', handleLobbyCreated);
        };
        
      }, []);  // Aucune dépendance ici

    useEffect(() => {
        if (room !== null) {
            const nouvelleURL = `/lobby?room=${room}`;
            navigate(nouvelleURL);
        }
    }, [room, navigate]);



    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);

    //@ts-ignore
    const handleDifficultyChange = (value) => {
        setSelectedDifficulty(value);
    };

    const handleStartEasyGame = () => {

        //* Mode facile 
        //todo différencier les deux
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(3, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        navigate('/game?solo=true&daily=true&easy=true');
        setShowOverlay(false);
    };

    const handleStartHardGame = () => {
        //* Mode difficile

        //todo différencier les deux
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(3, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        if (first){
            first = false
            const map = EnigmeDuJourCreator.createEnigme(networkPerson, choosenIndices, choosenPerson, Stub.GenerateIndice())
            setDailyEnigmeData(map)
        }
        navigate('/game?solo=true&daily=true&easy=false');
        setShowOverlay(false);
    };


    return (

        <div className="MainContainer">
            <div className="leftContainer">
                {/* <button className='ButtonNav'>
                    Param
                </button> */}
                {/* <ButtonImgNav dest='/signup' img={defaultImg} text="Gestion du compte"/> */}
            </div>
            <div className="MidContainer">
                <div>
                    <h2>
                        {user && user.pseudo}
                    </h2>
                    <img src={user?.profilePicture}
                            height='300'
                            width='300'
                            alt="Person"
                            />
                </div>
                <div className='buttonGroupVertical'>
                    <button onClick={launchMastermind} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Jouer seul </button>
                    
                    
                    <button ref={target} onClick={launchEngimeJour} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Résoudre une énigme</button>
                    <Overlay show={showOverlay} target={target.current} placement="bottom" rootClose={true} rootCloseEvent='click'>
                        {({ placement, arrowProps, show: _show, popper, ...props }) => (
                            <div
                                {...props}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    padding: '2px 10px',
                                    borderRadius: 3,
                                    ...props.style,
                                }}>

                                <ButtonGroup aria-label="difficulty">
                                    <Button onClick={handleStartEasyGame}>Facile</Button>
                                    <Button onClick={handleStartHardGame}>Difficile</Button>
                                </ButtonGroup>
                            </div>
                        )}
                    </Overlay>


                    <button onClick={createLobby} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Créer une partie </button>
                    {/* <button  className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Rejoindre </button> */}
                    
                </div>
            </div>
            <div className='rightContainer'>
                {user && (<ScoreBoard Player={user}/>)}
            </div>
        </div>
    );
}

export default Play;