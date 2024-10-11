import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';


export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
  };

  return { user, register, login, logout };
}, {
  persist: true,
});

