import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./components/AuthContext";
import {AuthModalProvider} from "./components/AuthModal";
import {PathProvider} from "./components/PathContext";
import {AuthModalHookBridge} from "./HookBridge/authModalHookBridge";
declare global {
    interface Window {
        env:{BACKEND_URL:string};
    }
}
window.env={BACKEND_URL:"http://localhost:5001"};
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <PathProvider>
          <AuthProvider>
              <AuthModalProvider>
                  <AuthModalHookBridge/>
                      <App />
              </AuthModalProvider>
          </AuthProvider>
      </PathProvider>
  </React.StrictMode>
);


