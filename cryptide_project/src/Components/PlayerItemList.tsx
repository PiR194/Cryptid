import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../Style/Global.css';
import Bot from '../res/img/bot.png';

/* Boostrap */
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

//@ts-ignore
function PlayerItemList({ pdp, name, id}) {
    const isBot = pdp === Bot;

    return (
        <div className='item-horizontal-div-container'>
            <div className='item-horizontal-div'>
                <img src={pdp} alt='player-image' height='100' width='100' />
                <h4>{name}</h4>
            </div>
            {isBot && (
                <ToggleButtonGroup type='radio' name={`options-${id}`} defaultValue={1}>
                    <ToggleButton id={`tbg-radio-1-${id}`} value={1}>
                        Facile
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-2-${id}`} value={2}>
                        Intermédiaire
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-3-${id}`} value={3}>
                        Fort
                    </ToggleButton>
                </ToggleButtonGroup>
            )}
        </div>
    )
}

export default PlayerItemList;
