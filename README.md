# Fuel Buddy

A task management application with user assignment capabilities.


## Getting Started

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed on your system

2. Start the entire application stack:
   ```
   docker-compose up
   ```

3. Access the application at http://localhost:3000

4. To stop the services:
   ```
   docker-compose down
   ```

## Project Structure

- **Frontend**: Vue.js application in `fuel-buddy-project/`
- **Backend**: Node.js with Express and Sequelize in `fuel-buddy-backend/`

## Database Schema

The application uses a relational database with the following structure:

- **Users**: Store user information
- **Tasks**: Store task details with creator reference
- **TaskAssignees**: Junction table for task-user assignments


## Features

- User management
- Task creation and assignment
- Task status tracking
- Multiple assignees per task

## Technologies

- **Frontend**: Vue.js, CSS
- **Backend**: Node.js, Express, Sequelize
- **Database**: SQL (via Sequelize ORM)
- **Deployment**: Docker, Docker Compose
