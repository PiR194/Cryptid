import React from 'react';


/* Style */
import './EndGame.css';
import '../Style/Global.css';
import { useTheme } from '../Style/ThemeContext';

/* res */
import Person from '../res/img/Person.png';
import Leave from '../res/icon/leave.png';
import Replay from '../res/icon/replay.png';

/* Component */
import PersonStatus from '../Components/PersonStatus';
import ButtonImgNav from '../Components/ButtonImgNav';
import BigButtonNav from '../Components/BigButtonNav';

/* nav */
import { Link } from 'react-router-dom';

/* lang */
import { FormattedMessage } from 'react-intl';


function EndGame() {

    const theme = useTheme();
    return (
        <div>
            <div className="head">
                <header className='leaderboard-header' style={{ borderColor: theme.colors.primary }}>
                    <h1>Dummy a gagné !</h1>
                    <h3>Le tueur était <u>Bob</u></h3>
                </header>
            </div>
            <div className='winner'>
                <img src={Person} width='300' height='300'/>
            </div>
            <div className='bottom'>
                <div className='centerDivH'>
                    <BigButtonNav dest="/play" img={Leave}/>
                </div>
                <div className='centerDivH'>
                    <PersonStatus state={Replay} name="Dummy"/>
                    <PersonStatus state={Leave} name="bot2"/>
                    <PersonStatus state={Leave} name="bot3"/>
                </div>
                <div className='centerDivH'>
                    <BigButtonNav dest="/lobby" img={Replay}/>
                </div>
            </div>
        </div>
    );
}

export default EndGame;
