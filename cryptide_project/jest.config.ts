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
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'png'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '\\.(png)$': '<rootDir>/fileTransformer.js',
    },
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/empty-module.js',
    },
};

export default config;

