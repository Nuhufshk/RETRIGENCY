# RETRIGENCY

Retrigency is a full-stack hospital management system designed to track patients, manage admissions, and provide a comprehensive dashboard for medical staff.

## Technology Stack

The application is built using the following technologies:
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Database**: PostgreSQL

## Quick Start with Docker

The easiest way to set up and run the entire application is using Docker. This will automatically set up the database, backend, and frontend without requiring you to install Node.js or PostgreSQL locally.

### Prerequisites

You need to have Docker and Docker Compose installed on your system.

- **Windows / Mac**: Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/). Docker Compose is included.
- **Linux**: Follow the instructions for your distribution to install [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

### Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd retrigency
   ```

2. **Start the application**:
   Run the following command in the root directory (where `docker-compose.yml` is located):
   ```bash
   docker-compose up --build
   ```
   *Note: If you want to run it in the background, add the `-d` flag: `docker-compose up -d --build`.*

3. **Access the application**:
   Once all services have started successfully, you can access the app in your browser:
   - **Frontend**: `http://localhost:8080` (Start here, e.g., view `dashboard.html`)
   - **Backend API**: `http://localhost:3002`

### Stopping the App

To stop the running application, press `Ctrl+C` in the terminal where it's running, or if running in the background (`-d`), use:
```bash
docker-compose down
```

## Environment Variables

The application relies on environment variables, which are pre-configured in the `docker-compose.yml` file for immediate local use.

If you are setting this up manually or deploying to production, ensure these are securely set in your environment:

- `DATABASE_URL`: Connection string for Prisma to connect to the PostgreSQL database.
  *Example used in Docker*: `postgresql://retrigency_user:retrigency_password@db:5432/retrigency_db?schema=public`
- `JWT_SECRET`: Secret key used for signing JSON Web Tokens for authentication. Ensure this is a strong, random string in production.

## Troubleshooting

- **Database Connection Issues**: The backend container may try to start before the database is fully ready to accept connections. The `docker-compose.yml` is configured to handle Prisma migrations automatically on startup, but occasionally you might need to restart the backend container if it fails on the first try (`docker-compose restart backend`).
- **Port Conflicts**: Ensure ports `8080` (Frontend), `3002` (Backend), and `5432` (PostgreSQL) are not currently in use by other applications on your system.


## Developed By 3rd Years of Group 41 of Web Development Capstone Project for the 2025/26 Academic Year
### Members and Their Roles with index numbers:

Akorli Josiah Mawulorm: Project Manager(8989123)
Biney kwame Akyea:Figma Designer(9009323)
Konde Dennis Dawuni:Authentication and Database Engineer 1(9023223)
Obeng Kelvin Ofosu:Authentication and Database Engineer 2(9031823)
Oppong-Gyabaa Genevieve:Frontend Developer 1(9035723)
Yeboah Michael Kweku:Frontend Developer 2(9048123)
Nuhu Haruna:Backend Developer 1(9030323)
Hwedie Nana Kweku Osei:Backend Developer 2(9021823)
Anaba Kelvin Ayinedenaba:Backend Developer 3(8995023)
Eshun Sandra:Backend Developer 4(9018123)