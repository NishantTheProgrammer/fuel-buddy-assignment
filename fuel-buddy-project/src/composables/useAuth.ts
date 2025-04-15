import { ref } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userService } from '@/services/userService';

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser;
  });

  const getReadableErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or login.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please check your email and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof Error) {
        error.value = getReadableErrorMessage(e as AuthError);
      } else {
        error.value = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      // Create user in Firebase first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user in our database
      try {
        await userService.createUser(name, email, uid);
      } catch (dbError: any) {
        console.error('Failed to create user in database:', dbError);
        error.value = dbError.response?.data?.error || 'Failed to create user in database';
        await userCredential.user.delete();
        return;
      }
    } catch (e) {
      if (e instanceof Error) {
        error.value = getReadableErrorMessage(e as AuthError);
      } else {
        error.value = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      error.value = null;
      await signOut(auth);
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    error,
    loading,
    login,
    register,
    logout
  };
} 