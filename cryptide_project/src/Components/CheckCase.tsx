import React, { useState } from 'react';
import { Link } from 'react-router-dom';


/* style */
import { useTheme } from '../Style/ThemeContext';
import '../Pages/DeducGrid.css';

/* res */
import Check from '../res/icon/checkboxGreen.png';

/* trad */
import { FormattedMessage } from 'react-intl';


//@ts-ignore
function Case() {
    const theme = useTheme();

    const [bg, setbg] = useState('whitesmoke');
    
    //let check = ""; //? avec image
    //let bg = 'whitesmoke';

    function changeOnCheck(){
        // if (check == "")check = Check;
        // else check = "";

        if(bg == "whitesmoke")setbg(theme.colors.tertiary);
        else setbg("whitesmoke");

        console.log("clic")
    }
    
    return (
        <button className='case' onClick={changeOnCheck} style={{backgroundColor: bg, borderColor:'grey'}}>
        </button>
    );
}

export default Case;
