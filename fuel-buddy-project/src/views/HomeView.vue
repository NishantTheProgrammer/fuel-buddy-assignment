<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAuth } from "../composables/useAuth";
import { useTaskStore } from "../stores/task";
import type { Task } from "../stores/task";
import LogoutButton from "../components/LogoutButton.vue";

const { user } = useAuth();
const taskStore = useTaskStore();
const newTaskTitle = ref("");
const newTaskDescription = ref("");
const newTaskAssigneeIds = ref<string[]>([]);
const availableAssignees = ref<{ id: string; name: string }[]>([]);
const editingTask = ref<{
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  assigneeIds: string[];
} | null>(null);
const taskFilter = ref("all"); // 'all', 'my', 'shared'
const showAddTask = ref(false);

const userEmail = computed(() => {
  return user.value?.email || "Guest";
});

// Filter tasks based on the selected filter
const filteredTasks = computed(() => {
  if (!user.value?.uid) return taskStore.tasks;

  switch (taskFilter.value) {
    case "my":
      return taskStore.tasks.filter((task) => task.creator?.id === user.value?.uid);
    case "shared":
      return taskStore.tasks.filter(
        (task) =>
          task.creator?.id !== user.value?.uid &&
          task.assignees.some((assignee) => assignee.id === user.value?.uid)
      );
    default:
      return taskStore.tasks;
  }
});

const handleAddTask = async () => {
  if (newTaskTitle.value.trim()) {
    await taskStore.addTask(
      newTaskTitle.value.trim(),
      newTaskDescription.value.trim(),
      newTaskAssigneeIds.value
    );
    newTaskTitle.value = "";
    newTaskDescription.value = "";
    newTaskAssigneeIds.value = [];
  }
};

const startEditing = (task: any) => {
  editingTask.value = {
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status,
    assigneeIds: task.assignees?.map((a: any) => a.id) || [],
  };
};

const saveEdit = async () => {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, {
      title: editingTask.value.title,
      description: editingTask.value.description,
      status: editingTask.value.status,
      assigneeIds: editingTask.value.assigneeIds,
    });
    editingTask.value = null;
  }
};

const cancelEdit = () => {
  editingTask.value = null;
};

onMounted(async () => {
  taskStore.fetchTasks();
  // Fetch available assignees
  try {
    const response = await fetch("/api/users");
    if (response.ok) {
      availableAssignees.value = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch assignees:", error);
  }
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
        <div class="section-header">
          <h2>Your Tasks</h2>
          <button @click="showAddTask = !showAddTask" class="new-task-button">
            {{ showAddTask ? 'Cancel' : '+ New Task' }}
          </button>
        </div>
        
        <div v-if="showAddTask" class="add-task">
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

            <!-- Add assignee selection -->
            <div class="assignee-selection">
              <label>Assignees:</label>
              <div class="assignee-list">
                <div
                  v-for="assignee in availableAssignees"
                  :key="assignee.id"
                  class="assignee-item"
                >
                  <input
                    type="checkbox"
                    :id="'assignee-' + assignee.id"
                    v-model="newTaskAssigneeIds"
                    :value="assignee.id"
                  />
                  <label :for="'assignee-' + assignee.id">{{ assignee.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <button @click="handleAddTask" class="add-button" :disabled="taskStore.loading">
            {{ taskStore.loading ? "Adding..." : "Add Task" }}
          </button>
        </div>

        <div class="task-filter">
          <label for="task-filter">Filter:</label>
          <select id="task-filter" v-model="taskFilter" class="filter-select">
            <option value="all">All Tasks</option>
            <option value="my">My Tasks</option>
            <option value="shared">Shared with Me</option>
          </select>
        </div>

        <div v-if="taskStore.error" class="error-message">
          {{ taskStore.error }}
        </div>

        <div class="task-list">
          <div
            v-if="taskStore.loading && !taskStore.tasks.length"
            class="loading-message"
          >
            Loading tasks...
          </div>
          <div v-else-if="!taskStore.loading && !taskStore.tasks.length" class="no-tasks">
            No tasks yet. Add one above!
          </div>
          <div v-else v-for="task in filteredTasks" :key="task.id" class="task-item">
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
                <span
                  :class="{ completed: task.status === 'completed' }"
                  class="task-title"
                >
                  {{ task.title }}
                </span>
                <span class="task-status" :class="task.status">
                  {{ task.status }}
                </span>
              </div>
              <div v-if="task.description" class="task-description">
                {{ task.description }}
              </div>
              <div class="task-meta">
                <div class="task-owner">
                  <span class="meta-label">Owner:</span>
                  <span class="meta-value">{{ task.creator?.name || "Unknown" }}</span>
                </div>
                <div class="task-assignees">
                  <span class="meta-label">Assignees:</span>
                  <span class="meta-value">
                    {{
                      task.assignees?.length
                        ? task.assignees.map((a) => a.name).join(", ")
                        : "None"
                    }}
                  </span>
                </div>
              </div>
              <div class="task-actions">
                <button
                  v-if="task.creator?.id === user?.uid"
                  @click="startEditing(task)"
                  class="edit-button"
                  :disabled="taskStore.loading"
                >
                  Edit
                </button>
                <button
                  v-if="task.creator?.id === user?.uid"
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

              <!-- Add assignee selection for editing -->
              <div class="assignee-selection">
                <label>Assignees:</label>
                <div class="assignee-list">
                  <div
                    v-for="assignee in availableAssignees"
                    :key="assignee.id"
                    class="assignee-item"
                  >
                    <input
                      type="checkbox"
                      :id="'edit-assignee-' + assignee.id"
                      v-model="editingTask.assigneeIds"
                      :value="assignee.id"
                    />
                    <label :for="'edit-assignee-' + assignee.id">{{
                      assignee.name
                    }}</label>
                  </div>
                </div>
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
  background-color: #e0e7ff;
  padding: 0;
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.task-section {
  background-color: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.task-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.new-task-button {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.new-task-button:hover {
  background-color: #4338ca;
}

.add-task {
  margin-bottom: 2rem;
  background-color: #f5f7ff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7ff;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.task-input,
.task-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
}

.task-textarea {
  min-height: 100px;
}

.assignee-selection {
  margin-top: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.assignee-selection label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.assignee-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 0.5rem;
}

.assignee-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f5f7ff;
  border-radius: 0.375rem;
}

.add-button {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.task-filter {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f5f7ff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7ff;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  min-width: 150px;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.task-item {
  padding: 1.25rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-header {
  margin-bottom: 1rem;
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
  font-size: 1rem;
  font-weight: 500;
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

.task-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.meta-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-value {
  font-size: 0.875rem;
  color: #111827;
}

.task-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
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

.loading-message {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
}
</style>
