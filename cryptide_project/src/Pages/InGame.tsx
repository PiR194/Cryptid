import React, { useState } from 'react';
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';

const InGame = () => {
    const [showChoiceBar, setShowChoiceBar] = useState(false);
  
    const handleNodeClick = (shouldShowChoiceBar: boolean) => {
      setShowChoiceBar(shouldShowChoiceBar);
    };
  
    return (
      <div>
        <GraphContainer onNodeClick={handleNodeClick} />
        <div id="bottom-container">
            {showChoiceBar && <ChoiceBar />}
        </div>
      </div>
    );
  };
  

export default InGame;
