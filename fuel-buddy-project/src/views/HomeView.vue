<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '../composables/useAuth';
import LogoutButton from '../components/LogoutButton.vue';

const { user } = useAuth();

const userEmail = computed(() => {
  return user.value?.email || 'Guest';
});
</script>

<template>
  <div class="home-container">
    <header class="header">
      <h1 class="title">Fuel Buddy</h1>
      <div class="user-info">
        <span class="username">Welcome, {{ userEmail }}</span>
        <LogoutButton />
      </div>
    </header>
    <main class="main-content">
      <h2>Your Dashboard</h2>
      <p>This is your personalized dashboard. More features coming soon!</p>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-size: 0.875rem;
  color: #6b7280;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.main-content p {
  color: #6b7280;
  line-height: 1.5;
}
</style>
