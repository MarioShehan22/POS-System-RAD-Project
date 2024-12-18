import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import {Container} from "react-bootstrap";
import "./index.css"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Container>
          <App/>
      </Container>
  </StrictMode>,
)
