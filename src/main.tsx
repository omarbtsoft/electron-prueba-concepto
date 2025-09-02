import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Routes, Route, HashRouter } from "react-router-dom";
import PersonaDetalle from './PersonaDetalle.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/persona/:id" element={<PersonaDetalle />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
