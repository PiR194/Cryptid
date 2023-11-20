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

// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'css'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '^.+\\.css$': '<rootDir>/path/to/your/babel-css-transformer.js',
    },
    moduleNameMapper: {
        '\\.css$': '<rootDir>/path/to/your/empty-module.js',
    },
};

export default config;
