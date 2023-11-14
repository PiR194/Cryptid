import React from "react";
import { useTheme } from "../Style/ThemeContext";

const TurnBar = () => {
    const theme = useTheme();
    return (
        <div className='upperInfo' 
            style={{ 
                borderColor: theme.colors.secondary
            }}>
            {/* texte changeable et a traduire */}
            <p>Dummy, à vous de jouer !</p>
        </div>
    );
  };
  
  export default TurnBar;