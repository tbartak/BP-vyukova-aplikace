import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import IntersectionSelectPage from './pages/IntersectionSelectPage'
import SchemeSelectPage from './pages/SchemeSelectPage'
import VariantSelectPage from './pages/VariantSelectPage'
import DetailPage from './pages/DetailPage'
import { AppProvider } from './context/AppContext'
import './App.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-intersection" element={<IntersectionSelectPage />} />
          <Route path="/select-scheme/:type" element={<SchemeSelectPage />} />
          <Route
            path="/select-variant/:type/:schemeId"
            element={<VariantSelectPage />}
          />
          <Route path="/detail" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App