// import type {Config} from 'jest';

// const config: Config = {
//     verbose: true,
// };

// export default config;

// import type {Config} from 'jest';
// import {defaults} from 'jest-config';

// const config: Config = {
//     moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
// };

// export default config;

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
};

export default config;
