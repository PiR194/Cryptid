import React, {useEffect} from 'react';

/* Style */
import '../Style/Global.css';
import './InfoPage.css';
import { FormattedMessage } from 'react-intl';
import { useGame } from '../Contexts/GameContext';
import ColorIndice from '../model/Indices/ColorIndice';
import Stub from '../model/Stub';
import SportIndice from '../model/Indices/SportIndice';
import EdgesIndice from '../model/Indices/EdgesIndice';
import NbEdgesIndice from '../model/Indices/NbEdgesIndice';
import NbSportIndice from '../model/Indices/NbSportIndice';
import AgeIndice from '../model/Indices/AgeIndice';
import ColorEdgesIndice from '../model/Indices/ColorEdgesIndice';
import IndiceList from '../Components/IndiceList';
import { HashLink as Link } from 'react-router-hash-link';
import { ColorToHexa } from '../model/EnumExtender';
import Color from '../model/Color';
import "./InGame.css"
import {useTheme} from '../Style/ThemeContext'
import Check from "../res/icon/checkboxGreen.png";
import Alert from 'react-bootstrap/Alert';
import MGlass from "../res/icon/magnifying-glass.png";
import Param from "../res/icon/param.png";
import Info from "../res/icon/infoGreen.png"; //todo changer la couleur de l'icon
import { useAuth } from '../Contexts/AuthContext';
import { Spinner } from 'react-bootstrap';
import Reset from '../res/icon/reset.png';
import Ceye from '../res/icon/hidden.png';


