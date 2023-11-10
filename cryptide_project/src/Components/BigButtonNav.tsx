import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonImgNav.css';
import { FormattedMessage } from 'react-intl';

//@ts-ignore
function BigButtonNav({ dest, img}) {
    return (
    <Link to={dest} className="link-without-underline">
        <button className='bigbuttonNabImg'>
            <img src={img} alt="Button Image" height="100" width="100"/>
        </button>
    </Link>
    );
}

export default BigButtonNav;
