// AuthContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Player from '../model/Player';
import User from '../model/User';
import AuthService from '../services/AuthService';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: User | null
  setUserData: (newPlayer: User) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User| null>(null)

  const login = () => {
    setIsLoggedIn(true);
  };

  const setUserData = (newPlayer: User) => {
    setUser(newPlayer)
  }

  const logout = async() => {
    try {
        await AuthService.logout();
        setIsLoggedIn(false);
    }
    catch (error) {
        console.log(error);
    };
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
