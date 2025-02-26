import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import "./index.css"
import { BrowserRouter as Router} from "react-router-dom";
import {AuthProvider} from './confige/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <App/>
      </Router>
    </AuthProvider>
  </StrictMode>,
)
