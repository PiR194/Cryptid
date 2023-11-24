import React, { useEffect, useState } from 'react';

/* Context */
import { useAuth } from '../Contexts/AuthContext';

/* Style */
import './Play.css';
import { useTheme } from '../Style/ThemeContext';

/* Component */
import ButtonImgNav from "../Components/ButtonImgNav"
import SessionService from "../services/SessionService";

/* Img */
import Person from '../res/img/Person.png';

/* Icon */
import { socket } from '../SocketConfig';
import { useNavigate } from 'react-router-dom';
import GameCreator from '../model/GameCreator';
import { useGame } from '../Contexts/GameContext';
import ScoreBoard from '../Components/ScoreBoard';

/* Types */
import User from '../model/User';

function Play() {
    const theme=useTheme()
    const {isLoggedIn, login, user, setUserData } = useAuth();

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
      
        console.log('isLoggedIn : ', isLoggedIn);
        fetchUserInformation();
    }, [isLoggedIn]);
      

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
                        {user && user.pseudo}
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
                {user && (<ScoreBoard Player={user}/>)}
            </div>
        </div>
    );
}

export default Play;