import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMockTowers } from '../mockData';
import { Tower } from '../types';

interface TowerContextType {
  towers: Tower[];
  selectedTower: Tower | null;
  selectTower: (id: string) => void;
  deselectTower: () => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

const TowerContext = createContext<TowerContextType | null>(null);

export const TowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [towers, setTowers] = useState<Tower[]>(() => generateMockTowers(30));
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const selectTower = (id: string) => {
    const found = towers.find(tower => tower.id === id);
    if (found) {
      setSelectedTower(found);
    }
  };

  const deselectTower = () => {
    setSelectedTower(null);
  };

  return (
    <TowerContext.Provider value={{
      towers,
      selectedTower,
      selectTower,
      deselectTower,
      filterStatus,
      setFilterStatus
    }}>
      {children}
    </TowerContext.Provider>
  );
};

export const useTower = () => {
  const context = useContext(TowerContext);
  if (!context) {
    throw new Error('useTower must be used within a TowerProvider');
  }
  return context;
};