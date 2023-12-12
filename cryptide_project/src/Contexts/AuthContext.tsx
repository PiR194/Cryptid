// AuthContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';
import DbUserService from '../model/DataManagers/DbUserService';
import Manager from '../model/DataManagers/Manager';
import Player from '../model/Player';
import User from '../model/User';
import AuthService from '../services/AuthService';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: User | null
  setUserData: (newPlayer: User) => void
  manager: Manager
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User| null>(null)
  const [manager] = useState<Manager>(new Manager(new DbUserService()))

  const login = async () => {
    setIsLoggedIn(true);
  };

  const setUserData = (newPlayer: User) => {
    setUser(newPlayer)
  }

  const logout = async() => {
    try {
        await AuthService.logout();
        setIsLoggedIn(false);
        const [u, bool] = await manager.userService.fetchUserInformation()
        setUser(u)
    }
    catch (error) {
        console.log(error);
    };
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUserData, manager }}>
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
