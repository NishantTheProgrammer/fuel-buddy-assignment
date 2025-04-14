import 'dotenv/config';
import express, { Request, Response } from 'express';
import taskRouter from './api/Task';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Task Management API');
});

// Mount task routes
app.use('/task', taskRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});