# BrandScrap: Website Analysis API

A RESTful API for scraping and managing website metadata, built with Node.js, Express, Prisma, and PostgreSQL.

---

## ✨ Features

- **Analyze Websites:** Scrape brand name and description from any public website.
- **CRUD Operations:** Create, retrieve (with pagination), update, and delete website records.
- **Validation & Error Handling:** Robust input validation and graceful error responses.
- **OpenAPI Documentation:** Interactive API docs with Swagger UI.
- **PostgreSQL Database:** Uses Prisma ORM for type-safe database access.

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Dhirajsharma2060/internship_assignment_nurdd.git
cd internship_assignment_nurdd
```

### 2. Install Dependencies

```sh
npm install
```

### 3.Configure Environment Variables

#### Create a .env file at the project root:

```sh
DATABASE_URL="your_database_connection_string"
```

### 4. Run Database Migrations

```sh
npx prisma migrate deploy
```

### 5. Start the Server

```sh
npm run dev
```

## The API will be running at : https://brandscrap.onrender.com/

## 📚 API Documentation

Interactive API docs are available at:
https://brandscrap.onrender.com/docs

## 🛠️ Example Endpoints

- Analyze a Website

```sh
POST /api/websites/analyze
Content-Type: application/json

{
  "url": "https://example.com"
}
```

- Get All Websites (Paginated)

```sh
GET /api/websites?page=1&limit=10
```

- Get All Websites (Paginated)

```sh
GET /api/websites?page=1&limit=10
```


- Update a Website

```sh
PATCH /api/websites/{id}
Content-Type: application/json

{
  "brandName": "New Brand",
  "description": "Updated description"
}

```

- Delete a Website

```sh
DELETE /api/websites/{id}

```

## 🧩 Project Structure

```
.
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── config/          # Swagger config
│   ├── controllers/     # Route controllers
│   ├── generated/       # Prisma client (auto-generated)
│   ├── models/          # DB client setup
│   ├── routes/          # Express routes
│   ├── services/        # Scraper logic
│   └── index.js         # App entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```


## 📝 Notes

- Pagination: Use page and limit query parameters on GET /api/websites.
- Validation: All endpoints validate input and return clear error messages on server log and generic message to the client side (best practice).
- Scraping: Brand name and description are extracted from meta tags or page content; fallback logic is    used if metadata is missing.
- Database: Uses PostgreSQL with Prisma ORM.

## 🧑‍💻 Author


Dhiraj Sharma






