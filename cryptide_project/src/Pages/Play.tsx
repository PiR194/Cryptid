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
import { NavigationType, useNavigate, useNavigationType } from 'react-router-dom';
import GameCreator from '../model/GameCreator';
import { useGame } from '../Contexts/GameContext';
import ScoreBoard from '../Components/ScoreBoard';

import defaultImg from "../res/img/Person.png"

/* Types */
import EnigmeDuJourCreator from '../model/EnigmeDuJourCreator';
import Stub from '../model/Stub';

import SessionService from '../services/SessionService';
import { loadImageAsync } from '../ImageHelper';
import { Overlay, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Info from '../res/icon/infoGreen.png';

let cptNavigation = 0

const basePath = process.env.BASEPATH || '';


function Play() {
    let first = true

    const theme=useTheme()
    const {isLoggedIn, login, user, setUserData, manager } = useAuth();
    const {setDailyEnigmeData, setIndicesData, setPersonData, setPersonNetworkData } = useGame()
    const target = useRef(null);

    const navigationType = useNavigationType()
    cptNavigation++
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
        }
    }



    useEffect(() => {
        if (user == null){
            manager.userService.fetchUserInformation().then(([user, loggedIn]) =>{
                console.log(user);
                
                if (user!=null){
                    if (loggedIn){
                        login()
                        setUserData(user)
                        socket.emit("join back game", user)
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
        else{
            socket.emit("join back game", user)
        }
    }, [isLoggedIn]);

    const [goBackRoom, setGoBackRoom] = useState(-1)

    useEffect(() => {
        socket.on("join back game", (room) => {
            setGoBackRoom(room)
        })
    }, [])


    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    function createLobby(){
        socket.emit("lobby created")
    }

    function launchMastermind(){
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(3, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        setIndicesData(choosenIndices)
        navigate(`${basePath}/game?solo=true&daily=false`);
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
            navigate(`${basePath}${nouvelleURL}`);
        }
    }, [room, navigate]);

    const goBack = () => {
        navigate(`${basePath}/lobby?room=${goBackRoom}`)
    }



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
        setIndicesData(choosenIndices)

        navigate(`${basePath}/game?solo=true&daily=true&easy=true`);
        setShowOverlay(false);
    };

    const handleStartHardGame = () => {
        //* Mode difficile

        //todo différencier les deux
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(3, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        setIndicesData(choosenIndices)
        if (first){
            first = false
            const map = EnigmeDuJourCreator.createEnigme(networkPerson, choosenIndices, choosenPerson, Stub.GenerateIndice())
            setDailyEnigmeData(map)
        }
        navigate(`${basePath}/game?solo=true&daily=true&easy=false`);
        setShowOverlay(false);
    };


    return (

        <div className="MainContainer">
            <div className="leftContainer">
                {goBackRoom != -1 && 
                    <div className='returnDiv'>
                        <div style={{
                            display:'flex',
                            alignItems:'center'
                        }}>
                            <img src={Info} alt='info' height='50px' width='50px'/>
                            <h1>Information</h1>
                        </div>
                        <p> Il semblerait que vous avez quitté une partie en cours... <br/> <i>Et si nous y retournions ?</i></p>
                        <button onClick={goBack} className="ButtonNav" 
                            style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}>
                            Retourner à la partie
                        </button>
                    </div>
                }
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
                    <button onClick= {() => navigate(`${basePath}/join`)} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Rejoindre </button>
                </div>
            </div>
            <div className='rightContainer'>
                {user && (<ScoreBoard Player={user}/>)}
            </div>
        </div>
    );
}

export default Play;