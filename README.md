# MERN CRM System with DevOps Deployment Pipeline

A full end-to-end Customer Relationship Management (CRM) web app built with the MERN stack and packaged for production-style deployment with Docker Compose, Nginx, MongoDB, Prometheus, Grafana, Loki, and Promtail.

## Features

- JWT authentication with registration, login, and current-user profile endpoints.
- Customer CRUD for leads, prospects, active customers, and inactive accounts.
- Search and status filtering across customer name, company, and email.
- Dashboard metrics for total customers, pipeline value, and prospect counts.
- Responsive React interface for sales and account-management workflows.
- Containerized API, web client, database, reverse proxy, metrics, and logs.

## Tech Stack

- **Frontend**: React, Vite, CSS, Lucide icons
- **Backend**: Node.js, Express, Mongoose, JWT, Helmet, CORS, rate limiting
- **Database**: MongoDB
- **Web Proxy**: Nginx
- **Containers**: Docker, Docker Compose
- **Monitoring**: Prometheus, Grafana
- **Logging**: Loki, Promtail

## Architecture

```text
Browser
  |
  v
Nginx / React SPA  ---- /api/* ----> Express API ----> MongoDB
  |                                      |
  +---------------- Observability -------+
                 Prometheus / Grafana / Loki
```

## Repository Structure

```text
project/
 ├── backend/                 # Express API, Mongo models, auth, CRM routes
 ├── frontend/                # React + Vite CRM interface
 ├── nginx/                   # Nginx SPA and API reverse proxy config
 ├── docker-compose.yml       # CRM app + database + observability services
 ├── prometheus/
 ├── grafana/
 ├── promtail/
 └── docs/
```

## Local Development

### 1) Start MongoDB

```bash
docker compose up -d mongo
```

### 2) Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Seed demo data

```bash
cd backend
npm run seed
```

Demo login:

- Email: `admin@example.com`
- Password: `password123`

### 4) Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Docker Compose Deployment

Run the complete stack:

```bash
docker compose up --build -d
```

Application URLs:

- CRM web app: `http://localhost`
- API health: `http://localhost/api/health`
- MongoDB: `localhost:27017`
- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Loki: `http://localhost:3100`

Seed data in the running API container:

```bash
docker compose exec api npm run seed
```

## Production Configuration

Set these environment variables before deployment:

- `JWT_SECRET`: long random signing secret for API tokens.
- `CLIENT_ORIGIN`: public frontend origin when API CORS needs to be restricted.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/register` | Create a user and return a JWT |
| `POST` | `/api/auth/login` | Authenticate and return a JWT |
| `GET` | `/api/auth/me` | Return current authenticated user |
| `GET` | `/api/customers` | List customers with optional `search` and `status` query params |
| `POST` | `/api/customers` | Create a customer |
| `PUT` | `/api/customers/:id` | Update a customer |
| `DELETE` | `/api/customers/:id` | Delete a customer |
| `GET` | `/api/dashboard/summary` | Return dashboard CRM metrics |

## Suggested Resume Line

> Built and deployed a MERN CRM system with JWT authentication, customer pipeline CRUD, MongoDB persistence, Dockerized services, Nginx reverse proxying, and Prometheus/Grafana/Loki observability.
