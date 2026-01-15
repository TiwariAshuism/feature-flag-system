# Feature Flag & Dynamic Configuration System

A robust, enterprise-grade system for managing feature toggles and dynamic runtime configurations. Built for performance, scalability, and real-time synchronization.

## 🚀 Features

- **Real-time Synchronization (SSE)**: Instant "push" updates to all connected clients via Server-Sent Events.
- **GraphQL API**: Flexible and efficient data retrieval with an interactive **GraphiQL** playground.
- **gRPC Service**: High-performance binary communication on port **9090** for low-latency inter-service lookups.
- **Asynchronous Processing**: Non-blocking audit logging and notifications offloaded to a custom thread pool.
- **Server-Side Pagination**: Standard `Pageable` support for Flags, Configs, and Audit Logs to handle large datasets.
- **Dynamic Configurations**: Manage non-boolean settings (Strings, Numbers, JSON) with instant Redis-backed lookups.
- **High Performance Caching**: Redis integration with automated cache invalidation on any change.
- **Database Optimizations**: Strategic indexing for $O(\log n)$ lookup speeds.
- **Comprehensive Audit Trail**: Track every change with user metadata and IP tracking.
- **Modern Dark UI**: Responsive dashboard built with Next.js 14 and Tailwind CSS.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, SWR, Lucide Icons.
- **Backend**: Spring Boot 3.2, Spring GraphQL, gRPC (io.grpc), Java 17, Hibernate, Flyway.
- **Data Layers**: PostgreSQL (Persistence), Redis (Caching), Jedis.
- **DevOps**: Docker & Docker Compose.

## 🏁 Getting Started

### Prerequisites
- Docker & Docker Compose installed.

### Quick Start
```bash
docker-compose up -d --build
```

Access Points:
- **Admin Dashboard**: [http://localhost:3000](http://localhost:3000)
- **GraphQL Playground (GraphiQL)**: [http://localhost:8080/graphiql](http://localhost:8080/graphiql)
- **gRPC Server**: `localhost:9090`
- **REST Backend**: [http://localhost:8080/api](http://localhost:8080/api)
- **Real-time Event Stream**: `GET http://localhost:8080/api/stream/events`

## 📖 API Documentation & Testing

### 🕸 GraphQL Samples
Query all flags:
```graphql
query {
  flags(page: 0, size: 10) {
    content {
      key
      enabled
    }
  }
}
```

### 📡 Real-time SSE
Test the update stream in your terminal:
```bash
curl -N -H "Accept: text/event-stream" http://localhost:8080/api/stream/events
```

### 🏎️ gRPC High-Performance
The gRPC server supports reflection. You can use `grpcurl` to test:
```bash
# List services
grpcurl -plaintext localhost:9090 list

# Get a flag by key
grpcurl -plaintext -d '{"key": "YOUR_FLAG_KEY"}' localhost:9090 com.devtool.featureflag.grpc.FeatureFlagService/GetFlag
```

### 🧪 Utility Scripts
Populate the system with complex testing data:
```bash
./seed_configs.sh
```

## 🏗 Project Structure

- `frontend/`: Next.js admin dashboard.
- `backend/`: Spring Boot high-performance service.
- `seed_configs.sh`: Automated configuration seeder.
- `feature-flag-system.postman_collection.json`: Postman collection for REST APIs.
- `backend_api_curls.md`: Quick reference for terminal testing.

## 📜 License
MIT License - Open for modification and use.
