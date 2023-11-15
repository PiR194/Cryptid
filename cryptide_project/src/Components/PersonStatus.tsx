import React, { useEffect, useState } from 'react';

/* Style */
import '../Style/Global.css'
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import Person from '../res/img/Person.png'
import leave from '../res/img/bot.png'
interface PlayerStatusProps {
    img: any
    state: any
    name: string
    index: number
    setPlayerTouched: (newPlayerTouch: number) => void;
    playerTouched: number
  }
  let touchedPlayer = -1

//@ts-ignore
const PersonStatus: React.FC<PlayerStatusProps> = ({img = Person, state= Person, name = "Dummy", index, playerTouched, setPlayerTouched}) => {
    const theme=useTheme();

    const [touchedPlayer, setTouchedPlayer] = useState(-2)
    useEffect(() =>{
        setTouchedPlayer(playerTouched)
        console.log(touchedPlayer)
    }, [playerTouched])
    return (
        <div className='centerDivV' onClick={() => setPlayerTouched(index)}>
            <img src={img} alt="player" height="60" width="60"/>
            <h5>{name}</h5>
            {(touchedPlayer == index) ?(
                <div className='statusDiv' style={{ backgroundColor: "gold" }}>
                    <img src={state} alt="state" height="30" width="30"/>
                </div>
            ): 
            (
                <div className='statusDiv' style={{ backgroundColor: theme.colors.primary }}>
                    <img src={state} alt="state" height="30" width="30"/>
                </div>
            )  }
            
        </div>
    );
}

export default PersonStatus;
