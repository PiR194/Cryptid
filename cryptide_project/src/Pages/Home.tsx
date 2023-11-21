import React, {useEffect} from 'react';
import { useAuth } from '../Contexts/AuthContext';
import SessionService from '../services/SessionService';
import './Home.css';
import '../App.css';
import { useTheme } from '../Style/ThemeContext';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ButtonImgNav from '../Components/ButtonImgNav';


function Home() {
    const theme=useTheme();
    const {isLoggedIn, login} = useAuth();

    useEffect(() => {
        // Verifie la connexion
        const verifSession = async () => {
            try {
                const sessionData = await SessionService.getSession();
                if (sessionData.user) {
                    login();
                }
            }
            catch (error) {
                console.log(error);
            };
        }

        verifSession();
    }, []);

    return (
        
    <div className="home-container">

        <div className="left-section">

            <div>
                <h2><FormattedMessage id="home.histoire.title"/></h2>
                <p>
                    <FormattedMessage id="home.histoire" />
                </p>
            </div>
            <div>
                <h2><FormattedMessage id="home.jeu.title"/></h2>
                <p>
                    <FormattedMessage id="home.jeu" />
                </p>
            </div>
            <div>
                <h2><FormattedMessage id="home.plus.title"/></h2>
                <ul>
                    <li><FormattedMessage id="home.plus.1"/></li>
                    <li><FormattedMessage id="home.plus.2"/></li>
                    <li><FormattedMessage id="home.plus.3"/></li>
                </ul>
            </div>
        </div>
            
        <div className="vertical-divider"></div>

        <div className="right-section">
            <h3><FormattedMessage id="game.time"/></h3>
            <h3><FormattedMessage id="game.players"/></h3>
            <h3><FormattedMessage id="game.age"/></h3>
            <p>-------------------------------</p>
            <h3> <u><FormattedMessage id="game.createdBy"/></u><br/> Hal Duncan & Ruth Veevers</h3>
            <h3> <u><FormattedMessage id="game.illustratedBy"/></u><br/> Kwanchai Moriya</h3>
            {/* <button>Jouer au jeu</button> */}
            <br/>
            <Link to="/play" className='button' 
                style={{ 
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.secondary
                }}>
                <FormattedMessage id="play"/> 
            </Link>
        </div>
    </div>
    );
}

export default Home;
