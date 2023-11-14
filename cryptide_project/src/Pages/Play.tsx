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


function Play() {
    const theme=useTheme()

    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    function createLobby(){
        socket.emit("lobby created")
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
                    <Link to="/">
                        <button className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Jouer seul </button>
                    </Link>
                    <button onClick={createLobby} className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Créer une partie </button>
                    <Link to="/">
                        <button className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Rejoindre </button>
                    </Link>
                </div>
            </div>
            <div className='rightContainer'>
                <div className='LeaderBoardiv'>
                    <img src={trophy}
                                height='100'
                                width='100'
                                alt="Person2"
                                />
                    <div className='textBoard'>
                        <div>
                            <h4>
                                Partie Jouées : <br/>
                                Partie gagnées : <br/>
                                Pions posés : <br/>
                            </h4>
                        </div>
                        <div>
                            <h4>
                                10 <br/>
                                2 <br/>
                                45 <br/>
                            </h4>
                        </div>
                    </div>
                    {/* <button className='ButtonNav'>
                        Share
                    </button> */}
                    <ButtonImgNav dest='/' img={share}/>
                </div>
            </div>
        </div>
    );
}

export default Play;