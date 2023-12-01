import React, { useEffect, useState } from 'react';

/* Style */
import '../Style/Global.css'
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import Person from '../res/img/Person.png'
import BotImg from '../res/img/bot.png'
import { useGame } from '../Contexts/GameContext';
import Bot from '../model/Bot';
interface PlayerStatusProps {
    img: any
    state: any
    name: string
    index: number
    setPlayerTouched: (newPlayerTouch: number) => void;
    playerTouched: number
    showCircle: boolean
    playerIndex: number
    askedWrong: boolean
  }
  let touchedPlayer = -1

//@ts-ignore
const PersonStatus: React.FC<PlayerStatusProps> = ({img = Person, state= Person, name = "Dummy", index, playerTouched, setPlayerTouched, showCircle, playerIndex, askedWrong}) => {
    const theme=useTheme();
    const {players, actualPlayerIndex} = useGame()
    if (players[index] instanceof Bot){
        img = BotImg
    }

    const [buffer, setBuffer] = useState("")

    const [touchedPlayer, setTouchedPlayer] = useState(-2)
    useEffect(() =>{
        setTouchedPlayer(playerTouched)
    }, [playerTouched])

    let IsActualPlayer = index != actualPlayerIndex

    useEffect(() => {
        if (playerIndex===index){
            setBuffer('solid 1px green')
        }
        else{
            setBuffer('')
        }
    }, [playerIndex])
    
    function onTouch(){
        if (IsActualPlayer && !askedWrong){
            setPlayerTouched(index)
        }
    }
    
    return (
        <div style={{border:buffer}}>
            <div className='centerDivV' onClick={() => onTouch()}>
                <img src={img} alt="player" height="60" width="60"/>
                <h5>{name}</h5>      

                {IsActualPlayer && (      
                    (touchedPlayer == index && showCircle) ?(
                        <div className='statusDiv' style={{ backgroundColor: "gold" }}>
                            <img src={state} alt="state" height="30" width="30"/>
                        </div>
                    ): showCircle &&
                    (
                        <div className='statusDiv' style={{ backgroundColor: theme.colors.primary }}>
                            <img src={state} alt="state" height="30" width="30"/>
                        </div>
                    )
                )}
                
            </div>
        </div>
    );
}

export default PersonStatus;
