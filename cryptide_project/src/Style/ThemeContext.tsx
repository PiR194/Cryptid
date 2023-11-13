// ThemeContext.js
import React, { createContext, useContext } from 'react';
import theme from './Theme';

const ThemeContext = createContext(theme);

export const useTheme = () => useContext(ThemeContext);

//@ts-ignore
export const ThemeProvider = ({ children }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);


//* style={{ color: theme.colors.primary }}