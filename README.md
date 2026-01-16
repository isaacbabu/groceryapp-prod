Now I'll create a comprehensive README file for your grocery app with detailed setup, testing, and deployment instructions.
Action: file_editor str_replace /app/README.md --old-str "# Grocery Shopping App

A full-stack grocery shopping application built with React, FastAPI, and MongoDB. Features include product browsing, category filtering, cart management with persistence, and user authentication.

## 🍴 How to Fork This Repository

### Using GitHub Web Interface

1. **Navigate to the Repository**
   - Go to the original repository on GitHub

2. **Click the Fork Button**
   - Click the \"Fork\" button in the top-right corner of the repository page
   - Select your GitHub account as the destination

3. **Clone Your Forked Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
   cd REPO_NAME
   ```

4. **Add Upstream Remote (Optional but Recommended)**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git
   ```
   This allows you to sync your fork with the original repository:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

---

## 🛠️ Development Environment Setup

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18+ recommended)
- **Yarn** package manager (v1.22+)
- **Python** (v3.10+)
- **MongoDB** (local instance or MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

### Step 2: Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   
   - **Linux/macOS:**
     ```bash
     source venv/bin/activate
     ```
   - **Windows:**
     ```bash
     .\venv\Scripts\activate
     ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   touch .env
   ```
   
   Add the following environment variables:
   ```env
   MONGO_URL=mongodb://localhost:27017/grocery_app
   JWT_SECRET=your_super_secret_jwt_key_here
   ```
   
   > **Note:** Replace `mongodb://localhost:27017/grocery_app` with your MongoDB connection string if using MongoDB Atlas or a different configuration.

### Step 3: Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```bash
   touch .env
   ```
   
   Add the following environment variables:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

---

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Start the Backend Server

1. Navigate to the backend directory and activate virtual environment:
   ```bash
   cd backend
   source venv/bin/activate  # Linux/macOS
   # or
   .\venv\Scripts\activate   # Windows
   ```

2. Start the FastAPI server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```
   
   The backend will be running at `http://localhost:8001`

#### Start the Frontend Development Server

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   yarn start
   ```
   
   The frontend will be running at `http://localhost:3000`

### Option 2: Using Docker (if available)

```bash
docker-compose up --build
```

---

## 🧪 Testing the Application

### Seed Sample Data

Before testing, seed the database with sample grocery items:

```bash
# Using curl
curl -X POST http://localhost:8001/api/seed-items

# Or using httpie
http POST http://localhost:8001/api/seed-items
```

This will populate the database with 22 sample items across 6 categories:
- Vegetables
- Fruits
- Dairy
- Beverages
- Snacks
- Essentials

### API Endpoints Testing

#### Test Items Endpoint
```bash
# Get all items
curl http://localhost:8001/api/items

# Get categories
curl http://localhost:8001/api/categories
```

#### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:8001/api/auth/register \
  -H \"Content-Type: application/json\" \
  -d '{\"email\": \"test@example.com\", \"password\": \"password123\", \"full_name\": \"Test User\"}'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H \"Content-Type: application/json\" \
  -d '{\"email\": \"test@example.com\", \"password\": \"password123\"}'
```

#### Test Cart Operations (requires authentication)
```bash
# Replace YOUR_JWT_TOKEN with the token received from login

# Get cart
curl http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"

# Save cart
curl -X PUT http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \
  -H \"Content-Type: application/json\" \
  -d '{\"items\": [{\"item_id\": \"item-uuid\", \"item_name\": \"Apple\", \"rate\": 150, \"quantity\": 2, \"total\": 300}]}'

# Clear cart
curl -X DELETE http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"
```

### Frontend Testing

1. **Open the application** at `http://localhost:3000`

2. **Test user registration/login**
   - Click on the login/signup button
   - Create a new account or login with existing credentials

3. **Test product browsing**
   - Browse products in the main page
   - Use category filters to filter products

4. **Test cart functionality**
   - Add items to cart
   - Update quantities
   - Remove items
   - Verify cart persists after page refresh (when logged in)

5. **Test checkout flow**
   - Add items to cart
   - Proceed to checkout
   - Fill in delivery address (required for first-time users)

### Running Automated Tests

#### Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

#### Frontend Tests
```bash
cd frontend
yarn test
```

---

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py           # FastAPI main application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utility functions
│   ├── package.json       # Node.js dependencies
│   └── .env              # Frontend environment variables
├── tests/                 # Test files
└── README.md             # This file
```

---

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your connection string is correct
   - Check if the `MONGO_URL` in `.env` is properly configured

2. **CORS Errors**
   - Verify `REACT_APP_BACKEND_URL` matches your backend server address
   - Check that the backend CORS configuration includes your frontend origin

3. **Port Already in Use**
   - Backend: Change port in uvicorn command or kill the process using port 8001
   - Frontend: React will automatically suggest using a different port

4. **Dependencies Installation Failed**
   - Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
   - For Python, try: `pip install --upgrade pip && pip install -r requirements.txt`

---

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/grocery_app` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License." --new-str "# 🛒 Grocery Shopping App

A modern full-stack grocery shopping application built with **React**, **FastAPI**, and **MongoDB**. Features include product browsing with category filters, persistent cart management, user authentication with Google OAuth, order management, and admin capabilities.

## ✨ Key Features

- 🔐 **User Authentication**: Secure login with Google OAuth and session management
- 🛍️ **Product Browsing**: Browse 22+ grocery items across 6 categories
- 🔍 **Category Filtering**: Filter products by Vegetables, Fruits, Dairy, Beverages, Snacks, and Essentials
- 🛒 **Persistent Cart**: Cart automatically saves and persists across sessions
- 📦 **Order Management**: Place orders with delivery address validation
- 👤 **User Profile**: Manage phone number and home address
- 📊 **Order History**: View past orders and order details
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui components

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Development Environment Setup](#-development-environment-setup)
- [Running the Application](#-running-the-application)
- [Testing the Application](#-testing-the-application)
- [Deployment Guide](#-deployment-guide)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables-reference)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Recommended Version | Installation Guide |
|----------|----------------|---------------------|-------------------|
| **Node.js** | v16.x | v18.x or v20.x | [nodejs.org](https://nodejs.org/) |
| **Yarn** | v1.22+ | v1.22.22 | `npm install -g yarn` |
| **Python** | v3.9+ | v3.10+ or v3.11+ | [python.org](https://www.python.org/) |
| **MongoDB** | v5.0+ | v6.0+ or v7.0+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | v2.x | Latest | [git-scm.com](https://git-scm.com/) |

### Optional Tools

- **Docker** & **Docker Compose**: For containerized deployment
- **MongoDB Compass**: GUI for MongoDB database management
- **Postman** or **HTTPie**: For API testing
- **VSCode**: Recommended IDE with extensions for React and Python

---

## 🛠️ Development Environment Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/grocery-shopping-app.git
cd grocery-shopping-app
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Create and Activate Virtual Environment

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

#### 2.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.4 Configure Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Linux/macOS
touch .env

# Windows
type nul > .env
```

Add the following configuration to `.env`:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=grocery_app

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
HOST=0.0.0.0
PORT=8001
```

> 🔐 **Security Note**: Change `JWT_SECRET` to a strong, random string in production. Generate one using:
> ```bash
> python -c \"import secrets; print(secrets.token_urlsafe(32))\"
> ```

#### 2.5 Set Up MongoDB

**Option A: Local MongoDB Installation**
```bash
# Start MongoDB service
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows - MongoDB starts automatically after installation
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URL` in `.env`:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

#### 3.2 Install Node.js Dependencies

```bash
# Install dependencies using Yarn (recommended)
yarn install

# Or using npm (if Yarn is not available)
npm install
```

#### 3.3 Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Linux/macOS
touch .env

# Windows
type nul > .env
```

Add the following configuration to `.env`:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Optional: Google OAuth Client ID (for frontend Google Sign-In button)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Running the Application

### Method 1: Run Backend and Frontend Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server

```bash
cd backend
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows

# Start FastAPI server with hot-reload
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend API is now running at: **http://localhost:8001**
📚 API Documentation: **http://localhost:8001/docs** (Swagger UI)

#### Terminal 2 - Start Frontend Server

```bash
cd frontend
yarn start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ Frontend application is now running at: **http://localhost:3000**

#### Terminal 3 - Seed Sample Data (First-time setup)

```bash
# Seed the database with sample grocery items
curl -X POST http://localhost:8001/api/seed-items

# Expected response:
# {\"message\": \"22 items seeded successfully\"}
```

### Method 2: Using Docker Compose (Containerized Environment)

If you have Docker installed, you can run the entire stack with one command:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services in Docker:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- MongoDB: localhost:27017

---

## 🧪 Testing the Application

### Initial Setup - Seed Sample Data

Before testing, populate the database with sample grocery items:

```bash
# Method 1: Using curl
curl -X POST http://localhost:8001/api/seed-items

# Method 2: Using HTTPie (if installed)
http POST http://localhost:8001/api/seed-items

# Method 3: Using Python
python -c \"import requests; print(requests.post('http://localhost:8001/api/seed-items').json())\"
```

**Sample Data Includes:**
- **22 grocery items** across 6 categories
- Categories: Vegetables, Fruits, Dairy, Beverages, Snacks, Essentials
- Each item includes name, rate, image URL, and category

### Manual Testing - User Flow

#### 1. User Registration and Authentication

**Open the application:** http://localhost:3000

**Test Flow:**
1. Click **\"Sign In\"** or **\"Get Started\"** button
2. Choose authentication method:
   - **Google Sign-In**: Click \"Continue with Google\"
   - **Email/Password**: Register with email and create password
3. Verify successful login (user name appears in navbar)

#### 2. Product Browsing and Category Filtering

1. View all 22 grocery items on the main page
2. Click category filter buttons: **All**, **Vegetables**, **Fruits**, **Dairy**, **Beverages**, **Snacks**, **Essentials**
3. Verify products filter correctly by category

#### 3. Cart Management

1. Click **\"Add to Cart\"** on any product
2. Verify item appears in cart with correct quantity and price
3. **Update quantity**: Use +/- buttons to adjust
4. **Remove item**: Click trash icon or set quantity to 0
5. **Refresh page**: Verify cart persists (items remain after reload)
6. **Logout and login**: Verify cart still exists for the user

#### 4. Checkout and Order Placement

1. Add items to cart
2. Click **\"Proceed to Checkout\"** or **\"Place Order\"**
3. If first-time user:
   - Modal appears requesting **phone number** and **home address**
   - Fill in details and submit
4. Order is placed successfully
5. Cart is cleared automatically
6. View order in **Order History** page

### API Testing - Backend Endpoints

#### Test Items and Categories

```bash
# Get all items
curl http://localhost:8001/api/items

# Get all categories
curl http://localhost:8001/api/categories

# Expected response: [\"Beverages\", \"Dairy\", \"Essentials\", \"Fruits\", \"Snacks\", \"Vegetables\"]
```

#### Test Authentication Endpoints

```bash
# Register a new user
curl -X POST http://localhost:8001/api/auth/register \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"testuser@example.com\",
    \"password\": \"SecurePassword123!\",
    \"full_name\": \"Test User\"
  }'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"testuser@example.com\",
    \"password\": \"SecurePassword123!\"
  }'

# Save the token from response for authenticated requests
```

#### Test Cart Operations (Requires Authentication)

```bash
# Get user cart
curl http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN_HERE\"

# Save/Update cart
curl -X PUT http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN_HERE\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"items\": [
      {
        \"item_id\": \"550e8400-e29b-41d4-a716-446655440000\",
        \"item_name\": \"Fresh Tomatoes\",
        \"rate\": 60,
        \"quantity\": 2,
        \"total\": 120
      }
    ]
  }'

# Clear cart
curl -X DELETE http://localhost:8001/api/cart \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN_HERE\"
```

#### Test Order Operations

```bash
# Get user orders
curl http://localhost:8001/api/orders \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN_HERE\"

# Create new order
curl -X POST http://localhost:8001/api/orders \
  -H \"Authorization: Bearer YOUR_JWT_TOKEN_HERE\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"items\": [
      {
        \"item_id\": \"550e8400-e29b-41d4-a716-446655440000\",
        \"item_name\": \"Fresh Tomatoes\",
        \"rate\": 60,
        \"quantity\": 2,
        \"total\": 120
      }
    ],
    \"grand_total\": 120
  }'
```

### Running Automated Tests

#### Backend Unit Tests

```bash
cd backend
source venv/bin/activate  # Activate virtual environment

# Run all tests
python -m pytest tests/ -v

# Run tests with coverage
python -m pytest tests/ --cov=. --cov-report=html

# Run specific test file
python -m pytest tests/test_api.py -v
```

#### Frontend Tests

```bash
cd frontend

# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Performance Testing

```bash
# Install Apache Bench (if not already installed)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: Comes pre-installed

# Test API performance (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:8001/api/items

# Load test with authentication
ab -n 100 -c 10 -H \"Authorization: Bearer YOUR_TOKEN\" http://localhost:8001/api/cart
```

---

## 🚢 Deployment Guide

### Production Deployment Best Practices

Before deploying to production:

1. ✅ **Environment Variables**: Update all `.env` files with production values
2. ✅ **JWT Secret**: Use a strong, random secret key
3. ✅ **MongoDB**: Use managed MongoDB (Atlas) or properly secured instance
4. ✅ **CORS**: Configure CORS to allow only your production domain
5. ✅ **HTTPS**: Enable SSL/TLS certificates
6. ✅ **Build Frontend**: Create optimized production build
7. ✅ **Error Logging**: Set up error monitoring (Sentry, LogRocket, etc.)
8. ✅ **Backup Strategy**: Configure automated database backups

### Deployment Option 1: Traditional Server (VPS/Dedicated)

#### Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Minimum 2GB RAM, 2 CPU cores
- Domain name with DNS configured

#### Step-by-Step Deployment

**1. Server Setup**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y python3-pip python3-venv nginx mongodb-server curl

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo \"deb https://dl.yarnpkg.com/debian/ stable main\" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

**2. Clone and Configure Application**

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/grocery-app.git
cd grocery-app

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure production .env
sudo nano .env
# Update with production values:
# - MONGO_URL (use MongoDB Atlas or secured local MongoDB)
# - Strong JWT_SECRET
# - Production GOOGLE_CLIENT_ID/SECRET

# Frontend setup
cd ../frontend
yarn install
yarn build  # Creates optimized production build in /build

# Update .env with production backend URL
sudo nano .env
# REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

**3. Configure Backend with PM2**

```bash
cd /var/www/grocery-app/backend

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'grocery-backend',
    script: '/var/www/grocery-app/backend/venv/bin/uvicorn',
    args: 'server:app --host 0.0.0.0 --port 8001',
    cwd: '/var/www/grocery-app/backend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable auto-start on boot
```

**4. Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/grocery-app

# Add configuration:
```

```nginx
# Backend API server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/grocery-app/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/grocery-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

**5. Enable HTTPS with Let's Encrypt**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
```

**6. Configure MongoDB Security**

```bash
# For local MongoDB
sudo nano /etc/mongod.conf

# Enable authentication
# Add under 'security:':
security:
  authorization: enabled

# Create admin user
mongosh
use admin
db.createUser({
  user: \"admin\",
  pwd: \"strongpassword\",
  roles: [\"root\"]
})

# Update MONGO_URL in backend/.env
MONGO_URL=mongodb://admin:strongpassword@localhost:27017/grocery_app?authSource=admin
```

### Deployment Option 2: Docker + Docker Compose

**1. Create Production Dockerfile**

```bash
cd /var/www/grocery-app
```

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: grocery-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: grocery_app
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    ports:
      - \"27017:27017\"
    networks:
      - grocery-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: grocery-backend
    restart: always
    depends_on:
      - mongodb
    environment:
      MONGO_URL: mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/grocery_app?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      DB_NAME: grocery_app
    ports:
      - \"8001:8001\"
    networks:
      - grocery-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        REACT_APP_BACKEND_URL: https://api.yourdomain.com
    container_name: grocery-frontend
    restart: always
    ports:
      - \"3000:80\"
    networks:
      - grocery-network

volumes:
  mongodb_data:
  mongodb_config:

networks:
  grocery-network:
    driver: bridge
```

**2. Create Backend Dockerfile**

Create `backend/Dockerfile.prod`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run with Gunicorn
CMD [\"gunicorn\", \"server:app\", \"-w\", \"4\", \"-k\", \"uvicorn.workers.UvicornWorker\", \"--bind\", \"0.0.0.0:8001\"]
```

**3. Create Frontend Dockerfile**

Create `frontend/Dockerfile.prod`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build app
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [\"nginx\", \"-g\", \"daemon off;\"]
```

**4. Deploy with Docker Compose**

```bash
# Create .env file for Docker Compose
cat > .env << 'EOF'
MONGO_ROOT_PASSWORD=your_strong_mongodb_password
JWT_SECRET=your_strong_jwt_secret
EOF

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Seed database
docker exec grocery-backend python -c \"import requests; requests.post('http://localhost:8001/api/seed-items')\"
```

### Deployment Option 3: Cloud Platforms

#### Heroku Deployment

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-grocery-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id

# Deploy
git push heroku main

# Seed database
heroku run python scripts/seed_database.py
```

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend on Railway:**
1. Visit [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add MongoDB database
5. Configure environment variables
6. Deploy

#### AWS EC2 + RDS MongoDB

Follow the traditional server deployment steps on an EC2 instance, and use MongoDB Atlas or AWS DocumentDB for the database.

### Post-Deployment Checklist

- [ ] SSL certificates configured and auto-renewal enabled
- [ ] Environment variables set correctly
- [ ] Database seeded with initial data
- [ ] All services running and accessible
- [ ] Error logging and monitoring configured
- [ ] Database backups scheduled
- [ ] Firewall rules configured
- [ ] Domain DNS configured correctly
- [ ] CORS configured for production domain
- [ ] Performance monitoring enabled
- [ ] Security headers configured

---

## 📁 Project Structure

```
grocery-shopping-app/
├── backend/                      # FastAPI Backend
│   ├── server.py                 # Main application file
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (not in git)
│   ├── Dockerfile.prod           # Production Docker config
│   └── tests/                    # Backend test files
│       ├── __init__.py
│       ├── test_api.py
│       └── test_auth.py
│
├── frontend/                     # React Frontend
│   ├── public/                   # Static files
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/                      # Source code
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── BillingPage.js
│   │   │   ├── OrdersPage.js
│   │   │   └── ProfilePage.js
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   └── CartItem.js
│   │   ├── lib/                  # Utility functions
│   │   │   └── utils.js
│   │   ├── App.js                # Main App component
│   │   └── index.js              # Entry point
│   ├── package.json              # Node.js dependencies
│   ├── .env                      # Environment variables (not in git)
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── Dockerfile.prod           # Production Docker config
│   └── nginx.conf                # Nginx config for production
│
├── tests/                        # Integration tests
│   └── __init__.py
│
├── scripts/                      # Utility scripts
│   ├── populate_items.js         # Seed database script
│   └── create_test_session.py    # Create test user session
│
├── docker-compose.yml            # Development Docker config
├── docker-compose.prod.yml       # Production Docker config
├── .gitignore                    # Git ignore file
├── README.md                     # This file
└── test_result.md                # Testing documentation
```

---

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:8001`
- **Production**: `https://api.yourdomain.com`

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Public Endpoints (No Authentication Required)

#### GET /api/items
Get all grocery items

**Response:**
```json
[
  {
    \"item_id\": \"uuid\",
    \"name\": \"Fresh Tomatoes\",
    \"rate\": 60,
    \"category\": \"Vegetables\",
    \"image_url\": \"https://example.com/tomato.jpg\",
    \"created_at\": \"2025-01-15T10:30:00Z\"
  }
]
```

#### GET /api/categories
Get all distinct categories

**Response:**
```json
[\"Vegetables\", \"Fruits\", \"Dairy\", \"Beverages\", \"Snacks\", \"Essentials\"]
```

#### POST /api/seed-items
Seed database with sample items

**Response:**
```json
{
  \"message\": \"22 items seeded successfully\"
}
```

### Protected Endpoints (Authentication Required)

#### GET /api/cart
Get user's cart

**Response:**
```json
{
  \"cart_id\": \"uuid\",
  \"user_id\": \"uuid\",
  \"items\": [
    {
      \"item_id\": \"uuid\",
      \"item_name\": \"Fresh Tomatoes\",
      \"rate\": 60,
      \"quantity\": 2,
      \"total\": 120
    }
  ],
  \"updated_at\": \"2025-01-15T10:35:00Z\"
}
```

#### PUT /api/cart
Save/Update user's cart

**Request Body:**
```json
{
  \"items\": [
    {
      \"item_id\": \"uuid\",
      \"item_name\": \"Fresh Tomatoes\",
      \"rate\": 60,
      \"quantity\": 2,
      \"total\": 120
    }
  ]
}
```

#### DELETE /api/cart
Clear user's cart

**Response:**
```json
{
  \"message\": \"Cart cleared successfully\"
}
```

#### POST /api/orders
Create new order

**Request Body:**
```json
{
  \"items\": [...],
  \"grand_total\": 250.50
}
```

#### GET /api/orders
Get user's order history

Full API documentation available at: `http://localhost:8001/docs` (Swagger UI)

---

## 📝 Environment Variables Reference

### Backend Environment Variables (`backend/.env`)

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `MONGO_URL` | ✅ Yes | - | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | ✅ Yes | `grocery_app` | MongoDB database name | `grocery_app` |
| `JWT_SECRET` | ✅ Yes | - | Secret key for JWT token signing | `your-256-bit-secret-key` |
| `GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ❌ No | - | Google OAuth client secret | `GOCSPX-xxxxxxxxxxxxx` |
| `HOST` | ❌ No | `0.0.0.0` | Server bind address | `0.0.0.0` |
| `PORT` | ❌ No | `8001` | Server port | `8001` |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `REACT_APP_BACKEND_URL` | ✅ Yes | - | Backend API URL | `http://localhost:8001` |
| `REACT_APP_GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth client ID (frontend) | `123456789.apps.googleusercontent.com` |

### How to Generate Strong Secrets

```bash
# Generate JWT secret (Python)
python -c \"import secrets; print(secrets.token_urlsafe(32))\"

# Generate JWT secret (OpenSSL)
openssl rand -base64 32

# Generate JWT secret (Node.js)
node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error

**Error:** `ServerSelectionTimeoutError: connection to MongoDB failed`

**Solutions:**
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Ensure MongoDB port 27017 is not blocked by firewall
- For MongoDB Atlas, whitelist your IP address

```bash
# Start MongoDB (Linux)
sudo systemctl start mongod

# Start MongoDB (macOS)
brew services start mongodb-community

# Check if MongoDB is running
mongosh --eval \"db.adminCommand('ping')\"
```

#### 2. CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solutions:**
- Verify `REACT_APP_BACKEND_URL` in frontend `.env` matches backend URL
- Check CORS configuration in `backend/server.py`
- Ensure backend is running and accessible

**Backend CORS Configuration:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"http://localhost:3000\", \"https://yourdomain.com\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)
```

#### 3. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::8001`

**Solutions:**

**Linux/macOS:**
```bash
# Find process using port 8001
lsof -i :8001

# Kill process
kill -9 <PID>

# Or use killport (if installed)
npx kill-port 8001
```

**Windows:**
```cmd
# Find process using port 8001
netstat -ano | findstr :8001

# Kill process
taskkill /PID <PID> /F
```

#### 4. Dependencies Installation Failed

**Python Dependencies:**
```bash
# Upgrade pip first
pip install --upgrade pip

# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt --no-cache-dir

# If specific package fails, install individually
pip install <package-name> --no-binary :all:
```

**Node.js Dependencies:**
```bash
# Clear Yarn cache
yarn cache clean

# Remove node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# If using npm
rm -rf node_modules package-lock.json
npm install
```

#### 5. JWT Token Issues

**Error:** `Invalid token` or `Token expired`

**Solutions:**
- Tokens expire after a set time (default: 24 hours)
- Logout and login again to get a new token
- Check `JWT_SECRET` is consistent across backend instances
- Verify token format: `Bearer <token>`

#### 6. Cart Not Persisting

**Possible Causes:**
- User not authenticated (cart requires login)
- MongoDB connection issue
- Browser cookies disabled

**Solutions:**
- Ensure user is logged in
- Check backend logs for database errors
- Enable cookies in browser
- Clear browser cache and cookies, then login again

#### 7. Google OAuth Not Working

**Error:** `Redirect URI mismatch` or `Invalid client ID`

**Solutions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
4. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in `.env`

#### 8. Frontend Build Fails

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS=\"--max-old-space-size=4096\"
yarn build

# Or add to package.json scripts
\"build\": \"NODE_OPTIONS='--max-old-space-size=4096' craco build\"
```

#### 9. Database Seed Fails

**Error:** Items not appearing after seeding

**Solutions:**
```bash
# Check if items already exist
curl http://localhost:8001/api/items

# Clear items collection and re-seed
mongosh grocery_app --eval \"db.items.deleteMany({})\"
curl -X POST http://localhost:8001/api/seed-items

# Check backend logs
tail -f backend/server.log
```

#### 10. Production Build Not Loading

**Issue:** Frontend shows blank page in production

**Solutions:**
- Check browser console for errors
- Verify `REACT_APP_BACKEND_URL` is set correctly for production
- Ensure all environment variables are available during build
- Check Nginx configuration for correct root path
- Verify static files are served correctly

```bash
# Rebuild with production env
REACT_APP_BACKEND_URL=https://api.yourdomain.com yarn build

# Test build locally
npx serve -s build -l 3000
```

### Getting Help

If you encounter issues not covered here:

1. **Check Logs:**
   - Backend: `tail -f backend/server.log`
   - Frontend: Browser DevTools Console
   - MongoDB: `sudo tail -f /var/log/mongodb/mongod.log`

2. **Enable Debug Mode:**
   ```bash
   # Backend - run with verbose logging
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload --log-level debug
   ```

3. **Test Components Individually:**
   - Test MongoDB connection
   - Test backend API endpoints
   - Test frontend in isolation

4. **Create GitHub Issue:**
   - Include error messages
   - Provide steps to reproduce
   - Share relevant logs
   - Mention your environment (OS, versions)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
4. **Test your changes**
   - Run backend tests: `pytest`
   - Run frontend tests: `yarn test`
   - Manual testing
5. **Commit your changes**
   ```bash
   git commit -m \"Add: feature description\"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Add screenshots for UI changes

### Code Style Guidelines

**Python (Backend):**
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Run `black` for formatting: `black .`
- Run `flake8` for linting: `flake8 .`

**JavaScript/React (Frontend):**
- Use ES6+ features
- Follow Airbnb React style guide
- Use functional components with hooks
- Run `eslint`: `yarn lint`
- Run `prettier`: `yarn format`

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the \"Software\"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

For questions, issues, or feedback:

- **Email**: support@yourdomain.com
- **GitHub Issues**: [Create an issue](https://github.com/YOUR_USERNAME/grocery-app/issues)
- **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/grocery-app/wiki)

---

## 🙏 Acknowledgments

- **FastAPI**: Modern, fast web framework for Python
- **React**: JavaScript library for building user interfaces
- **MongoDB**: NoSQL database for flexible data storage
- **shadcn/ui**: Beautiful UI components built with Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework

---

**Built with ❤️ by the Grocery App Team**

*Last Updated: July 2025*"
Observation: Edit was successful.
