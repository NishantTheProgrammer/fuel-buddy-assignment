import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, '../../ca.pem')).toString(),
      rejectUnauthorized: true
    }
  }
});

// sequelize.sync({ force: true });

export default sequelize; 