import React from 'react';


/* Style */
import './DeducGrid.css';
import { useTheme } from '../Style/ThemeContext';

/* Component */

/* Boostrap */
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

/* nav */
import { Link } from 'react-router-dom';

/* lang */
import { FormattedMessage } from 'react-intl';
import Case from '../Components/CheckCase';

import Age from '../model/Indices/AgeIndice'
import Stub from '../model/Stub';
import Edge from '../model/Graph/Edge';
import EdgesIndice from '../model/Indices/EdgesIndice';
import AccordionIndice from '../Components/AccordionIndice';
import AgeIndice from '../model/Indices/AgeIndice';
import ColorIndice from '../model/Indices/ColorIndice';
import ColorEdgesIndice from '../model/Indices/ColorEdgesIndice';
import SportIndice from '../model/Indices/SportIndice';
import NbEdgesIndice from '../model/Indices/NbEdgesIndice';
import NbSportIndice from '../model/Indices/NbSportIndice';
import { useGame } from '../Contexts/GameContext';

function DeducGrid() {
    const theme = useTheme();
    //const indices = Stub.GenerateIndice();


    // const { players } = useGame();

    const players = [
        "bla",
        "bli",
        "blou"
    ]
        
    console.log(players)
    return (
        <div style={{margin:'20px'}}>
            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3">
            {players.map((joueur, index) => (
                <Tab key={index} eventKey={index.toString()} title={`${joueur} ${index + 1}`}>
                    <div className='deducDiv'>
                        <div className='sectionAccordion'>
                            <AccordionIndice instance={AgeIndice} head='Age' lang='fr'/>
                        </div>
                        <div className='sectionAccordion'>
                            <AccordionIndice instance={ColorIndice} head='Couleur de cheveux' lang='fr'/>
                            <AccordionIndice instance={ColorEdgesIndice} head='Couleur de cheveux voisine' lang='fr'/>
                        </div>
                        <div className='sectionAccordion'>
                            <AccordionIndice instance={SportIndice} head='Sport' lang='fr'/>
                            <AccordionIndice instance={NbSportIndice} head='Nombre de Sport' lang='fr'/>
                        </div>
                        <div className='sectionAccordion'>
                            <AccordionIndice instance={EdgesIndice} head='Caractéristique des voisin' lang='fr'/>
                            <AccordionIndice instance={NbEdgesIndice} head='Nombre de voisin' lang='fr'/>
                        </div>
                    </div>
                </Tab>
            ))}
            </Tabs>
        </div>
    );
}

export default DeducGrid;
