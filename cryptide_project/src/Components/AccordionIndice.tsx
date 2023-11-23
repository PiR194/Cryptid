import React, { useState } from 'react';

/* Style */
import '../Style/Global.css';
//import { useTheme } from '../Style/ThemeContext';

/* Model */
import Stub from '../model/Stub';
import Indice from '../model/Indices/Indice';


/* lang */
import { FormattedMessage } from 'react-intl';

/* Boostrap */
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Case from './CheckCase';


interface AccordionIndiceComponentProps<T extends Indice> {
instance: (new (...args: any[]) => T) | (Function & { prototype: T });
    head: string;
    lang: string;
}

const AccordionIndice: React.FC<AccordionIndiceComponentProps<any>> = ({ instance, head, lang }) => {
const indices = Stub.GenerateIndice();
const [selectedRows, setSelectedRows] = useState<number[]>([]);


const handleRowClick = (index: number) => {

    const newSelectedRows = [...selectedRows];

    const selectedIndex = newSelectedRows.indexOf(index);
    if (selectedIndex === -1) {
        newSelectedRows.push(index);
    } else {
        newSelectedRows.splice(selectedIndex, 1);
    }

    console.log('New Selected Rows:', newSelectedRows);
    setSelectedRows(newSelectedRows);
};

return (
    <>
    <Accordion defaultActiveKey={['0']} alwaysOpen style={{ width: '100%' }}>
        <Accordion.Item eventKey="0">
        <Accordion.Header>{head}</Accordion.Header>
        <Accordion.Body>
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Indice</th>
                </tr>
            </thead>
            <tbody>
                {indices
                .filter((i) => i instanceof instance)
                .map((indice, index) => (
                    <tr
                        key={index}
                        onClick={() => handleRowClick(index)}
                        style={{
                            cursor: 'pointer',
                        }}>
                        <td
                            style={{
                                border: selectedRows.includes(index) ? '1px solid red' : 'none',
                                backgroundColor: selectedRows.includes(index) ? '#FF9191' : 'white',
                            }}>
                            {indice.ToString(lang)}
                        </td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </Accordion.Body>
        </Accordion.Item>
    </Accordion>
    </>
);
};

export default AccordionIndice;