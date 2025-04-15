<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Create an account</h2>
      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="input-group">
          <input
            id="email-address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="input-field"
            placeholder="Email address"
          />
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="input-field"
            placeholder="Password"
          />
          <input
            id="confirm-password"
            v-model="confirmPassword"
            name="confirm-password"
            type="password"
            autocomplete="new-password"
            required
            class="input-field"
            placeholder="Confirm Password"
          />
        </div>

        <button type="submit" class="submit-button">
          Register
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="login-link">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { register, error } = useAuth();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  await register(email.value, password.value);
  if (!error.value) {
    router.push('/');
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
}

.login-box {
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: border-color 0.15s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.submit-button:hover {
  background-color: #4338ca;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.error-message {
  text-align: center;
  color: #ef4444;
  font-size: 0.875rem;
}

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 