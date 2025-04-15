import 'dotenv/config';
import express, { Request, Response } from 'express';


import taskRoutes from './routes/taskRoutes';
import sequelize from './config/database';
import { syncDatabase } from './models';


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Basic route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Task Management API');
// });

// Mount task routes
app.use('/api/tasks', taskRoutes);


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