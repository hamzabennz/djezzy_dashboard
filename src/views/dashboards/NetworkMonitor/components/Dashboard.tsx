import React from 'react'
import Header from './Header'
import MapView from './MapView'
import TowerStatisticsPanel from './TowerStatisticsPanel'
import MonitoringSection from './MonitoringSection'
import Chatbot from './Chatbot'
import Terminal from './Terminal'
import { useTower } from '../context/TowerContext'
import { useUI } from '../context/UIContext'

const Dashboard: React.FC = () => {
    const { selectedTower } = useTower()
    const { isMobile } = useUI()

    return (
        <div>
            <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
                <Header />

                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1">
                        <MapView />
                        {isMobile && selectedTower && <TowerStatisticsPanel />}
                    </div>

                    {!isMobile && (
                        <div className="flex flex-col gap-4 2xl:min-w-[360px]">
                            <TowerStatisticsPanel />
                            <MonitoringSection />
                        </div>
                    )}
                </div>

                <Chatbot />
                <Terminal />
            </div>
        </div>
    )
}

export default Dashboard
