# 📦 Inventory & Order Management System

A **production-ready, containerized** full-stack application for managing products, customers, orders, and inventory tracking.

## 🛠 Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| **Frontend**   | React 18, Vite, React Router v6   |
| **Backend**    | Python, FastAPI, SQLAlchemy       |
| **Database**   | PostgreSQL 15                     |
| **Containers** | Docker, Docker Compose            |

---

## 🚀 Quick Start (Docker Compose)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the repository

```bash
git clone https://github.com/Deepali2303/inventory-management-system.git
cd inventory-management-system
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env if needed (defaults work out of the box)
```

### 3. Start all services

```bash
docker-compose up --build
```

### 4. Access the application

| Service      | URL                          |
| ------------ | ---------------------------- |
| **Frontend** | http://localhost:3000         |
| **Backend**  | http://localhost:8000         |
| **API Docs** | http://localhost:8000/docs    |
| **Database** | localhost:5432               |

---

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # Database connection & session
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   └── routers/
│   │       ├── products.py      # Product CRUD endpoints
│   │       ├── customers.py     # Customer CRUD endpoints
│   │       ├── orders.py        # Order management endpoints
│   │       └── dashboard.py     # Dashboard summary endpoint
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # Root component with routes
│   │   ├── index.css            # Global design system
│   │   ├── api/
│   │   │   └── client.js        # API client (fetch wrapper)
│   │   ├── components/
│   │   │   ├── Layout.jsx       # App shell with navbar
│   │   │   ├── Modal.jsx        # Reusable modal dialog
│   │   │   └── Alert.jsx        # Success/error notifications
│   │   └── pages/
│   │       ├── Dashboard.jsx    # Summary dashboard
│   │       ├── Products.jsx     # Product management
│   │       ├── Customers.jsx    # Customer management
│   │       └── Orders.jsx       # Order management
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints

### Products

| Method   | Endpoint           | Description             |
| -------- | ------------------ | ----------------------- |
| `POST`   | `/products`        | Create a new product    |
| `GET`    | `/products`        | List all products       |
| `GET`    | `/products/{id}`   | Get product by ID       |
| `PUT`    | `/products/{id}`   | Update product          |
| `DELETE` | `/products/{id}`   | Delete product          |

### Customers

| Method   | Endpoint             | Description             |
| -------- | -------------------- | ----------------------- |
| `POST`   | `/customers`         | Create a new customer   |
| `GET`    | `/customers`         | List all customers      |
| `GET`    | `/customers/{id}`    | Get customer by ID      |
| `DELETE` | `/customers/{id}`    | Delete customer         |

### Orders

| Method   | Endpoint          | Description             |
| -------- | ----------------- | ----------------------- |
| `POST`   | `/orders`         | Create a new order      |
| `GET`    | `/orders`         | List all orders         |
| `GET`    | `/orders/{id}`    | Get order by ID         |
| `DELETE` | `/orders/{id}`    | Cancel/delete order     |

### Dashboard

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| `GET`  | `/dashboard/summary` | Dashboard summary stats  |

---

## ⚙️ Business Logic

- **Unique SKU** — Product SKU/code must be unique
- **Unique Email** — Customer email must be unique
- **Non-negative Stock** — Product quantity cannot be negative
- **Inventory Check** — Orders cannot be placed if inventory is insufficient
- **Auto-deduct Stock** — Creating an order automatically reduces available stock
- **Auto-calculate Total** — Order total is calculated automatically by the backend
- **Stock Restoration** — Deleting an order restores the deducted stock
- **Validation** — All request data is validated before processing

---

## 🌍 Environment Variables

| Variable               | Default                                            | Description                     |
| ---------------------- | -------------------------------------------------- | ------------------------------- |
| `POSTGRES_USER`        | `postgres`                                         | PostgreSQL username             |
| `POSTGRES_PASSWORD`    | `postgres`                                         | PostgreSQL password             |
| `POSTGRES_DB`          | `inventory`                                        | PostgreSQL database name        |
| `DATABASE_URL`         | `postgresql://postgres:postgres@db:5432/inventory` | Full database connection string |
| `CORS_ORIGINS`         | `http://localhost:3000,http://localhost:5173`       | Allowed CORS origins            |
| `LOW_STOCK_THRESHOLD`  | `10`                                               | Low stock warning threshold     |
| `VITE_API_URL`         | `http://localhost:8000`                            | Backend API URL for frontend    |

---

## 🐳 Docker Details

- **Backend**: `python:3.12-slim` — production-ready with only necessary system deps
- **Frontend**: Multi-stage build using `node:18-alpine` → `nginx:alpine`
- **Database**: `postgres:15-alpine` with named volume for data persistence
- **No hardcoded credentials** — all configurable via environment variables

---

## 🚀 Deployment

### Backend (Render / Railway / Fly.io)

1. Push the `backend/` directory to a separate repo or use mono-repo support
2. Set `DATABASE_URL` and `CORS_ORIGINS` environment variables
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend (Vercel / Netlify)

1. Connect the `frontend/` directory
2. Set `VITE_API_URL` to the deployed backend URL
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 📝 License

This project was built as a technical assessment for the Software Engineer role.