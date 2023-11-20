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
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // Ajoutez cette ligne pour activer le support des modules ECMAScript
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!@babel/runtime)'],
};

export default config;
