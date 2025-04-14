// Load env variables
require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req: any, res: any) => {
  res.send('Hello, World! 🎉');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
