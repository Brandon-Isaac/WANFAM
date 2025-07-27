# WANFAM Backend - PostgreSQL Setup

This is the backend API for the WANFAM application built with Express.js, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Setup

1. **Install PostgreSQL** if you haven't already:
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`

2. **Start PostgreSQL service**:
   - Windows: PostgreSQL should start automatically after installation
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`

3. **Create a database**:
   ```sql
   -- Connect to PostgreSQL as superuser
   psql -U postgres

   -- Create database
   CREATE DATABASE wanfam_db;

   -- Create user (optional)
   CREATE USER wanfam_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE wanfam_db TO wanfam_user;
   ```

## Installation

1. **Clone and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   Update the `.env` file with your PostgreSQL connection details:
   ```env
   PORT=3000
   NODE_ENV=development

   # PostgreSQL Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=wanfam_db
   ```

3. **Test Database Connection**:
   ```bash
   npm run test:db
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- **GET** `/health` - Check API and database status

### Users
- **GET** `/api/users` - Get all users (with pagination)
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Example API Usage

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Database connection pool
│   ├── controllers/
│   │   └── userController.ts  # User CRUD operations
│   ├── database/
│   │   └── init.sql           # Initial database schema
│   ├── middleware/
│   │   └── asyncHandler.ts    # Async error handler
│   ├── models/
│   │   └── User.ts            # User model with database methods
│   ├── routes/
│   │   └── userRoutes.ts      # User API routes
│   ├── utils/
│   │   ├── database.ts        # Database utility functions
│   │   └── migrations.ts      # Migration runner
│   ├── server.ts              # Main server file
│   └── test-db.ts             # Database connection test
├── .env                       # Environment variables
└── package.json
```

## Database Schema

The application automatically creates the following tables:

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test:db` - Test database connection and setup
- `npm run migrate` - Run database migrations

## Security Notes

⚠️ **Important**: This setup is for development purposes. For production:

1. Use proper password hashing (bcrypt)
2. Implement JWT authentication
3. Add input validation and sanitization
4. Use environment variables for all sensitive data
5. Implement rate limiting
6. Add HTTPS/SSL
7. Use connection pooling limits
8. Add proper error logging

## Troubleshooting

1. **Connection refused error**: Make sure PostgreSQL is running
2. **Authentication failed**: Check your username/password in `.env`
3. **Database does not exist**: Create the database manually first
4. **Port already in use**: Change the PORT in `.env` file

## Next Steps

1. Add authentication middleware
2. Implement password hashing
3. Add input validation with Joi or Yup
4. Add API documentation with Swagger
5. Implement logging with Winston
6. Add unit and integration tests
