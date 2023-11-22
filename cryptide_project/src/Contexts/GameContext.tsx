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
  turnPlayerIndex: number;
  room: string;
  onlyFalse: boolean
  winner: Player | null
  setIndicesData: (newIndices: Indice[]) => void;
  setIndiceData: (newIndice: Indice) => void;
  setPersonData: (newPerson: Person) => void;
  setPersonNetworkData: (newPersonNetwork: PersonNetwork) => void;
  setPlayersData: (newPlayer: Player[]) => void;
  setNodeIdData: (newId: number) => void;
  setAskedPersonsData: (newAskedPersons: Person[]) => void;
  setActualPlayerIndexData: (newActualPlayerIndex: number) => void;
  setTurnPlayerIndexData: (newTurnPlayerIndex: number) => void;
  setRoomData: (newRoom: string) => void;
  setOnlyFalseData: (newOnlyFalse: boolean) => void
  setWinnerData: (winner: Player) => void
  reset: () => void
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
  const [turnPlayerIndex, setTurnPlayerIndex] = useState<number>(-1)
  const [room, setRoom] = useState<string>("")
  const [onlyFalse, setOnlyFalse] = useState<boolean>(false)
  const [winner, setWinner] = useState<Player | null>(null)


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

  const setTurnPlayerIndexData = (newTurnPlayerIndex: number) =>{
    setTurnPlayerIndex(newTurnPlayerIndex)
  }

  const setRoomData = (newRoom: string) =>{
    setRoom(newRoom)
  }

  const setOnlyFalseData = (newOnlyFalse: boolean) =>{
    setOnlyFalse(newOnlyFalse)
  }

  const setWinnerData = (winner: Player) =>{
    setWinner(winner)
  }

  const reset = () => {
    setIndices([])
    setActualPlayerIndex(-1)
    setAskedPersons([])
    setPlayers([])
    setPerson(null)
    setPersonNetwork(null)
    setRoom("")
    setWinner(null)
    setTurnPlayerIndex(-1)
    setNodeId(-1)
    setIndice(null)
  }

  return (
    <GameContext.Provider value={{ indices, setIndicesData, indice, setIndiceData, person, setPersonData, personNetwork, setPersonNetworkData, players, setPlayersData, nodeId, setNodeIdData, askedPersons, setAskedPersonsData, actualPlayerIndex, setActualPlayerIndexData, turnPlayerIndex, setTurnPlayerIndexData, room, setRoomData, onlyFalse, setOnlyFalseData, winner, setWinnerData, reset }}>
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
