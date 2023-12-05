import React from 'react';

/* Style */
import './DeducGrid.css';
import { useTheme } from '../Style/ThemeContext';

/* Component */

/* Boostrap */
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

/* lang */
import { FormattedMessage } from 'react-intl';

/* model */
import Stub from '../model/Stub';

import { useGame } from '../Contexts/GameContext';

function DeducCheck() {
    const theme = useTheme();
    //const indices = Stub.GenerateIndice();
    

    // const { players } = useGame();

    const indices = Stub.GenerateIndice();
    
    const halfLength = Math.ceil(indices.length / 2);
    const firstHalfIndices = indices.slice(0, halfLength);
    const secondHalfIndices = indices.slice(halfLength);
    
    const players = [
        "🔵",
        "🟢",
        "🟡",
        "🟣",
        "🔴"]

    // const players = [
    //     "bla",
    //     "bli",
    //     "blou",
    //     "blu",
    //     "ble",
    // ]
        
    console.log(players)
    return (
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {/* Premier tableau */}
                <Table striped bordered hover style={{ marginRight: '20px' }}>
                    <thead>
                        <tr>
                            <th>Indices</th>
                            {players.map((player, index) => (
                                <th key={index}>{player}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {firstHalfIndices.map((indice, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{indice.ToString("fr")}</td>
                                {players.map((player, colIndex) => (
                                    <td key={colIndex}>
                                        {/* <input type="checkbox"/> */}
                                        <Form.Check aria-label="option 1" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Deuxième tableau */}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Indices</th>
                            {players.map((player, index) => (
                                <th key={index}>{player}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {secondHalfIndices.map((indice, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{indice.ToString("fr")}</td>
                                {players.map((player, colIndex) => (
                                    <td key={colIndex}>
                                        {/* <input type="checkbox"/> */}
                                        <Form.Check aria-label="option 1" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default DeducCheck;
