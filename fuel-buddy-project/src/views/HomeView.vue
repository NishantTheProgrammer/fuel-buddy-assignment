<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useTaskStore } from '../stores/task';
import LogoutButton from '../components/LogoutButton.vue';

const { user } = useAuth();
const taskStore = useTaskStore();
const newTaskTitle = ref('');

const userEmail = computed(() => {
  return user.value?.email || 'Guest';
});

const handleAddTask = () => {
  if (newTaskTitle.value.trim()) {
    taskStore.addTask(newTaskTitle.value.trim());
    newTaskTitle.value = '';
  }
};
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
          />
          <button @click="handleAddTask" class="add-button">Add Task</button>
        </div>

        <div class="task-list">
          <div v-for="task in taskStore.tasks" :key="task.id" class="task-item">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="taskStore.toggleTask(task.id)"
              class="task-checkbox"
            />
            <span :class="{ 'completed': task.completed }" class="task-title">
              {{ task.title }}
            </span>
            <button @click="taskStore.deleteTask(task.id)" class="delete-button">
              Delete
            </button>
          </div>
          <p v-if="taskStore.tasks.length === 0" class="no-tasks">
            No tasks yet. Add one above!
          </p>
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

.add-button:hover {
  background-color: #4338ca;
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

.delete-button:hover {
  background-color: #dc2626;
}

.no-tasks {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
}
</style>
