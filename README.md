# Feature Flag & Dynamic Configuration System

A robust, full-stack system for managing feature toggles and dynamic runtime configurations across multiple environments. Built with high-performance caching and an intuitive admin dashboard.

## 🚀 Features

- **Real-time Feature Toggles**: Instant flag updates with zero-latency lookups.
- **Dynamic Configurations**: Manage non-boolean settings (Strings, Numbers, JSON) without redeploying.
- **High Performance**: Redis-backed caching ensures your client applications stay fast.
- **Audit Logging**: Full traceability of who changed what and when, including IP tracking.
- **Modern UI**: Dark-themed, responsive dashboard built with Next.js 14, Tailwind CSS, and Lucide icons.
- **Dockerized**: Easy one-command setup for development and production.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, SWR, Axios, Lucide React.
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate.
- **Database**: PostgreSQL (Persistence), Redis (Caching).
- **Infrastructure**: Docker & Docker Compose.

## 🏁 Getting Started

### Prerequisites

- Docker & Docker Compose installed on your machine.

### Installation

1. Clone the repository (if applicable) or enter the project directory.
2. Build and start the services:

```bash
docker-compose up -d --build
```

The system will be accessible at:
- **Admin Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Database (Postgres)**: `localhost:5432`
- **Cache (Redis)**: `localhost:6379`

## 📖 API Documentation

A comprehensive Postman collection is available at:
`feature-flag-system.postman_collection.json`

For quick terminal testing, refer to:
`backend_api_curls.md`

### Sample Config Creation (JSON)
```bash
curl -X POST http://localhost:8080/api/configs \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Payment Settings",
           "key": "PAYMENT_CONFIG",
           "configType": "JSON",
           "value": { "stripe": true, "paypal": false }
         }'
```

## 🏗 Project Structure

- `frontend/`: Next.js 14 application.
- `backend/`: Spring Boot service.
- `docker-compose.yml`: Multi-container orchestration.
- `seed_configs.sh`: Utility script to populate test data.

## 🧪 Seeding Test Data

To populate the system with complex example configurations:
```bash
chmod +x seed_configs.sh
./seed_configs.sh
```

## 📜 License

MIT License - feel free to use and modify!
