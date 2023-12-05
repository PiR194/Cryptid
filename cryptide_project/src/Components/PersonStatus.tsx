import React, { useEffect, useState } from 'react';

/* Style */
import '../Style/Global.css'
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import Person from '../res/img/Person.png'
import BotImg from '../res/img/bot.png'

/* Model */
import Bot from '../model/Bot';

/* Context */
import { useGame } from '../Contexts/GameContext';
import { positionToColor } from '../ColorHelper';

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
            setBuffer('solid 3px green')
        }
        else{
            setBuffer('')
        }
    }, [playerIndex])
    
    function onTouch(){
        if (IsActualPlayer && !askedWrong){
            setPlayerTouched(index)
            setTouchedPlayer(index)
            //setIsClicked(!isClicked);
        }
    }

    //* Code pour le cercle

    //const [isClicked, setIsClicked] = useState(false); // État du bouton, par défaut false
    const handleClick = () => {
        onTouch();
    };
    const circleStyle: React.CSSProperties = {
        backgroundColor: touchedPlayer == index && showCircle ? 'gold' : positionToColor(index), // Changement de la couleur en fonction de la condition
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        objectFit: 'cover'
    };

    const circleStyleInt: React.CSSProperties = {

        backgroundColor:'white',
        borderRadius: '50%',
        width: '70px',
        height: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        objectFit: 'cover'
    }
    
    const imageStyle: React.CSSProperties = {
        borderRadius: '50%', 
        width: '60px',
        height: '60px',
        objectFit: 'cover', // image est ajustée pour couvrir le cercle
        position: 'relative',
    };
    
    return (
        <div className='centerDivV'>
            {/* <div className='centerDivV' style={{border:buffer, borderRadius: '50%', padding:'1px'}}> */}
                <div className='centerDivV' style={circleStyle} onClick={() => handleClick()}>
                    <div className='centerDivV' style={circleStyleInt}>
                        <img src={img} alt="player" height="40" width="40" style={{ ...imageStyle, objectFit: 'cover' }}/>
                    </div>
            {/* </div> */}
            </div>
            <div className='playerNameDisplay' style={{border:buffer}}>
                <h5>{actualPlayerIndex !== index ? (name.substring(0, name.length - 2).length > 7 ? name.substring(0, name.length - 2).substring(0, 7) + '...' : name) : 'vous'}</h5>
            </div>
        </div>
    );
}

export default PersonStatus;




// {IsActualPlayer && (      
//     (touchedPlayer == index && showCircle) ?(
//         <div className='statusDiv' style={{ backgroundColor: "gold" }}>
//             <img src={state} alt="state" height="30" width="30"/>
//         </div>
//     ): showCircle &&
//     (
//         <div className='statusDiv' style={{ backgroundColor: theme.colors.primary }}>
//             <img src={state} alt="state" height="30" width="30"/>
//         </div>
//     )
// )}