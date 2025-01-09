import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import {Container} from "react-bootstrap";
import "./index.css"
import { BrowserRouter as Router} from "react-router-dom";
import NavBar from './component/PageBadge/NavBar.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Router>
        <App/>
      </Router>
  </StrictMode>,
)
