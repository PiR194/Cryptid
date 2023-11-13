import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonImgNav.css';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '../Style/ThemeContext';

//@ts-ignore
function ButtonImgNav({ dest, img, text = "" }) {
    const theme = useTheme();
    return (
    <Link to={dest} className="link-without-underline"> {/*target='_blank' ==> ouvre un nouvelle onglet*/ }
        <button className='buttonNabImg' style={{ backgroundColor: theme.colors.primary, color: theme.colors.secondary}}>
            <img src={img} alt="Button Image" height="50" width="50"/>
            <p>{text}</p>
        </button>
    </Link>
    );
}

export default ButtonImgNav;
