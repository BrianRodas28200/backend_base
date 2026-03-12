# Backend API

A scalable and well-structured Node.js/Express API built with TypeScript, following best practices for maintainability and scalability.

## 🚀 Features

- **TypeScript**: Full type safety and better development experience
- **Express.js**: Fast and minimalist web framework
- **MySQL**: Relational database with connection pooling
- **JWT Authentication**: Secure access and refresh token system
- **Password Hashing**: bcryptjs for secure password storage
- **Zod**: Runtime type validation for API inputs
- **Security**: Helmet, CORS, and other security middleware
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Morgan middleware for request logging
- **Code Quality**: ESLint and Prettier configuration
- **Modular Architecture**: Clean separation of concerns

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── config/                # Configuration files
│   ├── database.ts        # Database connection
│   └── env.ts            # Environment variables
├── controllers/           # Request handlers
│   └── BaseController.ts  # Base controller with common methods
├── middleware/            # Custom middleware
│   ├── auth.ts           # JWT authentication middleware
│   ├── errorHandler.ts    # Error handling middleware
│   └── validation.ts      # Input validation middleware
├── models/               # Data models
│   └── BaseModel.ts      # Base model with CRUD operations
├── modules/              # Feature modules
│   ├── auth/            # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.model.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   └── users/           # User module example
│       ├── user.controller.ts
│       ├── user.model.ts
│       ├── user.routes.ts
│       └── user.service.ts
├── routes/               # API routes
│   └── index.ts         # Main routes file
├── types/               # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   └── index.ts        # Common types
└── utils/               # Utility functions
    ├── database.ts     # Database service
    ├── jwt.ts          # JWT service
    └── password.ts     # Password service
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/BrianRodas28200/backend_base.git
cd backend_base
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Option 1: Using Docker (recommended)
docker-compose up -d mysql

# Option 2: Manual MySQL setup
mysql -u root -p < database-init/init.sql
```

5. Build the project:
```bash
npm run build
```

## � Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Docker Mode
```bash
# Full stack (API + MySQL + PhpMyAdmin)
npm run docker:dev

# API only
npm run docker:build
npm run docker:run

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## �🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=3100

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestionpro
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
`http://localhost:3100/api`

### Health Check
- `GET /` - API status
- `GET /health` - Server health check

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (revoke refresh token)
- `POST /auth/logout-all` - Logout from all devices
- `GET /auth/profile` - Get user profile (requires auth)

### Users Endpoints
- `GET /users` - Get all users (with pagination)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🔐 Authentication

The API uses JWT with access and refresh tokens:

1. **Access Token**: Short-lived (15m) used for API requests
2. **Refresh Token**: Long-lived (7d) used to get new access tokens

### Usage Example

#### Register User
```bash
curl -X POST http://localhost:3100/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john@example.com",
    "password": "password123"
  }'
```

#### Access Protected Route
```bash
curl -X GET http://localhost:3100/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Refresh Token
```bash
curl -X POST http://localhost:3100/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🏗️ Architecture Patterns

### Authentication Flow
1. User registers/logs in → receives access + refresh tokens
2. Access token used in `Authorization: Bearer <token>` header
3. When access token expires, use refresh token to get new pair
4. Refresh tokens are stored in database and can be revoked

### Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Separate access and refresh tokens
- **Token Storage**: Refresh tokens stored in database
- **Middleware**: Authentication middleware for protected routes
- **Validation**: Input validation with Zod schemas

### MVC Pattern
- **Models**: Handle data access and database operations
- **Views**: Not applicable (API-only)
- **Controllers**: Handle HTTP requests and responses

### Service Layer
- Business logic is separated into service classes
- Controllers are thin and focus only on HTTP concerns

### Repository Pattern
- Base model provides common CRUD operations
- Specific models extend the base model

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Secure password storage with bcryptjs
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Sanitized error responses

## 🧪 Testing

The project includes a complete testing setup with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- `tests/` - Test files directory
- `tests/setup.ts` - Test configuration
- `tests/auth.test.ts` - Authentication tests
- Jest configured with TypeScript support
- Coverage reporting enabled

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:dev` - Start full stack with Docker Compose
- `npm run docker:logs` - View Docker logs
- `npm run docker:down` - Stop Docker services

## 📄 License

This project is licensed under the ISC License.

## � Guía para Desarrolladores

¿Eres nuevo en el proyecto? 🎉 Revisa **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** para una guía completa sobre:

- 🏗️ **Estructura del proyecto** y dónde agregar tu código
- 🔧 **Convenciones** de nomenclatura y estilos
- 📝 **Ejemplos completos** para nuevos módulos
- 🔐 **Procedimientos almacenados** - cómo integrarlos
- 🎯 **Buenas prácticas** y patrones de arquitectura
- 🚀 **Comandos útiles** para desarrollo y testing

### 🚀 **Inicio Rápido**:

1. **Clonar y configurar**:
```bash
git clone https://github.com/BrianRodas28200/backend_base.git
cd backend_base
cp .env.example .env  # Edita con tus credenciales
npm install
```

## 🔮 Future Enhancements

- Rate limiting with express-rate-limit
- API documentation with Swagger/OpenAPI
- Performance monitoring and logging
- File upload handling
- Email notifications
- Redis caching layer
- API versioning
