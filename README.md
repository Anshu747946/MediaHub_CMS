# MediaHub CMS

MediaHub CMS is a full-stack content management system designed for media teams to manage content creation, review, approval, distribution, and analytics through a unified platform.

The application includes role-based access for creators, editors, managers, and marketing users, with secure authentication, workflow-driven approvals, and dashboard monitoring for content operations.

## Features

- User authentication and authorization with JWT
- Role-based dashboards for different users
- Content creation, editing, review, and approval workflows
- Content distribution and marketing coordination
- Metrics and analytics views for operational visibility
- Spring Boot backend with REST APIs
- Angular frontend with a modern responsive UI

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT authentication
- Maven

### Frontend
- Angular
- TypeScript
- SCSS
- Angular Material

### Database
- SQL schema included in `database/schema.sql`

## Project Structure

```text
README.md
backend/
  src/
  target/
database/
  schema.sql
frontend/
  src/
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Java JDK 17+
- Maven
- Node.js and npm
- Angular CLI
- A SQL database compatible with the backend configuration

## Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Configure your database connection in the backend application properties file.

3. Run the Spring Boot app:

   ```bash
   mvn spring-boot:run
   ```

## Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Angular application:

   ```bash
   npm start
   ```

## Usage

The platform is intended for content teams that need to:

- create and manage content assets
- track progress through review stages
- approve and publish content
- monitor distribution and performance metrics

## Notes

This repository is structured as a full-stack application and is suitable for learning, collaboration, and deployment with appropriate environment configuration.

## Repository Status

The project has been pushed to GitHub and is ready for sharing and further development.
