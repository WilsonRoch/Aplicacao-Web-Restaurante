import { CustomerPage } from './pages/CustomerPage'
import { MenuPage } from './pages/MenuPage'

import './App.css'

type Area = 'admin' | 'cliente'

function getAreaFromLocation(): Area {
    const params = new URLSearchParams(window.location.search)
    return params.get('area') === 'cliente' ? 'cliente' : 'admin'
}

function App() {
    const area = getAreaFromLocation()

    return (
        <div className="app-shell">
            <header className="app-shell__bar">
                <div className="app-shell__brand">
                    <span className="app-shell__brand-mark">RP</span>
                    <div>
                        <strong>Restaurante PLACEHOLDER</strong>
                    </div>
                </div>
            </header>

            <div className="app-shell__content">{area === 'cliente' ? <CustomerPage /> : <MenuPage />}</div>
        </div>
    )
}

export default App
