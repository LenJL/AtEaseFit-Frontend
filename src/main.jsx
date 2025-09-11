import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
const Client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;



ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={`${Client_id}`}>
    <App />
  </GoogleOAuthProvider>
);
