import sequelize from '../config/database';
import User from './User';
import Task from './Task';
import TaskAssignee from './TaskAssignee';

// Define associations
User.hasMany(Task, { foreignKey: 'userId', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Many-to-many relationship for assignees
Task.belongsToMany(User, { 
  through: TaskAssignee,
  foreignKey: 'taskId',
  otherKey: 'userId',
  as: 'assignees'
});

User.belongsToMany(Task, {
  through: TaskAssignee,
  foreignKey: 'userId',
  otherKey: 'taskId',
  as: 'assignedTasks'
});

// Sync all models
const syncDatabase = async () => {
  try {
    // Use force: true to drop and recreate tables (WARNING: this will delete all data)
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

export { User, Task, TaskAssignee, syncDatabase }; 