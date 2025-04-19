import React from 'react'
import Header from './Header'
import MapView from './MapView'
import TowerStatisticsPanel from './TowerStatisticsPanel'
import MonitoringSection from './MonitoringSection'
import Chatbot from './Chatbot'
import Terminal from './Terminal'
import ControlPanel from './ControlPanel'
import { useTower } from '../context/TowerContext'
import { useUI } from '../context/UIContext'

const Dashboard: React.FC = () => {
    const { selectedTower } = useTower()
    const { isMobile } = useUI()

    return (
        <div className="flex flex-col h-full bg-navy-950">
            <Header />

            <div className="flex-1 flex overflow-hidden p-4 gap-4">
                {/* Main content area */}
                <div className="flex-1 flex flex-col gap-4">
                    <MapView />
                    {isMobile && selectedTower && <TowerStatisticsPanel />}
                    {isMobile && <MonitoringSection />}
                </div>

                {/* Side panel */}
                {!isMobile && (
                    <div className="w-96 flex flex-col gap-4">
                        {selectedTower && <TowerStatisticsPanel />}
                        <MonitoringSection />
                        <ControlPanel />
                    </div>
                )}
            </div>

            <Terminal />
            <Chatbot />
        </div>
    )
}

export default Dashboard
