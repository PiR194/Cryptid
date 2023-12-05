
import React from 'react';
import { useTheme } from '../Style/ThemeContext';
import { Link } from 'react-router-dom';
import './ErrorStyle.css';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';

const basePath = process.env.BASEPATH || '';


//@ts-ignore
function ErrorPage({ code = "", msg = "Something is wrong"}) {
    
    const theme = useTheme();


    return (
        <div className='mainErrorDiv'>
            <div className='titleError'>
                <div>
                    <h1>ERROR</h1>
                    <hr style={{width:"100%"}}/>
                </div>
                { code != "" &&
                    <h1 style={{color:'darkred', margin:'10px'}}>{code}</h1>
                } 
                <h2>{msg}</h2>
            </div>

            <div className='centerDivH' style={{margin: "20px"}}>
                <Button href={`${basePath}/join`} variant='danger'>Retour à l'accueil</Button>
            </div>
        </div>
    );
}

export default ErrorPage;
