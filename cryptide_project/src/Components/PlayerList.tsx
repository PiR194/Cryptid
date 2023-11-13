
import React from 'react';
import PersonStatus from './PersonStatus';

//@ts-ignore
function PlayerList({ players }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {
                //@ts-ignore
                players.map((player, index) => (
                    <PersonStatus key={index} state={player.state} name={player.name} />
                ))
            }
        </div>

    );
}   

export default PlayerList;