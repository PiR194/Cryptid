
import React from 'react';
import { colorToEmoji, positionToColor, positionToEmoji } from '../ColorHelper';
import Player from '../model/Player';
import { useTheme } from '../Style/ThemeContext';
import PersonStatus from './PersonStatus';
import Person from '../res/img/Person.png'
import BotImg from '../res/img/bot.png'

import { socket } from '../SocketConfig';
import { FormattedMessage } from 'react-intl';


//@ts-ignore

interface PlayerListProps {
    players: Player[];
    playerTouched: number
    setPlayerTouched: (newPlayerTouch: number) => void;
    playerIndex: number
    askedWrong: boolean
    greyForEveryone: () => void
}

const PlayerList: React.FC<PlayerListProps> = ({ players, playerTouched, setPlayerTouched, playerIndex, askedWrong, greyForEveryone}) => {
    const theme = useTheme();

    function askEveryone(){
        if (!askedWrong){
            greyForEveryone()
            setPlayerTouched(players.length)    
        }
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {
                    //@ts-ignore
                    players.map((player, index) => (
                        //player.id!=socket.id && 
                        <PersonStatus img={player instanceof Player ? Person : BotImg} 
                                    state={Person} 
                                    key={index} 
                                    name={player.pseudo}
                                    playerTouched={playerTouched} 
                                    setPlayerTouched={setPlayerTouched} 
                                    index={index} 
                                    showCircle={true}
                                    playerIndex={playerIndex}
                                    askedWrong={askedWrong}/>
                    ))
                }
            </div>
            <div 
            style={{display: 'flex',
                justifyContent: "center",
                alignSelf: "center",
                alignItems:"center",
                margin: 10
                }}>
                
                    {(playerTouched == players.length) 
                        ?(
                            <button style={{ 
                            backgroundColor: "gold",
                            borderColor: theme.colors.secondary,
                            borderRadius: "10px",
                            border: "solid 1px",
                            textAlign: "center",
                            color: "white",
                            padding: "10px"}}
                            onClick={() => askEveryone()}><FormattedMessage id='askeveryone'/></button>
                        ):
                        (
                            <button style={{ 
                                backgroundColor: theme.colors.primary,
                                borderColor: theme.colors.secondary,
                                borderRadius: "10px",
                                border: "solid 1px",
                                textAlign: "center",
                                color: "white",
                                padding: "10px"}}
                            onClick={() => askEveryone()}><FormattedMessage id='askeveryone'/></button>
                        )
                    }
            </div>
        </div>
        

    );
}   

export default PlayerList;