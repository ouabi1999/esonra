import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from "./app/store"
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'


createRoot(document.getElementById("root")).render(
  <StrictMode>
     <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </HelmetProvider>
  </StrictMode>
);
