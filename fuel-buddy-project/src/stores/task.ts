import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '../services/taskService'

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: Date;
  userId: string;
  creator?: User;
  assignees: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskService.getTasks()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function addTask(title: string, description?: string, assigneeIds?: string[]) {
    loading.value = true
    error.value = null
    try {
      const task = await taskService.createTask(title, description, assigneeIds)
      tasks.value.push(task)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function toggleTask(id: number) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    loading.value = true
    error.value = null
    try {
      const updatedTask = await taskService.updateTask(id, { 
        status: task.status === 'completed' ? 'pending' : 'completed'
      })
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: number, updates: Partial<Task> & { assigneeIds?: string[] }) {
    loading.value = true
    error.value = null
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number) {
    loading.value = true
    error.value = null
    try {
      await taskService.deleteTask(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask
  }
}) 