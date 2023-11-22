import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../Style/Global.css';

/* img */
import BotPDP from '../res/img/bot.png';
import PersonPDP from '../res/img/Person.png';

/* Boostrap */
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import Player from '../model/Player';
import Bot from '../model/Bot';


interface MyPlayerItemListProps {
    player : Player
}

//@ts-ignore
const PlayerItemList:React.FC<MyPlayerItemListProps> =({ player }) => {
    // const isBot = pdp === Bot;
    let pdp;
    const isBot = player instanceof Bot;
    isBot ? pdp = BotPDP :  pdp = PersonPDP;
    
    return (
        <div className='item-horizontal-div-container'>
            <div className='item-horizontal-div'>
                <img src={pdp} alt='player-image' height='100' width='100' />
                <h4>{player.name}</h4>
            </div>
            {isBot && (
                <ToggleButtonGroup type='radio' name={`options-${player.id}`} defaultValue={1}>
                    <ToggleButton id={`tbg-radio-1-${player.id}`} value={1}>
                        Facile
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-2-${player.id}`} value={2}>
                        Intermédiaire
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-3-${player.id}`} value={3}>
                        Fort
                    </ToggleButton>
                </ToggleButtonGroup>
            )}
        </div>
    )
}

export default PlayerItemList;
