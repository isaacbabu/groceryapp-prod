# Emmanuel Supermarket

A full-stack grocery shopping application built with React, FastAPI, and MongoDB.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Dockerizing the Application](#dockerizing-the-application)
- [Deploying with MongoDB Atlas](#deploying-with-mongodb-atlas)

---

## Development Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd app
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=emmanuel_supermarket
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Run the Backend Server
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The backend API will be available at `http://localhost:8001`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
yarn install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### Run the Frontend Development Server
```bash
cd frontend
yarn start
```

The frontend will be available at `http://localhost:3000`

### 4. Seed Sample Data
Once both servers are running, seed the database with sample items:
```bash
curl -X POST http://localhost:8001/api/seed-items
```

---

## Dockerizing the Application

### Project Structure for Docker
```
app/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

### 1. Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
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

### 2. Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build argument for backend URL
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Frontend Nginx Configuration
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

    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4. Docker Compose Configuration
Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'

services:
  # MongoDB Service (for local development)
  mongodb:
    image: mongo:7.0
    container_name: emmanuel_mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: emmanuel_backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=emmanuel_supermarket
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    depends_on:
      - mongodb
    networks:
      - app-network
    restart: unless-stopped

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_BACKEND_URL=http://localhost:8001
    container_name: emmanuel_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### 5. Build and Run with Docker Compose

#### Build the containers:
```bash
docker-compose build
```

#### Start all services:
```bash
docker-compose up -d
```

#### View logs:
```bash
docker-compose logs -f
```

#### Stop all services:
```bash
docker-compose down
```

#### Stop and remove volumes:
```bash
docker-compose down -v
```

---

## Deploying with MongoDB Atlas

### 1. Create MongoDB Atlas Account and Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in to your account
3. Create a new project (e.g., "Emmanuel Supermarket")
4. Click **"Build a Database"**
5. Choose your cluster tier:
   - **Free Tier (M0)** - Good for development/testing
   - **Dedicated Clusters** - For production workloads
6. Select your cloud provider and region
7. Click **"Create Cluster"**

### 2. Configure Database Access

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose authentication method: **Password**
4. Enter username and password (save these securely)
5. Set user privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 3. Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add specific IP addresses of your servers
5. Click **"Confirm"**

### 4. Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select Driver: **Python** and Version: **3.12 or later**
5. Copy the connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
6. Replace `<username>` and `<password>` with your database user credentials

### 5. Update Docker Compose for MongoDB Atlas

Create `docker-compose.prod.yml` for production:
```yaml
version: '3.8'

services:
  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: emmanuel_backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=${MONGO_ATLAS_URL}
      - DB_NAME=emmanuel_supermarket
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    networks:
      - app-network
    restart: unless-stopped

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_BACKEND_URL=${BACKEND_PUBLIC_URL}
    container_name: emmanuel_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
```

### 6. Create Production Environment File

Create `.env.prod` in the root directory:
```env
# MongoDB Atlas Connection String
MONGO_ATLAS_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Public URL of your backend (update with your domain)
BACKEND_PUBLIC_URL=https://api.yourdomain.com
```

### 7. Deploy to Production

#### Using Docker Compose:
```bash
# Load production environment variables and start
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

#### Using Docker Swarm:
```bash
# Initialize swarm (if not already done)
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml emmanuel
```

### 8. Seed Production Database

After deployment, seed the database with initial data:
```bash
curl -X POST https://api.yourdomain.com/api/seed-items
```

### 9. Verify Deployment

1. Check backend health:
```bash
curl https://api.yourdomain.com/api/categories
```

2. Access the frontend at your domain

### 10. Production Checklist

- [ ] SSL/TLS certificates configured (use Let's Encrypt or similar)
- [ ] MongoDB Atlas IP whitelist configured for production servers
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] Environment variables secured (not committed to git)
- [ ] Database backups enabled in MongoDB Atlas
- [ ] Monitoring and alerts configured
- [ ] Rate limiting configured for API endpoints
- [ ] CORS settings updated for production domain

---

## Useful Commands

### Docker Commands
```bash
# View running containers
docker ps

# View container logs
docker logs emmanuel_backend -f

# Execute command in container
docker exec -it emmanuel_backend bash

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a
```

### MongoDB Atlas CLI (Optional)
```bash
# Install Atlas CLI
brew install mongodb-atlas-cli

# Login
atlas auth login

# List clusters
atlas clusters list
```

---

## Troubleshooting

### Connection Issues with MongoDB Atlas
1. Verify IP whitelist includes your server's IP
2. Check username/password in connection string
3. Ensure cluster is active (not paused)

### Docker Build Failures
1. Clear Docker cache: `docker builder prune`
2. Rebuild without cache: `docker-compose build --no-cache`

### Frontend Not Loading
1. Check if backend URL is correctly set
2. Verify CORS settings in backend
3. Check browser console for errors

---

## License

MIT License - Feel free to use this project for your own purposes.
