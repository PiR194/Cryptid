import React from 'react';
import './ChoiceBar.css';
import { useTheme } from '../Style/ThemeContext';

const ChoiceBar = () => {
  const players = ['Player1', 'Player2', 'Player3']; 
  const theme = useTheme();
  return (
    <div className="choice-bar-container">
      <h3 className="choice-bar-heading">Quel joueur voulez-vous interroger ?</h3>
      <div>
        {players.map((player, index) => (
          <button key={index} className="choice-bar-button" style={{ backgroundColor: theme.colors.primary }}>
            {player}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceBar;