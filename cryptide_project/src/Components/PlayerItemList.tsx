import React from 'react';
import { FormattedMessage } from 'react-intl';

/* img */
import BotPDP from '../res/img/bot.png';
import PersonPDP from '../res/img/Person.png';
import Trash from '../res/icon/trash.png';

/* style */
import '../Style/Global.css';

/* Boostrap */
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Button from 'react-bootstrap/Button';

/* model */
import Player from '../model/Player';
import Bot from '../model/Bot';

/* server */
import { socket } from '../SocketConfig';
import { Form } from 'react-router-dom';

interface MyPlayerItemListProps {
    player : Player,
    room : string | null
}

//@ts-ignore
const PlayerItemList:React.FC<MyPlayerItemListProps> =({ player, room }) => {
    // const isBot = pdp === Bot;
    let pdp;
    const isBot = player instanceof Bot;
    isBot ? pdp = BotPDP :  pdp = PersonPDP;
    

    const delBot = () => {
        if (isBot && room != null) {
            console.log(room);
            socket.emit("bot deleted", player, room);
        }
    };

    return (
        <div className='item-horizontal-div-container'>
            
            <div className='item-horizontal-div'>
                <div>
                    <img src={pdp} alt='player-image' height='100' width='100' />
                    <h4>{player.pseudo}</h4>
                </div>
                {isBot && (
                    <Button className='suprButton' onClick={delBot} variant="danger">
                        <img src={Trash} alt='Trash-icon' height='30' width='30' />
                    </Button>
                )}
            </div>
            {isBot && (
                <ToggleButtonGroup type='radio' name={`options-${player.id}`} defaultValue={1}>
                    <ToggleButton id={`tbg-radio-1-${player.id}`} value={1}>
                        <FormattedMessage id='easy' />
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-2-${player.id}`} value={2}>
                        <FormattedMessage id='medium' />
                    </ToggleButton>
                    <ToggleButton id={`tbg-radio-3-${player.id}`} value={3}>
                        <FormattedMessage id='strong' />
                    </ToggleButton>
                </ToggleButtonGroup>
            )}
        </div>
    )
}

export default PlayerItemList;
