<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useTaskStore } from '../stores/task';
import LogoutButton from '../components/LogoutButton.vue';

const { user } = useAuth();
const taskStore = useTaskStore();
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const editingTask = ref<{ id: number; title: string; description: string; status: 'pending' | 'completed' } | null>(null);

const userEmail = computed(() => {
  return user.value?.email || 'Guest';
});

const handleAddTask = async () => {
  if (newTaskTitle.value.trim()) {
    await taskStore.addTask(newTaskTitle.value.trim(), newTaskDescription.value.trim());
    newTaskTitle.value = '';
    newTaskDescription.value = '';
  }
};

const startEditing = (task: any) => {
  editingTask.value = {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status
  };
};

const saveEdit = async () => {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, {
      title: editingTask.value.title,
      description: editingTask.value.description,
      status: editingTask.value.status
    });
    editingTask.value = null;
  }
};

const cancelEdit = () => {
  editingTask.value = null;
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
          <div class="task-input-group">
            <input
              v-model="newTaskTitle"
              @keyup.enter="handleAddTask"
              type="text"
              placeholder="Task title..."
              class="task-input"
              :disabled="taskStore.loading"
            />
            <textarea
              v-model="newTaskDescription"
              @keyup.enter="handleAddTask"
              placeholder="Task description (optional)"
              class="task-textarea"
              :disabled="taskStore.loading"
            ></textarea>
          </div>
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
            <!-- Task in view mode -->
            <div v-if="!editingTask || editingTask.id !== task.id" class="task-content">
              <div class="task-header">
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
                <span class="task-status" :class="task.status">
                  {{ task.status }}
                </span>
              </div>
              <div v-if="task.description" class="task-description">
                {{ task.description }}
              </div>
              <div class="task-actions">
                <button 
                  @click="startEditing(task)" 
                  class="edit-button"
                  :disabled="taskStore.loading"
                >
                  Edit
                </button>
                <button 
                  @click="taskStore.deleteTask(task.id)" 
                  class="delete-button"
                  :disabled="taskStore.loading"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <!-- Task in edit mode -->
            <div v-else class="task-edit-form">
              <input
                v-model="editingTask.title"
                type="text"
                class="task-input"
                placeholder="Task title"
              />
              <textarea
                v-model="editingTask.description"
                class="task-textarea"
                placeholder="Task description (optional)"
              ></textarea>
              <div class="task-status-select">
                <label>Status:</label>
                <select v-model="editingTask.status">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div class="edit-actions">
                <button @click="saveEdit" class="save-button">Save</button>
                <button @click="cancelEdit" class="cancel-button">Cancel</button>
              </div>
            </div>
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
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.task-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.task-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.task-textarea {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 60px;
  resize: vertical;
}

.task-input:disabled,
.task-textarea:disabled {
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
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  font-weight: 500;
  color: #111827;
}

.task-title.completed {
  text-decoration: line-through;
  color: #6b7280;
}

.task-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: capitalize;
}

.task-status.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.task-status.completed {
  background-color: #dcfce7;
  color: #166534;
}

.task-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-left: 1.75rem;
  white-space: pre-wrap;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1.75rem;
}

.edit-button {
  padding: 0.25rem 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.edit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.edit-button:not(:disabled):hover {
  background-color: #2563eb;
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

.task-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-status-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-status-select label {
  font-size: 0.875rem;
  color: #4b5563;
}

.task-status-select select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.save-button {
  padding: 0.25rem 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.save-button:hover {
  background-color: #059669;
}

.cancel-button {
  padding: 0.25rem 0.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.cancel-button:hover {
  background-color: #4b5563;
}

.no-tasks {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
}
</style>

