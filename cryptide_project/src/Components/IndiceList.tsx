import React from 'react';

/* Style */
import '../Style/Global.css';
//import { useTheme } from '../Style/ThemeContext';

/* Model */
import Stub from '../model/Stub';
import Indice from '../model/Indices/Indice';

/* lang */
import { FormattedMessage } from 'react-intl';

interface IndiceListComponentProps<T extends Indice> {
    instance: (new (...args: any[]) => T) | (Function & { prototype: T });
    lang: string;
}

const IndiceList: React.FC<IndiceListComponentProps<any>> = ({ instance, lang }) => {
    const indices = Stub.GenerateIndice();
    return (
        <>
            <ul className='listContainer'>
                {indices
                    .filter((i) => i instanceof instance)
                    .map((indice, index) => (
                        <p key={index}>{indice.ToString(lang)}</p>
                    ))}
            </ul>
        </>
    );
}

export default IndiceList;
