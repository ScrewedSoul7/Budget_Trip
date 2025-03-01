import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyCf_EdBVun4NF0V-qwDneYf0sCossznn4A",
  authDomain: "budget-trip.firebaseapp.com",
  projectId: "budget-trip",
  storageBucket: "budget-trip.firebasestorage.app",
  messagingSenderId: "337372348674",
  appId: "1:337372348674:web:130c5141936fd77ae8421b",
  measurementId: "G-QHHP9GBWCJ",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, provider, db };