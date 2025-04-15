import { ref } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);

  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser;
  });

  const login = async (email: string, password: string) => {
    try {
      error.value = null;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      error.value = (e as Error).message;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      error.value = null;
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      error.value = (e as Error).message;
    }
  };

  const logout = async () => {
    try {
      error.value = null;
      await signOut(auth);
    } catch (e) {
      error.value = (e as Error).message;
    }
  };

  return {
    user,
    error,
    login,
    register,
    logout
  };
} 