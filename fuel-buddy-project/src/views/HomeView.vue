<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useTaskStore } from '../stores/task';
import LogoutButton from '../components/LogoutButton.vue';

const { user } = useAuth();
const taskStore = useTaskStore();
const newTaskTitle = ref('');

const userEmail = computed(() => {
  return user.value?.email || 'Guest';
});

const handleAddTask = async () => {
  if (newTaskTitle.value.trim()) {
    await taskStore.addTask(newTaskTitle.value.trim());
    newTaskTitle.value = '';
  }
};

onMounted(() => {
  taskStore.fetchTasks();
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
      <div class="task-section">
        <h2>Your Tasks</h2>
        
        <div class="add-task">
          <input
            v-model="newTaskTitle"
            @keyup.enter="handleAddTask"
            type="text"
            placeholder="Add a new task..."
            class="task-input"
            :disabled="taskStore.loading"
          />
          <button 
            @click="handleAddTask" 
            class="add-button"
            :disabled="taskStore.loading"
          >
            {{ taskStore.loading ? 'Adding...' : 'Add Task' }}
          </button>
        </div>

        <div v-if="taskStore.error" class="error-message">
          {{ taskStore.error }}
        </div>

        <div class="task-list">
          <div v-if="taskStore.loading && !taskStore.tasks.length" class="loading-message">
            Loading tasks...
          </div>
          <div v-else-if="!taskStore.loading && !taskStore.tasks.length" class="no-tasks">
            No tasks yet. Add one above!
          </div>
          <div v-else v-for="task in taskStore.tasks" :key="task.id" class="task-item">
            <input
              type="checkbox"
              :checked="task.status === 'completed'"
              @change="taskStore.toggleTask(task.id)"
              class="task-checkbox"
              :disabled="taskStore.loading"
            />
            <span :class="{ 'completed': task.status === 'completed' }" class="task-title">
              {{ task.title }}
            </span>
            <button 
              @click="taskStore.deleteTask(task.id)" 
              class="delete-button"
              :disabled="taskStore.loading"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
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

.task-section {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.add-task {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.task-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.task-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.add-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.add-button:not(:disabled):hover {
  background-color: #4338ca;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading-message {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.task-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.task-checkbox:disabled {
  cursor: not-allowed;
}

.task-title {
  flex: 1;
  font-size: 0.875rem;
  color: #111827;
}

.task-title.completed {
  text-decoration: line-through;
  color: #6b7280;
}

.delete-button {
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.delete-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.delete-button:not(:disabled):hover {
  background-color: #dc2626;
}

.no-tasks {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
}
</style>
