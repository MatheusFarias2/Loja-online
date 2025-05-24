import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '/src/App';
import '/styles/main.css';

// Configuração do Firebase
if (typeof window !== 'undefined') {
const firebaseConfig = {
  apiKey: "AIzaSyC3aUD9xgtPVPLI_Iulp7S-RtVJ2qsTeeU",
  authDomain: "loja-online-733d2.firebaseapp.com",
  projectId: "loja-online-733d2",
  storageBucket: "loja-online-733d2.firebasestorage.app",
  messagingSenderId: "483057493659",
  appId: "1:483057493659:web:c9440713b920cce6f9483e",
  measurementId: "G-JK22HK669B"
};


  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);