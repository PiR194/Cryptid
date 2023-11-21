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

    let losingPlayers;

    if (winner != null) {
        losingPlayers = players.filter(player => player.id !== winner.id);
    } else {
        losingPlayers = players;
    }

    const theme = useTheme();


    const playersRows = [];
    for (let i = 0; i < losingPlayers.length; i += 3) {
        const rowPlayers = losingPlayers.slice(i, i + 3);
        playersRows.push(
            <div className="playerRow" key={i}>
                {rowPlayers.map((player, index) => (
                    <div className="playerContainer" key={index}>
                        {player.id !== winner?.id && (
                            <div>
                                <PersonStatus img={Person} state={Person} key={index} name={player.name} playerTouched={1} setPlayerTouched={() => {}} index={index} showCircle={false}/>
                                <h6>
                                    {indices[players.findIndex((p) => p.id == player?.id)].ToString("fr")}
                                </h6>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    
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
                <h3>{indices[players.findIndex((p) => p.id == winner?.id)].ToString("fr")}</h3>
            </div>
            <div className='bottom'>
                <div className='centerDivH'>
                    <BigButtonNav dest="/play" img={Leave}/>
                </div>
                {/* <div className='losingPlayer'> */}
                    {/* {
                        losingPlayers.map((player, index) => (
                            <div className="playersContainer">
                                {player.id!=winner?.id && 
                                <>
                                    <div className='playerContainer'>
                                        <PersonStatus img={Person} state={Person} key={index} name={player.name} playerTouched={1} setPlayerTouched={() => {}} index={index} showCircle={false}/>
                                        <h5 style={{width: 50}}>{indices[players.findIndex((p) => p.id == player?.id)].ToString("fr")}</h5>
                                    </div>
                                </>
                                }
                            </div>
                        ))
                    } */}

                    {playersRows}
                    
                {/* </div> */}
                <div className='centerDivH'>
                    <BigButtonNav dest="/lobby" img={Replay}/>
                </div>
            </div>
        </div>
    );
}

export default EndGame;
