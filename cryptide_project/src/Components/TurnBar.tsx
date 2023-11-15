import React from "react";
import { useTheme } from "../Style/ThemeContext";

interface TurnBarProps{
    text: string
}

const TurnBar: React.FC<TurnBarProps> = ({text})=> {
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