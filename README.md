# EvoCare – AI-Powered Elderly Healthcare Management Platform

> **"AI assists. Doctors decide."**

A full-stack healthcare management platform enabling **Doctors**, **Caregivers**, **Patients**, and **Administrators** to collaborate efficiently — powered by Google Gemini AI for intelligent health insights.

---

## 📁 Project Structure

```
advance java/
├── backend/                    # Spring Boot 3 + Java 21
│   ├── src/main/java/com/evocare/
│   │   ├── config/             # Security, JWT, CORS configs
│   │   ├── controller/         # REST API Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── exception/          # Global Exception Handling
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── security/           # JWT Filters & Auth
│   │   └── service/            # Business Logic Services
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── api/                # Axios API calls
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth & Global Context
│   │   ├── pages/              # Page components
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helper utilities
│   └── vite.config.ts
├── postman/                    # Postman Collection
│   └── EvoCare_API.postman_collection.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6, Axios |
| Backend | Spring Boot 3, Java 21, Spring Security, JWT |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Auth | JWT (Access + Refresh Tokens), BCrypt |
| ORM | Spring Data JPA / Hibernate |

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+

---

### 🗄️ Database Setup

```sql
CREATE DATABASE evocare_db;
CREATE USER evocare_user WITH PASSWORD 'evocare_pass';
GRANT ALL PRIVILEGES ON DATABASE evocare_db TO evocare_user;
```

---

### ⚙️ Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Configure `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/evocare_db
spring.datasource.username=evocare_user
spring.datasource.password=evocare_pass
app.jwt.secret=YOUR_JWT_SECRET_KEY
app.gemini.api-key=YOUR_GEMINI_API_KEY
```

3. Run the application:
```bash
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

---

### 🎨 Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start dev server:
```bash
npm run dev
```

Frontend starts at: `http://localhost:5173`

---

## 👥 Default Users (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@evocare.com | Admin@123 |
| Doctor | doctor@evocare.com | Doctor@123 |
| Caregiver | caregiver@evocare.com | Care@123 |
| Patient | patient@evocare.com | Patient@123 |

---

## 🔌 API Endpoints

| Prefix | Description |
|--------|-------------|
| `POST /api/auth/**` | Authentication (login, register, refresh) |
| `GET/POST /api/users/**` | User management (Admin) |
| `GET/POST /api/patients/**` | Patient records |
| `GET/POST /api/observations/**` | Caregiver observations |
| `GET/POST /api/medications/**` | Medication management |
| `GET/POST /api/reports/**` | Medical reports |
| `GET/POST /api/clinical-notes/**` | Doctor clinical notes |
| `POST /api/ai-insights/**` | Gemini AI health insights |
| `GET /api/audit-logs/**` | System audit logs |

---

## 🤖 AI Integration

The platform uses **Google Gemini API** to:
- Analyze patient observations and clinical notes
- Generate health summaries and risk indicators
- Recommend follow-up questions for healthcare providers

> ⚠️ **Disclaimer**: AI-generated insights are for informational purposes only and should not replace professional medical advice.

---

## 🔒 Security

- JWT-based authentication with access + refresh tokens
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configured for frontend origin
- All sensitive endpoints protected

---

## 📋 Roles & Access

| Feature | Admin | Doctor | Caregiver | Patient |
|---------|-------|--------|-----------|---------|
| User Management | ✅ | ❌ | ❌ | ❌ |
| Patient Records | ✅ | ✅ | ✅ | 👁️ |
| Add Observations | ❌ | ❌ | ✅ | ❌ |
| Clinical Notes | ❌ | ✅ | ❌ | 👁️ |
| AI Insights | ❌ | ✅ | ❌ | 👁️ |
| View Own Records | ❌ | ❌ | ❌ | ✅ |
| Audit Logs | ✅ | ❌ | ❌ | ❌ |

---

## 📦 Postman Collection

Import `postman/EvoCare_API.postman_collection.json` in Postman to test all APIs.

---

## 🏆 Built For

- College Hackathon
- Final Year Project Demonstration
- Healthcare Innovation Showcase

---

*Built with ❤️ using Spring Boot, React, and Google Gemini AI*
