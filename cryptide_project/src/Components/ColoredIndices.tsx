import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Global.css';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '../Style/ThemeContext';

//@ts-ignore
function ColoredIndices({ letter, color}) {
    
    const theme = useTheme();

    // const mystyle = {
    //     backgroundColor: "#0064E0",
    // };

    return (
    <div className='centerDivH' style={{ backgroundColor: theme.colors.primary }}>
        <img src={letter} alt="Indice Letter"/>
    </div>
    );
}

export default ColoredIndices;
