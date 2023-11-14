import React from "react";
import { useTheme } from "../Style/ThemeContext";

//@ts-ignore
const TurnBar = ({text}) => {
    const theme = useTheme();
    return (
        <div className='upperInfo' 
            style={{ 
                borderColor: theme.colors.secondary
            }}>
            {/* texte changeable et a traduire */}
            <p>{text}</p>
        </div>
    );
};

export default TurnBar;