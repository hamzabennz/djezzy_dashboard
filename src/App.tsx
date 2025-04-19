import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { UIProvider } from './views/dashboards/NetworkMonitor/context/UIContext'
import { TowerProvider } from './views/dashboards/NetworkMonitor/context/TowerContext'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <UIProvider>
            <TowerProvider>
                <Theme>
                    <BrowserRouter>
                        <AuthProvider>
                            <Layout>
                                <Views />
                            </Layout>
                        </AuthProvider>
                    </BrowserRouter>
                </Theme>
            </TowerProvider>
        </UIProvider>
    )
}

export default App
