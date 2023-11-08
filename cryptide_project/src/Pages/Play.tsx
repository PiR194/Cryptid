import React from 'react';

/* Page */
import './Play.css';

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


function Play() {
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
                        <button className="ButtonNav"> Jouer seul </button>
                    </Link>
                    <Link to="/">
                        <button className="ButtonNav"> Créer une partie </button>
                    </Link>
                    <Link to="/">
                        <button className="ButtonNav"> Rejoindre </button>
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