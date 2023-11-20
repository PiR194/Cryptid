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
import { useGame } from '../Contexts/GameContext';


function EndGame() {

    const {winner, person, players, indices} =useGame()
    console.log(winner)
    let indice = indices[0]
    const index = players.findIndex((p) => p.id == winner?.id)
    if (index != -1) {
        indice = indices[index]
    }
    
    const theme = useTheme();
    return (
        <div>
            <div className="head">
                <header className='leaderboard-header' style={{ borderColor: theme.colors.primary }}>
                    <h1>{winner?.name} a gagné !</h1>
                    <h3>Le tueur était <u>{person?.getName()}</u></h3>
                </header>
            </div>
            <div className='winner'>
                <img src={Person} width='300' height='300'/>
                <h3>{indice.ToString("fr")}</h3>
            </div>
            <div className='bottom'>
                <div className='centerDivH'>
                    <BigButtonNav dest="/play" img={Leave}/>
                </div>
                <ul className='centerDivH'>
                    {
                    players.map((player, index) => (
                        <div className="playerContainer">
                            {player.id!=winner?.id && 
                            <>
                                <PersonStatus img={Person} state={Person} key={index} name={player.name} playerTouched={1} setPlayerTouched={() => {}} index={index} showCircle={false}/>
                                <h5 style={{width: 50}}>{indices[players.findIndex((p) => p.id == player?.id)].ToString("fr")}</h5>
                            </>
                            }
                        </div>
                    ))
                    }
                    
                </ul>
                <div className='centerDivH'>
                    <BigButtonNav dest="/lobby" img={Replay}/>
                </div>
            </div>
        </div>
    );
}

export default EndGame;
