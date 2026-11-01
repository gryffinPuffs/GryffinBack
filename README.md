# GryffinBack – Bookstore E-Commerce API

GryffinBack is the backend API for a book e-commerce application. It provides the server-side functionality for user accounts, authentication, book products, shopping carts, and database operations.

The project was developed collaboratively by the GryffinPuffs team using Node.js, Express, and PostgreSQL.

## Technologies

- **Node.js** – JavaScript runtime
- **Express.js** – REST API framework
- **PostgreSQL** – Relational database
- **pg** – PostgreSQL client
- **JWT (JSON Web Tokens)** – User authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment variable management
- **Morgan** – HTTP request logging
- **CORS** – Cross-origin resource sharing

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected user routes
- Administrator privilege management
- PostgreSQL database integration
- Book product and inventory-related API routes
- Shopping cart and cart item functionality
- Address management
- Database initialization and sample data seeding

## Project Structure

```text
GryffinBack/
├── api/
│   ├── address.js
│   ├── cart.js
│   ├── cart_item.js
│   ├── product.js
│   ├── user.js
│   ├── utils.js
│   └── index.js
├── db/
│   ├── client.js
│   ├── users.js
│   ├── products.js
│   ├── cart.js
│   ├── cart_item.js
│   ├── address.js
│   └── seed.js
├── index.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gryffinPuffs/GryffinBack.git
```

2. Navigate into the project:

```bash
cd GryffinBack
```

3. Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/gryffinback
JWT_SECRET=your_secure_random_secret
```

Replace the example database credentials and JWT secret with your own values.

**Important:** Never commit your `.env` file or expose database credentials or JWT secrets.

### Database Setup

1. Create a PostgreSQL database named `gryffinback`.
2. Configure your `.env` file.
3. Initialize and populate the database:

```bash
npm run seed
```

**Note:** The seed script drops and recreates existing tables. Only run it against a database where existing data can safely be deleted.

### Start the Server

Start the application:

```bash
npm start
```

For development:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:8080
```

## API Routes

The API is organized into the following route groups:

| Route | Purpose |
|---|---|
| `/api` | API status |
| `/api/user` | User management and authentication |
| `/api/address` | Address management |
| `/api/product` | Book product operations |
| `/api/cart` | Shopping cart operations |
| `/api/cart_item` | Shopping cart item operations |

### User Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api` | Check API status |
| POST | `/api/user/register` | Register a new user |
| POST | `/api/user/login` | Authenticate a user |
| GET | `/api/user/me` | Retrieve the authenticated user |
| GET | `/api/user/:username` | Retrieve a user by username |
| GET | `/api/user` | Retrieve users (administrator access required) |

Protected endpoints require a valid JWT:

```text
Authorization: Bearer YOUR_TOKEN
```

## Security

The backend includes several security measures:

- Passwords are hashed using bcrypt.
- Authentication uses signed JWT tokens.
- Protected routes verify authentication tokens.
- Public registration cannot assign administrator privileges.
- Unauthorized requests are rejected.
- Environment variables are used for sensitive configuration.

## Team – GryffinPuffs

This project was developed by:

- Jessy Piesco
- Jenniffer Melchiade
- Randy Pellegrin
- Kevin Larson

### Team Collaboration

The team established a collaborative development process focused on:

- Pair programming and shared ownership of project features.
- Daily meetings to review progress and identify blockers.
- Collaborative debugging and problem-solving.
- Code reviews, Git commits, and merge coordination.
- Clear communication about task assignments and progress.
- Constructive conflict resolution and shared decision-making.

## Project Purpose

GryffinBack demonstrates collaborative backend development, REST API architecture, relational database integration, authentication, and server-side application functionality for an e-commerce application.
