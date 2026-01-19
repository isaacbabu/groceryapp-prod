# Deployment Guide - Emmanuel Supermarket Grocery App

This comprehensive guide covers deploying the grocery shopping application to production, including database setup, authentication configuration, and hosting options.

---

## Table of Contents

1. [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
2. [Google OAuth Setup](#2-google-oauth-setup)
3. [Backend Deployment on Heroku](#3-backend-deployment-on-heroku)
4. [Frontend Deployment on Heroku](#4-frontend-deployment-on-heroku)
5. [Docker Containerization](#5-docker-containerization)
6. [Environment Variables Reference](#6-environment-variables-reference)

---

## 1. MongoDB Atlas Setup

MongoDB Atlas is a cloud-hosted MongoDB service that provides a free tier suitable for small applications.

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** and create an account
3. Verify your email address

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Select **"M0 FREE"** tier (Shared cluster)
3. Choose your preferred cloud provider (AWS, GCP, or Azure)
4. Select a region closest to your users
5. Name your cluster (e.g., `grocery-app-cluster`)
6. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 3: Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `grocery_app_user`)
5. Generate or create a secure password (save this!)
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production: Add specific IP addresses of your servers
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Choose **Driver: Python** and **Version: 3.6 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@grocery-app-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials
7. Add your database name after `.net/`:
   ```
   mongodb+srv://grocery_app_user:YOUR_PASSWORD@grocery-app-cluster.xxxxx.mongodb.net/grocery_app?retryWrites=true&w=majority
   ```

### Step 6: Update Backend Configuration

Update your backend `.env` file:
```env
MONGO_URL=mongodb+srv://grocery_app_user:YOUR_PASSWORD@grocery-app-cluster.xxxxx.mongodb.net/grocery_app?retryWrites=true&w=majority
DB_NAME=grocery_app
```

---

## 2. Google OAuth Setup

Google OAuth enables secure user authentication without managing passwords.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top-left)
3. Click **"New Project"**
4. Enter project name (e.g., `Grocery App`)
5. Click **"Create"**

### Step 2: Enable APIs

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** and enable it
3. Search for **"Google Identity"** and enable it (if available)

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: Emmanuel Supermarket
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **"Save and Continue"**
6. **Scopes**: Click **"Add or Remove Scopes"**
   - Select: `email`, `profile`, `openid`
   - Click **"Update"**
7. Click **"Save and Continue"**
8. **Test users**: Add your email for testing
9. Click **"Save and Continue"**

### Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Name it (e.g., `Grocery App Web Client`)
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-frontend-domain.herokuapp.com
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   https://your-frontend-domain.herokuapp.com/auth/callback
   http://localhost:8001/api/auth/google/callback
   https://your-backend-domain.herokuapp.com/api/auth/google/callback
   ```
7. Click **"Create"**
8. **Save the Client ID and Client Secret** securely!

### Step 5: Update Application Configuration

**Backend `.env`**:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-domain.herokuapp.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.herokuapp.com
```

**Frontend `.env`**:
```env
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
REACT_APP_BACKEND_URL=https://your-backend-domain.herokuapp.com/api
```

### Step 6: Understanding the OAuth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Google    │────▶│   Backend   │
│             │     │   OAuth     │     │             │
│  1. Login   │     │  2. Auth    │     │ 3. Validate │
│     Click   │     │    Screen   │     │    Token    │
│             │◀────│             │◀────│ 4. Create   │
│  6. Logged  │     │  5. Redirect│     │   Session   │
│     In      │     │   w/ Code   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 3. Backend Deployment on Heroku

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Prepare Backend for Deployment

Create `backend/Procfile`:
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

Create `backend/runtime.txt`:
```
python-3.11.4
```

Ensure `backend/requirements.txt` includes all dependencies:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
motor==3.3.2
pydantic==2.5.2
python-dotenv==1.0.0
httpx==0.25.2
python-multipart==0.0.6
```

### Step 4: Create Heroku App for Backend

```bash
cd backend

# Create Heroku app
heroku create grocery-app-backend

# Set environment variables
heroku config:set MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/grocery_app"
heroku config:set DB_NAME="grocery_app"
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"
heroku config:set GOOGLE_REDIRECT_URI="https://grocery-app-backend.herokuapp.com/api/auth/google/callback"
heroku config:set FRONTEND_URL="https://grocery-app-frontend.herokuapp.com"
heroku config:set CORS_ORIGINS="https://grocery-app-frontend.herokuapp.com"
heroku config:set SESSION_SECRET="your-random-secret-key-min-32-chars"

# Deploy
git init  # If not already a git repo
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Step 5: Verify Backend Deployment

```bash
# Check logs
heroku logs --tail

# Open app
heroku open

# Test API
curl https://grocery-app-backend.herokuapp.com/api/items
```

---

## 4. Frontend Deployment on Heroku

### Step 1: Prepare Frontend for Deployment

Create `frontend/static.json` for static buildpack:
```json
{
  "root": "build/",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  }
}
```

Update `frontend/package.json` to add build script (if not present):
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "heroku-postbuild": "yarn build"
  }
}
```

### Step 2: Create Heroku App for Frontend

```bash
cd frontend

# Create Heroku app
heroku create grocery-app-frontend

# Set buildpacks
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git

# Set environment variables
heroku config:set REACT_APP_BACKEND_URL="https://grocery-app-backend.herokuapp.com/api"
heroku config:set REACT_APP_GOOGLE_CLIENT_ID="your-google-client-id"

# Deploy
git init  # If not already a git repo
git add .
git commit -m "Deploy frontend"
git push heroku main
```

### Step 3: Alternative - Using serve for Frontend

Create `frontend/Procfile`:
```
web: npx serve -s build -l $PORT
```

Update `frontend/package.json`:
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "heroku-postbuild": "yarn build"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

### Step 4: Verify Frontend Deployment

```bash
# Check logs
heroku logs --tail

# Open app
heroku open
```

---

## 5. Docker Containerization

### Step 1: Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

Create `backend/.dockerignore`:
```
__pycache__
*.pyc
*.pyo
.env
.git
.gitignore
venv
.venv
*.md
```

### Step 2: Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
# Frontend Dockerfile - Multi-stage build
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

Create `frontend/.dockerignore`:
```
node_modules
build
.env
.git
.gitignore
*.md
```

### Step 3: Docker Compose Configuration

Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'

services:
  # MongoDB Service
  mongodb:
    image: mongo:6.0
    container_name: grocery-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: adminpassword
      MONGO_INITDB_DATABASE: grocery_app
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - grocery-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: grocery-backend
    restart: unless-stopped
    environment:
      - MONGO_URL=mongodb://admin:adminpassword@mongodb:27017/grocery_app?authSource=admin
      - DB_NAME=grocery_app
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI:-http://localhost:8001/api/auth/google/callback}
      - FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
      - CORS_ORIGINS=${CORS_ORIGINS:-http://localhost:3000}
      - SESSION_SECRET=${SESSION_SECRET:-your-secret-key-change-in-production}
    ports:
      - "8001:8001"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - grocery-network

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-http://localhost:8001/api}
        - REACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
    container_name: grocery-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - grocery-network

volumes:
  mongodb_data:
    driver: local

networks:
  grocery-network:
    driver: bridge
```

### Step 4: MongoDB Initialization Script

Create `mongo-init.js` in the root directory:
```javascript
// MongoDB initialization script
db = db.getSiblingDB('grocery_app');

// Create collections
db.createCollection('users');
db.createCollection('items');
db.createCollection('orders');
db.createCollection('categories');
db.createCollection('carts');
db.createCollection('sessions');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "user_id": 1 }, { unique: true });
db.items.createIndex({ "item_id": 1 }, { unique: true });
db.items.createIndex({ "category": 1 });
db.orders.createIndex({ "order_id": 1 }, { unique: true });
db.orders.createIndex({ "user_id": 1 });
db.sessions.createIndex({ "session_token": 1 }, { unique: true });
db.sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });
db.carts.createIndex({ "user_id": 1 }, { unique: true });

print('Database initialization complete!');
```

### Step 5: Environment File for Docker

Create `.env` in the root directory:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8001/api/auth/google/callback

# Application URLs
FRONTEND_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:8001/api
CORS_ORIGINS=http://localhost:3000

# Security
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters
```

### Step 6: Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend

# Scale services (if needed)
docker-compose up --scale backend=3
```

### Step 7: Production Docker Compose

Create `docker-compose.prod.yml` for production:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: grocery-backend-prod
    restart: always
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
      - FRONTEND_URL=${FRONTEND_URL}
      - CORS_ORIGINS=${CORS_ORIGINS}
      - SESSION_SECRET=${SESSION_SECRET}
    ports:
      - "8001:8001"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
        - REACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
    container_name: grocery-frontend-prod
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

Run production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 6. Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | Database name | `grocery_app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxx` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://api.example.com/api/auth/google/callback` |
| `FRONTEND_URL` | Frontend application URL | `https://example.com` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://example.com` |
| `SESSION_SECRET` | Secret for session encryption | Random 32+ character string |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://api.example.com/api` |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456.apps.googleusercontent.com` |

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
# Check if MongoDB is running
docker-compose logs mongodb

# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/"
```

**2. Google OAuth Redirect Error**
- Verify redirect URIs match exactly in Google Console
- Check HTTPS vs HTTP
- Ensure frontend and backend URLs are correct

**3. CORS Errors**
- Add frontend URL to `CORS_ORIGINS`
- Check for trailing slashes in URLs
- Verify protocol (http vs https)

**4. Heroku Build Fails**
```bash
# Clear build cache
heroku builds:cache:purge -a your-app-name

# Check logs
heroku logs --tail -a your-app-name
```

**5. Docker Container Won't Start**
```bash
# Check container logs
docker logs grocery-backend

# Inspect container
docker inspect grocery-backend

# Enter container shell
docker exec -it grocery-backend /bin/sh
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong `SESSION_SECRET`
- [ ] Restrict MongoDB network access to server IPs only
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set appropriate CORS origins (not `*`)
- [ ] Enable rate limiting on API
- [ ] Regular security updates for dependencies

---

## Quick Reference Commands

```bash
# Local Development
docker-compose up --build

# Deploy to Heroku
git push heroku main

# View Heroku logs
heroku logs --tail

# MongoDB Atlas Connection Test
mongosh "your-connection-string"

# Docker cleanup
docker system prune -a
```

---

**Created for Emmanuel Supermarket Grocery App**  
*Last Updated: January 2025*
