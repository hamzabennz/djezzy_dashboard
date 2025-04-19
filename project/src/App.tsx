import React from 'react'
import { TowerProvider } from './context/TowerContext'
import { UIProvider } from './context/UIContext'
import Dashboard from './components/Dashboard'

function App() {
    return (
        <UIProvider>
            <TowerProvider>
                <div className="min-h-screen bg-navy-950 text-white font-sans">
                    <Dashboard />
                </div>
            </TowerProvider>
        </UIProvider>
    )
}

export default App