//@ts-ignore
function InfoPage({locale, changeLocale}) {
    const theme = useTheme();
    const {isLoggedIn, login, user, setUserData, manager } = useAuth();

    useEffect(() => {
        if (user == null){
            console.log(user)
            manager.userService.fetchUserInformation().then(([user, loggedIn]) =>{
                console.log(user);
                if (user!=null){
                    if (loggedIn){
                        login()
                        setUserData(user)
                    }
                    else{
                        setUserData(user)
                    }
                }
            })
        }
    }, [isLoggedIn]);

    const styles = {
        roux: { backgroundColor: ColorToHexa(Color.REDHEAD), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        blond: { backgroundColor: ColorToHexa(Color.BLOND), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        noir: { backgroundColor: ColorToHexa(Color.BLACK), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        blanc: { backgroundColor: ColorToHexa(Color.WHITE), border: '1px solid #ccc', width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
        chatain: { backgroundColor: ColorToHexa(Color.BROWN), width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' },
    };
    return (
        //! Il faudra possiblement faire une gestion des mode de jeu, pour modifier les regles en fonction de ce dernier.
    <div className='infoPage'>
        <h1><FormattedMessage id="informations"/></h1>
        
        <div>
            <h2><FormattedMessage id="info.intro.title"/></h2>
            <p>
                <FormattedMessage id="info.intro.text"/>
            </p>
        </div>

        <div className="list">
            <h2> <FormattedMessage id="info.sommaire"/> </h2>
            <ul>
                <li><Link to="#composants-du-jeu"><span><FormattedMessage id="info.title.composant"/></span></Link></li>
                <li><Link to="#objectif-du-jeu"><span><FormattedMessage id="info.title.objectif"/></span></Link></li>
                <li><Link to="#deroulement-du-jeu"><span><FormattedMessage id="info.title.deroulement"/></span></Link></li>
                <li><Link to="#mode-de-jeu"><span>Modes de jeu spéciaux</span></Link></li>
                <li><Link to="#indice-possible"><span><FormattedMessage id="info.title.indice_possible"/></span></Link></li>
            </ul>
        </div>

        <section id="composants-du-jeu">
            <h2><FormattedMessage id="info.pions"/> :</h2>
            <h4><FormattedMessage id="info.sommaire"/></h4>
            <h6><FormattedMessage id="info.composant.text"/></h6>
            <ul>
                <p>
                    <li><h5 className='h5title'><FormattedMessage id="info.composant.carre.title"/> : 🟪🟦🟩🟨🟥🟫</h5></li>
                    <FormattedMessage id="info.composant.carre"/>

                    <li><h5 className='h5title'><FormattedMessage id="info.composant.rond.title"/> : 🟣🔵🟢🟡🔴🟤</h5></li>
                    <FormattedMessage id="info.composant.rond"/>
                </p>
                <hr/>
                <h4>
                    <FormattedMessage id="info.car_perso"/>
                </h4>
                <h6><FormattedMessage id="info.composant.textcar"/></h6>
                <p>
                    {/* 
                        //TODO mettre icon des ages apres le merge
                    */}
                    <h5 className='h5title'><FormattedMessage id="info.composant.age.title"/> :</h5> 
                    <FormattedMessage id="info.composant.age"/><Link to="#indice-possible"><FormattedMessage id="info.composant.age.link"/></Link>.

                    <h5 className='h5title'><FormattedMessage id="info.composant.hair_col.title"/> :</h5>
                        <FormattedMessage id="info.composant.hair_col"/>
                    <ul>
                        <li>
                            <span style={styles.blanc}></span>
                            <FormattedMessage id="hair.blanc"/>
                        </li>
                        <li>
                            <span style={styles.blond}></span>
                            <FormattedMessage id="hair.blond"/>
                        </li>
                        <li>
                            <span style={styles.roux}></span>
                            <FormattedMessage id="hair.roux"/>
                        </li>
                        <li>
                            <span style={styles.chatain}></span>
                            <FormattedMessage id="hair.chatain"/>
                        </li>
                        <li>
                            <span style={styles.noir}></span>
                            <FormattedMessage id="hair.noir"/>
                        </li>
                    </ul>

                    <h5 className='h5title'><FormattedMessage id="info.composant.sport.title"/> : ⚾🏀🎳⚽🎾</h5>
                    <FormattedMessage id="info.composant.sport"/>
                        <ul>
                            <li>⚾ <FormattedMessage id="info.composant.baseball"/></li>
                            <li>🏀 <FormattedMessage id="info.composant.basketball"/></li>
                            <li>🎳 <FormattedMessage id="info.composant.bowling"/></li>
                            <li>⚽ <FormattedMessage id="info.composant.football"/></li>
                            <li>🎾 <FormattedMessage id="info.composant.tennis"/></li>
                        </ul>
                        <FormattedMessage id="info.composant.sport.bis"/>                    
                </p>
            </ul>
        </section>
        <hr/>
        <section id="objectif-du-jeu">
            <h2><FormattedMessage id="info.title.objectif"/> :</h2>
            <p>
                <FormattedMessage id="info.objectif.intro"/>
            </p>
            <h4>
                <FormattedMessage id="info.objectif.t1"/> :
            </h4>
            <p>
                <FormattedMessage id="info.objectif.t1.text"/>
            </p>
            <h4><FormattedMessage id="info.objectif.t2"/> :</h4>
            <p>
                <FormattedMessage id="info.objectif.t2.text"/>
            </p>
            <h4><FormattedMessage id="info.objectif.t3"/> :</h4>
            <p>
                <FormattedMessage id="info.objectif.t3.text"/>
            </p>

            <h4>
                <FormattedMessage id="info.interface"/>
            </h4>
            <h6> <FormattedMessage id="info.interface.text"/> </h6>
            <ul>
                <li>
                    <div className='LiInterfaceDisplay'>
                        <button className='button'
                            style={{ 
                                backgroundColor: theme.colors.tertiary,
                                borderColor: theme.colors.secondary,
                                margin:"0 20px"
                            }}>
                            <img src={Param} alt="paramètres" height='40'/>
                        </button>
                        <p>
                            <FormattedMessage id="info.interface.param"/>
                        </p>
                    </div>
                </li>
                <li>
                <div className='LiInterfaceDisplay'>
                    <button className='button'
                    style={{ 
                        backgroundColor: theme.colors.tertiary,
                        borderColor: theme.colors.secondary,
                        margin:"0 20px"
                    }}>
                        <img src={Reset} alt="paramètres" height='40'/>                 
                    </button>
                    <p>
                        <FormattedMessage id="info.interface.reset"/>
                    </p>
                </div>
                </li>
                <li>
                    <div className='LiInterfaceDisplay'>
                        <button className='button' 
                            style={{ 
                                backgroundColor: theme.colors.tertiary,
                                borderColor: theme.colors.secondary,
                                margin:"0 20px"
                            }}>
                            <img src={Info} alt="info" height="40"/>
                        </button>
                        <p>
                            <FormattedMessage id="info.interface.info"/>
                        </p>
                    </div>
                </li>
                <li>
                    <div className='LiInterfaceDisplay'>
                        <button className='button'
                            style={{ 
                                backgroundColor: theme.colors.tertiary,
                                borderColor: theme.colors.secondary,
                                margin:"0 20px"
                            }}>
                            <img src={Check} alt="check" height="40"/>
                        </button>
                    
                        <p>
                            <FormattedMessage id="info.interface.fiche"/>
                        </p>
                    </div>
                </li>
                <li>
                    <div className='LiInterfaceDisplay'>
                    <button className='button'
                        style={{ 
                            backgroundColor: theme.colors.tertiary,
                            borderColor: theme.colors.secondary,
                            margin:"0 20px"
                        }}>
                        <img src={MGlass} alt="indice" height="40"/>
                    </button>
                    
                        <p>
                            <FormattedMessage id="info.interface.indice"/>
                        </p>
                    </div>
                </li>
                <li>
                    <div className='LiInterfaceDisplay'>
                        <button className='button'
                            style={{ 
                                backgroundColor: theme.colors.tertiary,
                                borderColor: theme.colors.secondary,
                                margin:"0 20px"
                            }}>
                            <img src={Ceye} alt="check" height="40"/>
                        </button>
                        <p>
                            <FormattedMessage id="info.interface.vision"/>
                        </p>
                    </div>
                </li>
                {/* ajouter les bouton de telechargement de graph ? */}
            </ul>
        </section>
        <hr/>
        <section id="deroulement-du-jeu">
            <h2><FormattedMessage id="info.title.deroulement"/> :</h2>
            <h4>
                <u><FormattedMessage id="etape"/> 1</u> : <FormattedMessage id="info.deroulement.e1"/>
            </h4>
            <p>
                <FormattedMessage id="info.deroulement.e1.text"/>
            </p>
            <h4>
                <u><FormattedMessage id="etape"/> 2</u> : <FormattedMessage id="info.deroulement.e2"/>
            </h4>
            <p>
                <FormattedMessage id="info.deroulement.e2.text"/>
            </p>
            <h4>
                <u><FormattedMessage id="etape"/> 3</u> : <FormattedMessage id="info.deroulement.e3"/>
            </h4>
            <p>
                <FormattedMessage id="info.deroulement.e3.text"/>
            </p>
        </section>
        <hr/>
        <section id="mode-de-jeu">
        <h2> <FormattedMessage id="info.mdj"/> </h2>
        <br/>
        <p>
            <FormattedMessage id="info.mdj.text"/>
        </p>
        <h3>
            <FormattedMessage id="info.mdj.mastermind"/>
        </h3>
        <br/>
        <p>
            <FormattedMessage id="info.mdj.mastermind.text"/>
        </p>
        
        <h3>
            <FormattedMessage id="info.mdj.enigme"/>
        </h3>
        <p>
            <FormattedMessage id="info.mdj.enigme.text"/>
        </p>
        <h4>
            <u><FormattedMessage id="info.mdj.enigme.easy"/></u>
        </h4>
        <p>
            <FormattedMessage id="info.mdj.enigme.easy.txt"/>
        </p>
        <h4>
            <u><FormattedMessage id="info.mdj.enigme.medium"/></u>
        </h4>
        <p>
            <FormattedMessage id="info.mdj.enigme.medium.txt"/>
        </p>
        <h4>
            <u><FormattedMessage id="info.mdj.enigme.hard"/></u>
        </h4>
        <p>
            <FormattedMessage id="info.mdj.enigme.hard.txt"/>
        </p>
        </section>
        <hr/>
        <section id="indice-possible">
            <h2><FormattedMessage id="info.title.indice_possible"/> :</h2>
            <br/>
            <h4>
                <FormattedMessage id="info.indice-possible.age"/>
            </h4>
            <IndiceList instance={AgeIndice} lang={locale}/>
            
            <h4>
                <FormattedMessage id="info.indice-possible.hair"/>
            </h4>
            <IndiceList instance={ColorIndice} lang={locale}/>
            <IndiceList instance={ColorEdgesIndice} lang={locale}/>
            <hr/>
            <h4>
                <FormattedMessage id="info.indice-possible.sport"/>
            </h4>
            <IndiceList instance={SportIndice} lang={locale}/>
            <IndiceList instance={NbSportIndice} lang={locale}/>
            
            
            <h4>
                <FormattedMessage id="info.indice-possible.voisin"/>
            </h4>
            <IndiceList instance={EdgesIndice} lang={locale}/>
            <hr/>
        </section>
    </div>
    );
}

export default InfoPage;
