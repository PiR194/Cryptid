import React from 'react';
import './ChoiceBar.css';

const ChoiceBar = () => {
  const players = ['Player1', 'Player2', 'Player3']; 

  return (
    <div className="choice-bar-container">
      <h3 className="choice-bar-heading">Quel joueur voulez-vous interroger ?</h3>
      <div>
        {players.map((player, index) => (
          <button key={index} className="choice-bar-button">
            {player}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceBar;