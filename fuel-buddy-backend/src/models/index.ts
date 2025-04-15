import sequelize from '../config/database';
import User from './User';
import Task from './Task';

// Define associations
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Sync all models
const syncDatabase = async () => {
  try {
    // Use force: true to drop and recreate tables (WARNING: this will delete all data)
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

export { User, Task, syncDatabase }; 