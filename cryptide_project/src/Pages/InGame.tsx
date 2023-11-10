import React, { useState } from 'react';

/* Component */
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';
import ButtonImgNav from '../Components/ButtonImgNav';

/* Icon */
import Leave from "../res/icon/leave.png";

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
        <div> {/*  tmp */}
          <ButtonImgNav dest="/endgame" img={Leave} text='endgame'/>
        </div>
      </div>
    );
  };
  

export default InGame;
