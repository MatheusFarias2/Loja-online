import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3aUD9xgtPVPLI_Iulp7S-RtVJ2qsTeeU",
  authDomain: "loja-online-733d2.firebaseapp.com",
  projectId: "loja-online-733d2",
  storageBucket: "loja-online-733d2.firebasestorage.app",
  messagingSenderId: "483057493659",
  appId: "1:483057493659:web:c9440713b920cce6f9483e",
  measurementId: "G-JK22HK669B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper para imagens
export const getFirebaseImageUrl = (path) => {
  return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(path)}?alt=media`;
};