import React from 'react';
import '../Style/Global.css'
import Person from '../res/img/Person.png'
import leave from '../res/img/bot.png'

//@ts-ignore
function PersonStatus({img = Person, state= leave, name = "Dummy"}) {
    return (
        <div className='centerDivV'>
            <img src={img} alt="player" height="100" width="100"/>
            <h4>{name}</h4>
            <div className='statusDiv'>
                <img src={state} alt="state" height="30" width="30"/>
            </div>
        </div>
    );
}

export default PersonStatus;
