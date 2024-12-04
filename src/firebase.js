import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCDPKRpd8vx3SJo8xBMKhVXghxpwtL65UQ",
    authDomain: "vspaze-technologies-d0c7a.firebaseapp.com",
    projectId: "vspaze-technologies-d0c7a",
    storageBucket: "vspaze-technologies-d0c7a.firebasestorage.app",
    messagingSenderId: "577282541398",
    appId: "1:577282541398:web:18af475066659f28cab8f7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);