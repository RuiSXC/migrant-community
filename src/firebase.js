import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyA14w98CpnirUk2Pa-sBBk4WogQZYoJiBY',
  authDomain: 'migrant-community.firebaseapp.com',
  projectId: 'migrant-community',
  storageBucket: 'migrant-community.appspot.com',
  messagingSenderId: '271468436363',
  appId: '1:271468436363:web:f8a20776831e757e9c6d8e'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
