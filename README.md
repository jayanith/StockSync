# 🏛️ Enterprise Luxury Inventory & Supply Chain Governance System

A full-stack enterprise inventory management platform engineered with **Java 17 Spring Boot**, **MySQL**, **Spring Security (JWT)**, and **React 18 (Vite + Tailwind CSS)** styled with a classic, human-crafted **Old Money aesthetic**.

---

## 🌟 Key Architecture & Capabilities

- **Monorepo Structure**: Contains both the full **Spring Boot Backend** (`backend/`) and **React Frontend** (`src/`) in a unified repository.
- **Stateless JWT Security**: HMAC-SHA256 encrypted authentication tokens for secure API communication.
- **Direct MySQL Persistence**: Real-time CRUD synchronization with MySQL database; browser `localStorage` mock data is completely eliminated.
- **Strict Role-Based Access Control (RBAC)**: Fine-grained permission model tailored for corporate governance.
- **Old Money Luxury Design**: Heritage palette featuring deep charcoal ebony (`#0d110f`), champagne gold & antique brass (`#c5a059`), solid 1px borders, and warm ivory typography (`#f4f1ea`).

---

## 👥 Roles & Permission Matrix

The system features **4 distinct operational roles** (the generic "Customer" role has been removed in favor of enterprise supply chain roles):

| Role | Primary Responsibilities | Permitted Modules & Actions | Hidden / Restricted Modules |
| :--- | :--- | :--- | :--- |
| **👑 1. Admin** | Corporate governance, system supervision, audit inspection, and user account provisioning. | **Full System Access**: Catalog, Categories, Stock Control, Vault Warehouses, Inter-Vault Transfers, Client Orders, Suppliers Guild, Purchase Orders, Deliveries, User Accounts Management, Financial Reports & Audits, Global Settings. | *None* |
| **💼 2. Manager** | Catalog curation, purchasing negotiations, order fulfillment approvals, and supplier management. | **Commercial & Inventory Operations**: Products Catalog (Create/Edit/Delete), Categories Management, Stock Control Audit, Vault Warehouses Overview, Client Orders Ledger, Suppliers Directory, Purchase Orders Creation/Approval, Deliveries, Reports & Analytics. | User Accounts Administration |
| **📦 3. Warehouse Staff** | Physical vault operations, inventory receiving, inter-facility relocation, and freight tracking. | **Logistics & Stock Control**: Real-Time Stock Control, Vault Warehouses & Capacities, Inter-Vault Transfers, Inbound/Outbound Freight Deliveries. | Client Orders, Suppliers Directory, Purchase Orders, User Accounts Management, Financial Reports |
| **🤝 4. Supplier** | Vendor guild partner access to fulfill purchase orders and track outgoing consignments. | **Vendor Portal**: View Products Catalog Portfolio, View Assigned Purchase Orders, Track Scheduled Deliveries & Consignments. | Internal Vault Warehouses, Stock Transfers, Client Orders, User Management, Reports |

---

## 🔑 Pre-Seeded Default Enterprise Accounts

| Role | Email / Login ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Full administrative control |
| **Manager** | `manager@example.com` | `manager123` | Catalog & Procurement management |
| **Warehouse Staff** | `staff@example.com` | `staff123` | Vault storage & stock transfers |
| **Supplier** | `supplier@example.com` | `supplier123` | Purchase order receipt & dispatch |

---

## 📁 Repository Structure

```tree
├── backend/                             # Java Spring Boot Backend
│   ├── pom.xml                          # Maven configuration (Java 17, Spring Boot 3.2.5, MySQL, JWT, JPA)
│   └── src/main/java/com/inventory/
│       ├── config/                      # SecurityConfig, JwtUtil, DataInitializer
│       ├── controller/                  # REST API Controllers (Products, Orders, Suppliers, Warehouses, etc.)
│       ├── dto/                         # Request & Response DTOs
│       ├── model/                       # JPA Entities (Product, Order, Supplier, Warehouse, Delivery, etc.)
│       ├── repository/                  # Spring Data Repositories
│       ├── security/                    # JwtAuthenticationFilter, CustomUserDetailsService
│       └── service/                     # Business Logic Services
├── src/                                 # React Frontend
│   ├── components/                      # Layout, Header, Sidebar, Radix UI components
│   ├── context/                         # AuthContext (JWT session management)
│   ├── lib/                             # api.js (Centralized Axios/Fetch with JWT interceptor)
│   └── pages/                           # Pages (Dashboard, Products, Orders, Warehouses, Suppliers, etc.)
├── package.json                         # Node dependencies & Vite config
├── tailwind.config.js                   # Tailwind CSS configuration
└── README.md                            # Complete System Documentation
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Java 17+** & **Maven**
- **Node.js 18+** & **npm**
- **MySQL Server 8+** running on port `3306`

### 1. Database Setup
Execute in your MySQL client:
```sql
CREATE DATABASE inventory_db;
```

### 2. Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:5000/api` (automatically seeds sample inventory & accounts).*

### 3. Run Frontend (React + Vite)
```bash
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🛡️ License & Authorship
Crafted with precision for enterprise inventory control.
