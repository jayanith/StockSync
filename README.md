# StockSync

StockSync is a full-stack inventory and supply-chain management application for managing products, categories, suppliers, warehouses, orders, purchase orders, deliveries, users, and operational reports.

It is designed to demonstrate a modern React dashboard backed by a Java Spring Boot REST API and MySQL persistence.

## Highlights

- Role-aware dashboard for Admin, Manager, Warehouse Staff, Supplier, and Customer users
- Product catalog, categories, suppliers, warehouses, stock transfers, orders, purchasing, and deliveries
- React 18, Vite, Tailwind CSS, Radix UI, Lucide icons, and Framer Motion
- Spring Boot 3.2, Spring Data JPA, MySQL, Spring Security, and JJWT
- Stateless JWT authentication for the full-stack deployment
- BCrypt password hashing on the Java backend
- CORS configuration through environment variables
- Dockerfiles for frontend and backend deployment

## Architecture

```text
                    Full-stack deployment

 React + Vite  --->  Spring Boot REST API  --->  MySQL
      |                    |
      |                    +--> Spring Security JWT filter
```

The frontend centralizes requests in `frontend/src/lib/api.js`. The backend exposes `/api` endpoints for authentication and business resources.

## Repository Layout

```text
.
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/inventory/
│       │   ├── config/       # JWT, security, CORS, seed data
│       │   ├── controller/   # REST endpoints
│       │   ├── dto/          # Request and response objects
│       │   ├── model/        # JPA entities
│       │   ├── repository/   # Spring Data repositories
│       │   ├── security/     # JWT request filter
│       │   └── service/      # Business logic
│       └── resources/
│           └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/          # AuthContext and session state
│   │   ├── lib/api.js        # Centralized API client with JWT headers
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Local Development

### Requirements

- Java 17 or newer
- Maven 3.9 or newer
- Node.js 18 or newer
- MySQL 8 or newer

### Database

Create the database:

```sql
CREATE DATABASE inventory_db;
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API is available at `http://localhost:5000/api`.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Set `frontend/.env.local` to point to the API:

```env
VITE_API_URL=http://localhost:5000/api
```

## Configuration

The backend requires secrets to be provided through the environment. No passwords or signing keys are stored in source code.

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/inventory_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=inventory
SPRING_DATASOURCE_PASSWORD=<database-password>
JWT_SECRET=<at-least-32-random-characters>
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
SEED_ADMIN_PASSWORD=<admin-password>
SEED_MANAGER_PASSWORD=<manager-password>
SEED_STAFF_PASSWORD=<staff-password>
SEED_SUPPLIER_PASSWORD=<supplier-password>
```

The backend hashes user passwords with BCrypt before storing them. Generate unique values for every environment and store them in the hosting provider's secret manager.

## Authentication and Security

The full-stack backend uses a stateless JWT flow:

1. `POST /api/auth/login` authenticates the email and password.
2. Spring Security compares the supplied password with the BCrypt hash.
3. The server signs a JWT using the configured `JWT_SECRET`.
4. The frontend stores the returned session token and sends it as `Authorization: Bearer <token>`.
5. `JwtAuthenticationFilter` validates the signature and expiration on protected requests.
6. `/api/auth/login` and `/api/auth/register` are public; other API routes require authentication.

JWT expiration is configured by `jwt.expiration` and defaults to 86,400,000 milliseconds, or 24 hours. CORS origins are controlled by `APP_CORS_ALLOWED_ORIGINS`.

For production, use a long randomly generated secret, HTTPS, non-default seed passwords, a managed MySQL database, and a real user-management policy. The browser demo mode should be used only for showcasing the UI.

## API Areas

| Area | Base path |
| --- | --- |
| Authentication | `/api/auth` |
| Products | `/api/products` |
| Categories | `/api/categories` |
| Suppliers | `/api/suppliers` |
| Warehouses | `/api/warehouses` |
| Orders | `/api/orders` |
| Purchase orders | `/api/purchase-orders` |
| Deliveries | `/api/deliveries` |
| Users | `/api/users` |

## Docker Compose

For local full-stack development with MySQL:

```bash
docker compose up --build
```

The Compose setup runs MySQL, the backend, and the Nginx-served frontend together. Its hostname `database` is local to the Compose network and must not be used as the hostname for separately deployed cloud services.

## Testing and Builds

Frontend production build:

```bash
cd frontend
npm run build
```

Backend tests:

```bash
cd backend
mvn clean test
```

## Deployment

Deploy the frontend and backend as separate services, with MySQL provided by a managed database service.

For Vercel, configure:

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- `VITE_API_URL`: the public backend URL ending in `/api`

For the backend, deploy `backend/Dockerfile`, expose the platform-provided `PORT`, and configure all database, JWT, seed-password, and CORS variables in the platform secret manager. Set `APP_CORS_ALLOWED_ORIGINS` to the exact frontend origin.

Do not commit `.env` files, database credentials, JWT secrets, or account passwords.

## License

This project is a portfolio and interview demonstration application.
