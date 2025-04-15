import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: 'pending' | 'completed';
  public dueDate!: Date;
  public userId?: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'Tasks',
  }
);

export default Task; 