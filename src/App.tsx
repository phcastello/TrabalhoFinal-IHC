import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/DashboardLayout'
import { LoginPage } from './routes/LoginPage'
import { TransportePage } from './routes/TransportePage'
import { NotasPage } from './routes/NotasPage'
import { AulasPage } from './routes/AulasPage'
import { SettingsPage } from './routes/SettingsPage'
import { ToastViewport } from './components/Toast'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/aulas" element={<AulasPage />} />
            <Route path="/transporte" element={<TransportePage />} />
            <Route path="/notas" element={<NotasPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/aulas" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/aulas" replace />} />
      </Routes>
      <ToastViewport />
    </>
  )
}

export default App
