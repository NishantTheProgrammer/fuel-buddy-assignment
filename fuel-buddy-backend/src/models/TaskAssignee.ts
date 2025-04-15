import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class TaskAssignee extends Model {
  public taskId!: number;
  public userId!: string;
}

TaskAssignee.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Tasks',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'TaskAssignee',
    tableName: 'TaskAssignees',
    timestamps: false,
  }
);

export default TaskAssignee; 