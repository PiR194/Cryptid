import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonImgNav.css';
import { FormattedMessage } from 'react-intl';

//@ts-ignore
function ButtonImgNav({ dest, img }) {
    return (
    <Link to={dest}>
        <button className='buttonNabImg'>
            <img src={img} alt="Button Image" />
        </button>
    </Link>
    );
}

export default ButtonImgNav;
