import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonImgNav.css';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '../Style/ThemeContext';
import COLORS from '../Style/Color';
import {basePath} from "../AdressSetup"

//@ts-ignore
function BigButtonNav({ dest, img}) {
    
    const theme = useTheme();

    // const mystyle = {
    //     backgroundColor: "#0064E0",
    // };

    return (
    <Link to={`${dest}`} className="link-without-underline">
        <button className='bigbuttonNabImg' style={{ backgroundColor: theme.colors.primary }}>
            <img src={img} alt="Button Image" height="100" width="100"/>
        </button>
    </Link>
    );
}

export default BigButtonNav;
