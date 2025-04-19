import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tower } from '../types';
import { generateMockTowers } from '../mockData';

interface TowerContextType {
  towers: Tower[];
  selectedTower: Tower | null;
  selectTower: (id: string) => void;
  deselectTower: () => void;
  setFilterStatus: (status: string | null) => void;
  toggleTowerVisibility: (id: string) => void;
}

const TowerContext = createContext<TowerContextType | undefined>(undefined);

export const TowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Load mock data on mount
  useEffect(() => {
    const mockTowers = generateMockTowers(30);
    setTowers(mockTowers);
  }, []);
  
  // Select tower
  const selectTower = (id: string) => {
    const tower = towers.find(t => t.id === id) || null;
    setSelectedTower(tower);
  };
  
  const deselectTower = () => {
    setSelectedTower(null);
  };
  
  // Toggle tower visibility
  const toggleTowerVisibility = (id: string) => {
    setTowers(prevTowers =>
      prevTowers.map(tower =>
        tower.id === id ? { ...tower, visible: !tower.visible } : tower
      )
    );
  };
  
  // Filtered towers
  const filteredTowers = filterStatus
    ? towers.filter(tower => tower.status === filterStatus)
    : towers;
  
  return (
    <TowerContext.Provider value={{
      towers: filteredTowers,
      selectedTower,
      selectTower,
      deselectTower,
      setFilterStatus,
      toggleTowerVisibility
    }}>
      {children}
    </TowerContext.Provider>
  );
};

export const useTower = () => {
  const context = useContext(TowerContext);
  if (context === undefined) {
    throw new Error('useTower must be used within a TowerProvider');
  }
  return context;
};