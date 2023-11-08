import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonImgNav.css';
import { FormattedMessage } from 'react-intl';

//@ts-ignore
function ButtonImgNav({ dest, img, text = "" }) {
    return (
    <Link to={dest} className="link-without-underline">
        <button className='buttonNabImg'>
            <img src={img} alt="Button Image" height="50" width="50"/>
            <p>{text}</p>
        </button>
    </Link>
    );
}

export default ButtonImgNav;
