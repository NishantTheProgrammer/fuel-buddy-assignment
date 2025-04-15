import 'dotenv/config';
import Task from '../models/Task';
import sequelize from '../config/database';

async function listTasks() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    const tasks = await Task.findAll();
    console.log(`Found ${tasks.length} tasks:`);
    
    tasks.forEach(task => {
      console.log(`ID: ${task.id}, Title: ${task.title}, Status: ${task.status}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

listTasks(); 