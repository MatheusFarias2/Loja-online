import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cole aqui as configurações que você copiou do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC3aUD9xgtPVPLI_Iulp7S-RtVJ2qsTeeU",
  authDomain: "loja-online-733d2.firebaseapp.com",
  projectId: "loja-online-733d2",
  storageBucket: "loja-online-733d2.firebasestorage.app",
  messagingSenderId: "483057493659",
  appId: "1:483057493659:web:c9440713b920cce6f9483e",
  measurementId: "G-JK22HK669B"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços que você vai usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Funções úteis para o Firestore
export async function addDocument(collectionName, data) {
  const { collection, addDoc } = await import('firebase/firestore');
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

export async function updateDocument(collectionName, docId, data) {
  const { doc, updateDoc } = await import('firebase/firestore');
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}