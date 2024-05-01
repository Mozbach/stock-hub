import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhw6M38WCpHiSe2V9jw_hk1fhC8Mn3Dfg",
  authDomain: "hubstock-lcc1988.firebaseapp.com",
  projectId: "hubstock-lcc1988",
  storageBucket: "hubstock-lcc1988.appspot.com",
  messagingSenderId: "708099124393",
  appId: "1:708099124393:web:ddb30e7bb716a330eb4db8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();