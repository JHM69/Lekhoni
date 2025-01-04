// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

 

export const firebaseConfig = {
    apiKey: "AIzaSyAKtuurz30Bndbn67sWuBOrraBjO8kDg3k",
    authDomain: "kuet-lekhoni.firebaseapp.com",
    databaseURL: "https://kuet-lekhoni-default-rtdb.firebaseio.com",
    projectId: "kuet-lekhoni",
    storageBucket: "kuet-lekhoni.firebasestorage.app",
    messagingSenderId: "1091867962320",
    appId: "1:1091867962320:web:508a4293fcbd3e7412e7d5"
  };
  

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
