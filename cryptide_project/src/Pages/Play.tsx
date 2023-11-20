import React, { useEffect, useState } from 'react';

/* Style */
import './Play.css';
import { useTheme } from '../Style/ThemeContext';

/* Nav */
import { Link } from 'react-router-dom';

/* Component */
import ButtonImgNav from "../Components/ButtonImgNav"
import SessionService from "../services/SessionService";

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
<<<<<<< HEAD
import { set } from 'lodash';
=======
import ScoreBoard from '../Components/ScoreBoard';
>>>>>>> origin


function Play() {
    const theme=useTheme()
    const [username, setUsername] = useState('');
    const [nbSoloGames, setNbSoloGames] = useState(0);
    const [soloBestScore, setSoloBestScore] = useState(0);
    const [soloAverageTry, setSoloAverageTry] = useState(0);

    useEffect(() => {
        const fetchUserInformation = async () => {
          try {
            const sessionData = await SessionService.getSession();
      
            console.log(sessionData);
            // Vérifie si il y a une session
            if (sessionData.user) {
              setUsername(sessionData.user.pseudo);
              setNbSoloGames(sessionData.user.soloStats.nbGames);
              setSoloBestScore(sessionData.user.soloStats.bestScore);
              setSoloAverageTry(sessionData.user.soloStats.averageTry);
            } else {
              // Pas de session on génère un guest random
              setUsername(`Guest ${Math.floor(Math.random() * 100000)}`);
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchUserInformation();
    }, []);
      

    const { setIndicesData, setPersonData, setPersonNetworkData } = useGame();


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
<<<<<<< HEAD
        if (room !== null) {
            const nouvelleURL = `/lobby?room=${room}`;
            navigate(nouvelleURL);
        }
    }, [room, navigate]);
=======
    if (room !== null) {
        const nouvelleURL = `/lobby?room=${room}`;
        navigate(nouvelleURL);
    }
    }, [room, navigate]);


>>>>>>> origin

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
                        {username}
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
<<<<<<< HEAD
                <div className='LeaderBoardiv'>
                    <img src={trophy}
                                height='100'
                                width='100'
                                alt="Person2"
                                />
                    <div className='textBoard'>
                        <div>
                            <h4>
                                Parties jouées : <br/>
                                High-Score : <br/>
                                Nombre d'essaie moyen : <br/>
                            </h4>
                        </div>
                        <div>
                            <h4>
                                {nbSoloGames} <br/>
                                {soloBestScore} <br/>
                                {soloAverageTry} <br/>
                            </h4>
                        </div>
                    </div>
                    {/* <button className='ButtonNav'>
                        Share
                    </button> */}
                    <ButtonImgNav dest='/' img={share}/>
                </div>
=======
                <ScoreBoard/>
>>>>>>> origin
            </div>
        </div>
    );
}

export default Play;