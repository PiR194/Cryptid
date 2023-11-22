import React from 'react';

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
    return (
        <>
            <Accordion defaultActiveKey={['0']} alwaysOpen style={{width:'100%'}}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{head}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Indice</th>
                                    <th>Déduction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indices
                                    .filter((i) => i instanceof instance)
                                    .map((indice, index) => (
                                        <tr key={index}>
                                            <td>{indice.ToString(lang)}</td>
                                            <td><Case/></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default AccordionIndice;
