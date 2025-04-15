<template>
  <button @click="handleLogout" class="logout-button">
    Logout
  </button>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

export default {
  name: 'LogoutButton',
  setup() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
      await logout();
      router.push('/login');
    };

    return {
      handleLogout
    };
  }
};
</script>

<style scoped>
.logout-button {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.logout-button:hover {
  background-color: #dc2626;
}

.logout-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}
</style> 