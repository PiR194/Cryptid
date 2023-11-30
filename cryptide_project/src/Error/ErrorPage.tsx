
import React from 'react';
import { useTheme } from '../Style/ThemeContext';
import { Link } from 'react-router-dom';
import './ErrorStyle.css';
import { FormattedMessage } from 'react-intl';



//@ts-ignore
function ErrorPage({ msg = "Something is really wrong"}) {
    
    const theme = useTheme();

    // const mystyle = {
    //     backgroundColor: "#0064E0",
    // };

    return (
        <div className='mainErrorDiv'>
            <div className='titleError'>
                <h1>{msg}</h1>
            </div>
        </div>
    );
}

export default ErrorPage;
