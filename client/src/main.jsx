import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import ErrorBoundary from './app/ErrorBoundary.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
 <Provider store={store}>
  <BrowserRouter>
    <App />
</BrowserRouter>
 </Provider>
 </ErrorBoundary>
  
)
