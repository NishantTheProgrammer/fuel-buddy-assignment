import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import sequelize from './config/database';
import { syncDatabase } from './models';

const app = express();
const PORT = process.env.PORT || 3001;

// Apply CORS first, before any other middleware
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Basic route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Task Management API');
// });

// Mount routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return syncDatabase();
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});