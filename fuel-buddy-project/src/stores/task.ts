import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])

  function addTask(title: string) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date()
    }
    tasks.value.push(task)
  }

  function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask
  }
}) 