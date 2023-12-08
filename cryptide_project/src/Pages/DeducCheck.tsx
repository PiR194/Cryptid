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
import { positionToEmoji } from '../ColorHelper';

function DeducCheck() {
    const theme = useTheme();
    //const indices = Stub.GenerateIndice();
    
    const params = new URLSearchParams(window.location.search);
    
    const NbPlayer = params.get('nbPlayer');
    const actualPlayerIndex = params.get('actualId') ?? '0';
    
    //const { actualPlayerIndex, players } = useGame();

    // let playerstmp
    // if (players.length == 0) playerstmp = ["1", "2", "3", "4", "5", "4"];
    // else { playerstmp = players}

    //* Gestion players
    const playerList = Array.from({ length: parseInt(NbPlayer ?? '1') }, (_, index) => (index + 1).toString());
    const playerColors = playerList.map((_, index) => positionToEmoji(index, true));
    const players = playerColors.filter((_, index) => index !== parseInt(actualPlayerIndex ?? '0'));

    

    // const players = [
    //     "🔵",
    //     "🟢",
    //     "🟡",
    //     "🟣",
    //     "🔴"
    //]
    //console.log(players)
    // console.log(playerColors)
    // console.log(actualPlayerIndex)

    //* Gestion indices
    const indices = Stub.GenerateIndice();
    
    const halfLength = Math.ceil(indices.length / 2);
    const firstHalfIndices = indices.slice(0, halfLength);
    const secondHalfIndices = indices.slice(halfLength);

        
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
