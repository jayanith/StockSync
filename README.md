# StockSync

StockSync is a full-stack inventory and supply-chain management application for managing products, categories, suppliers, warehouses, orders, purchase orders, deliveries, users, and operational reports.

It is designed to demonstrate a modern React dashboard backed by a Java Spring Boot REST API. The repository also includes a browser-only demo mode, so the interface can be deployed for interviews without a paid database.

## Highlights

- Role-aware dashboard for Admin, Manager, Warehouse Staff, Supplier, and Customer users
- Product catalog, categories, suppliers, warehouses, stock transfers, orders, purchasing, and deliveries
- React 18, Vite, Tailwind CSS, Radix UI, Lucide icons, and Framer Motion
- Spring Boot 3.2, Spring Data JPA, MySQL, Spring Security, and JJWT
- Stateless JWT authentication for the full-stack deployment
- BCrypt password hashing on the Java backend
- CORS configuration through environment variables
- Dockerfiles for frontend and backend deployment
- Browser-only demo persistence through `localStorage`

## Architecture

```text
                    Full-stack deployment

 React + Vite  --->  Spring Boot REST API  --->  MySQL
      |                    |
      |                    +--> Spring Security JWT filter
      +--> localStorage demo mode (no backend or database required)
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
│   │   ├── lib/api.js        # API and browser demo data layer
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── render.yaml               # Free browser-demo deployment
└── README.md
```

## Quick Interview Demo

The fastest deployment is frontend-only. It requires no MySQL, backend service, or payment method.

### Local

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173` and use one of these demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `admin123` |
| Manager | `manager@example.com` | `manager123` |
| Warehouse Staff | `staff@example.com` | `staff123` |
| Customer | `customer@example.com` | `customer123` |

Demo mode is enabled when `VITE_API_URL` is absent, or when it is set to `demo` or `browser`. Records are saved in the current browser only.

### Vercel

Create a Vercel project from this repository with:

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=demo`

The browser demo is intentionally not a production authentication system. Anyone who can inspect the frontend bundle can see demo credentials, and browser data is not shared between users.

## Full-stack Local Development

### Requirements

- Java 17 or newer
- Maven 3.9 or newer
- Node.js 18 or newer
- MySQL 8 or newer

Create the database:

```sql
CREATE DATABASE inventory_db;
```

Start the backend:

```bash
cd backend
mvn spring-boot:run
```

The API is available at `http://localhost:5000/api`.

Start the frontend in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

For full-stack mode, set `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Configure the backend using environment variables:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/inventory_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=inventory
SPRING_DATASOURCE_PASSWORD=change-me
JWT_SECRET=replace-with-at-least-32-random-characters
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
SEED_ADMIN_PASSWORD=change-me
SEED_MANAGER_PASSWORD=change-me
SEED_STAFF_PASSWORD=change-me
SEED_SUPPLIER_PASSWORD=change-me
```

Never commit real secrets or production passwords. The backend hashes user passwords with BCrypt before storing them.

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

## Deployment Notes

- Use the root `render.yaml` for the free browser demo on Render.
- Deploy the full backend separately only when a reachable MySQL database is available.
- For a full-stack frontend deployment, set `VITE_API_URL` to the public backend URL ending in `/api`.
- Set the backend `APP_CORS_ALLOWED_ORIGINS` to the exact frontend origin.
- Do not commit `.env` files, database credentials, JWT secrets, or production seed passwords.

## License

This project is a portfolio and interview demonstration application.
