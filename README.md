# StockSync

StockSync is a full-stack inventory and supply-chain management application for managing products, categories, suppliers, warehouses, orders, purchase orders, deliveries, users, and operational reports.

It is designed to demonstrate a modern React dashboard backed by a Java Spring Boot REST API and MySQL persistence.

## Highlights

- Role-aware dashboard for Admin, Manager, Warehouse Staff, and Supplier users
- Product catalog, categories, suppliers, warehouses, stock transfers, orders, purchasing, and deliveries
- React 18, Vite, Tailwind CSS, Radix UI, Lucide icons, and Framer Motion
- Spring Boot 3.2, Spring Data JPA, MySQL, Spring Security, and JJWT
- Stateless JWT authentication for the full-stack deployment
- BCrypt password hashing on the Java backend
- CORS configuration through environment variables
- Dockerfiles for frontend and backend deployment

## Product Scope

StockSync is intended for a multi-location retailer, distributor, or luxury-goods operator that needs one controlled view of stock movement from supplier purchase through warehouse receipt and customer fulfillment.

### Core Business Use Cases

| Workflow | Business outcome |
| --- | --- |
| Catalog governance | Managers maintain a single product, SKU, pricing, category, and supplier record. |
| Procurement | Teams create and approve purchase orders, then track expected receipts. |
| Warehouse operations | Staff verify stock, monitor capacity, and authorize transfers between locations. |
| Order fulfillment | Commercial teams manage customer orders and delivery status from one ledger. |
| Supplier collaboration | External suppliers see assigned procurement and delivery work without internal administration access. |
| Operational reporting | Leaders review valuation, stock movement, supplier performance, and order summaries. |
| Access governance | Administrators provision roles and restrict sensitive workflows with role-based access control. |

### Operating Model

The database is an infrastructure dependency configured once by the deployment owner. Business users do not create databases. Administrators create and manage application users from the User Accounts area; end users authenticate through the login screen and work only within their permitted role scope.

## Roadmap

The current release establishes the core catalog, procurement, warehouse, delivery, reporting, and JWT security foundation. Planned product evolution includes:

- Audit event history for every stock, order, approval, and permission change
- Approval policies with configurable thresholds for purchase orders and stock transfers
- Barcode and QR scanning for receiving, picking, and cycle counts
- Low-stock alerts, replenishment suggestions, and scheduled notifications
- Immutable inventory ledger with reservation and reconciliation workflows
- Supplier and customer self-service portals with scoped tenant data
- File attachments for invoices, delivery notes, and product documentation
- Automated API, integration, security, and end-to-end test coverage in CI
- Observability with structured logs, health checks, metrics, and deployment alerts

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

Create the database once as part of local infrastructure setup:

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

The backend hashes user passwords with BCrypt before storing them. Generate unique values for every environment and store them in the hosting provider's secret manager. The seed variables are deployment bootstrap secrets, not passwords to publish or share in the product documentation.

## Authentication and Security

The full-stack backend uses a stateless JWT flow:

1. `POST /api/auth/login` authenticates the email and password.
2. Spring Security compares the supplied password with the BCrypt hash.
3. The server signs a JWT using the configured `JWT_SECRET`.
4. The frontend stores the returned session token and sends it as `Authorization: Bearer <token>`.
5. `JwtAuthenticationFilter` validates the signature and expiration on protected requests.
6. `/api/auth/login` and `/api/auth/register` are public; other API routes require authentication.

JWT expiration is configured by `jwt.expiration` and defaults to 86,400,000 milliseconds, or 24 hours. CORS origins are controlled by `APP_CORS_ALLOWED_ORIGINS`.

For production, use a long randomly generated secret, HTTPS, a managed MySQL database, and a real user-management policy. Never publish seed credentials or use development values in a deployed environment.

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

This project is a reference implementation of an enterprise inventory and supply-chain platform.
