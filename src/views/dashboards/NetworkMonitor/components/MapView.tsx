import React, { useState } from 'react';
import { useUI } from '../context/UIContext';
import { useTower } from '../context/TowerContext';
import TowerMarker from './TowerMarker';
import MapLegend from './MapLegend';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

const MapView: React.FC = () => {
  const { towers, selectTower } = useTower();
  const { isMobile } = useUI();
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Handle zooming
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.1);
  };

  // Handle panning
  const handlePanStart = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setMapPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          className="bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className={`bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm ${isPanning ? 'bg-primary text-white' : ''}`}
          onMouseDown={() => setIsPanning(!isPanning)}
        >
          <Move className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Map legend */}
      <MapLegend className="absolute bottom-4 left-4 z-10" />

      {/* Map content */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-move"
        style={{
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
          transition: isPanning ? 'none' : 'transform 0.2s ease-out'
        }}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        {/* Map background with grid */}
        <div className="absolute w-[2000px] h-[1500px] bg-gray-50 opacity-70">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgba(209, 213, 219, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(209, 213, 219, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Tower markers */}
        {towers.map(tower => (
          <TowerMarker
            key={tower.id}
            tower={tower}
            position={tower.position}
            onClick={() => selectTower(tower.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MapView;