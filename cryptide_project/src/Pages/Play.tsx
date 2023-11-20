import React, { useEffect, useState } from 'react';

/* Style */
import './Play.css';
import { useTheme } from '../Style/ThemeContext';

/* Nav */
import { Link } from 'react-router-dom';

/* Component */
import ButtonImgNav from "../Components/ButtonImgNav"

/* Img */
import Person from '../res/img/Person.png';

/* Icon */
import trophy from '../res/icon/trophy.png';
import param from '../res/icon/param.png';
import share from '../res/icon/share.png';
import { socket } from '../SocketConfig';
import { useNavigate } from 'react-router-dom';
import GameCreator from '../model/GameCreator';
import { useGame } from '../Contexts/GameContext';
import ScoreBoard from '../Components/ScoreBoard';


function Play() {
    const theme=useTheme()

    const { setIndicesData, setPersonData, setPersonNetworkData } = useGame();


    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    function createLobby(){
        socket.emit("lobby created")
    }

    function launchMastermind(){
        const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(5, 30)
        setPersonData(choosenPerson)
        setPersonNetworkData(networkPerson)
        setIndicesData(choosenIndices)
        setIndicesData(choosenIndices)
        navigate('/game?solo=true');
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



    return (

        <div className="MainContainer">
            <div className="leftContainer">
                {/* <button className='ButtonNav'>
                    Param
                </button> */}
                <ButtonImgNav dest='/signup' img={Person} text="Gestion du compte"/>
            </div>
            <div className="MidContainer">
                <div>
                    <h2>
                        Guest 177013
                    </h2>
                    <img src={Person}
                            height='300'
                            width='300'
                            alt="Person"
                            />
                </div>
                <div className='buttonGroupVertical'>
                    <button onClick={launchMastermind} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Jouer seul </button>
                    <button onClick={createLobby} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Créer une partie </button>
                    <button  className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Rejoindre </button>
                    
                </div>
            </div>
            <div className='rightContainer'>
                <ScoreBoard/>
            </div>
        </div>
    );
}

export default Play;