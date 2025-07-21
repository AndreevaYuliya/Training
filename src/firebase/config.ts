import { getApps, getApp, initializeApp } from "firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkfBPfGbF3_H4O_MIzakdA5GxUhsnXwdg",
  authDomain: "training-app-y.firebaseapp.com",
  projectId: "training-app-y",
  storageBucket: "training-app-y.appspot.com", // исправил на правильный формат
  messagingSenderId: "400167117988",
  appId: "1:400167117988:web:b5ef97378d109cc696b231",
  measurementId: "G-PNHD7L71M2",
};

// Инициализация Firebase App
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// export const getFirebaseAuth = () => getAuth(app);
