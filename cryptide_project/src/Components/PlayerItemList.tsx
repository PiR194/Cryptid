import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../Style/Global.css';

//@ts-ignore
function PlayerItemList({ pdp, name}) {
    return (
        <div className='item-horizontal-div'>
            <img src={pdp} alt='player-image' height="100" width="100"/>
            <h4>{name}</h4>
        </div>
    )
}

export default PlayerItemList;
