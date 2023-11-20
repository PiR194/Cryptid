import React from 'react';
import {useEffect, useState} from 'react';

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


function Play() {
    const theme=useTheme()
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserInformation = async () => {
          try {
            const sessionData = await SessionService.getSession();
      
            console.log(sessionData);
            // Vérifie si il y a une session
            if (sessionData.user) {
              setUsername(sessionData.user.pseudo);
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
                    <Link to="/lobby">
                        <button className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Jouer seul </button>
                    </Link>
                    <Link to="/">
                        <button className="ButtonNav" style={{backgroundColor: theme.colors.primary, borderColor: theme.colors.secondary}}> Créer une partie </button>
                    </Link>
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