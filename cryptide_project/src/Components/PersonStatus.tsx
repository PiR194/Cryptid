import React from 'react';

/* Style */
import '../Style/Global.css'
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import Person from '../res/img/Person.png'
import leave from '../res/img/bot.png'

//@ts-ignore
function PersonStatus({img = Person, state= leave, name = "Dummy"}) {
    const theme=useTheme();
    return (
        <div className='centerDivV'>
            <img src={img} alt="player" height="100" width="100"/>
            <h4>{name}</h4>
            <div className='statusDiv' style={{ backgroundColor: theme.colors.primary }}>
                <img src={state} alt="state" height="30" width="30"/>
            </div>
        </div>
    );
}

export default PersonStatus;
