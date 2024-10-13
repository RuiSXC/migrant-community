import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const db = getFirestore();

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;

    // get additional user info
    const userDocRef = doc(db, "users", user.value.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      user.value = {
          ...user.value,
          ...userData,
      };
    }
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
  };

  return { user, register, login, logout };
}, {
  persist: true,
});

