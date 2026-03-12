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

1. Clone the repository
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
mysql -u root -p < database-setup.sql
```

5. Build the project:
```bash
npm run build
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=app_db
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
`http://localhost:3000/api`

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
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Access Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
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

The project is structured to be easily testable. Consider adding:

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (when configured)

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

## �🔮 Future Enhancements

- Role-based access control (RBAC)
- Rate limiting
- API documentation
- Unit and integration tests
- Docker containerization
