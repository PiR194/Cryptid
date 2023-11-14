import React, { createContext, useContext, useState, ReactNode } from 'react';
import Indice from '../model/Indices/Indice';
import Person from '../model/Person';
import PersonNetwork from '../model/PersonsNetwork';
import Player from '../model/Player';

interface GameContextProps {
  indices: Indice[];
  indice: Indice | null
  person: Person | null;
  personNetwork: PersonNetwork | null;
  players: Player[]
  nodeId: number | null
  askedPersons: Person[];
  actualPlayerIndex: number;
  room: string;
  setIndicesData: (newIndices: Indice[]) => void;
  setIndiceData: (newIndice: Indice) => void;
  setPersonData: (newPerson: Person) => void;
  setPersonNetworkData: (newPersonNetwork: PersonNetwork) => void;
  setPlayersData: (newPlayer: Player[]) => void;
  setNodeIdData: (newId: number) => void;
  setAskedPersonsData: (newAskedPersons: Person[]) => void;
  setActualPlayerIndexData: (newActualPlayerIndex: number) => void;
  setRoomData: (newRoom: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [indice, setIndice] = useState<Indice | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [personNetwork, setPersonNetwork] = useState<PersonNetwork | null>(null);
  const [players, setPlayers] = useState<Player[]>([])
  const [nodeId, setNodeId] = useState<number | null>(null);
  const [askedPersons, setAskedPersons] = useState<Person[]>([])
  const [actualPlayerIndex, setActualPlayerIndex] = useState<number>(-1)
  const [room, setRoom] = useState<string>("")


  const setIndicesData = (newIndices: Indice[]) => {
    setIndices(newIndices);
  };

  const setIndiceData = (newIndice: Indice) =>{
    setIndice(newIndice)
  };


  const setPersonData = (newPerson: Person) => {
    setPerson(newPerson);
  };

  const setPersonNetworkData = (newPersonNetwork: PersonNetwork) => {
    setPersonNetwork(newPersonNetwork);
  };

  const setPlayersData = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
  };

  const setNodeIdData = (newId: number) => {
    setNodeId(newId);
  };

  const setAskedPersonsData = (newAskedPerson: Person[]) => {
    setAskedPersons(newAskedPerson);
  };

  const setActualPlayerIndexData = (newActualPlayerIndex: number) =>{
    setActualPlayerIndex(newActualPlayerIndex)
  }

  const setRoomData = (newRoom: string) =>{
    setRoom(newRoom)
  }

  return (
    <GameContext.Provider value={{ indices, setIndicesData, indice, setIndiceData, person, setPersonData, personNetwork, setPersonNetworkData, players, setPlayersData, nodeId, setNodeIdData, askedPersons, setAskedPersonsData, actualPlayerIndex, setActualPlayerIndexData, room, setRoomData }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within an GameProvider');
  }
  return context;
};
