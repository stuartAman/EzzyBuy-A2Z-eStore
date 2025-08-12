# 🛒 Ezzy Buy A2Z eStore

Ezzy Buy A2Z is a full-stack e-commerce web application for electronics shopping. It supports secure user authentication, product browsing, cart and wishlist management, order placement, Razorpay payments, and admin tools for inventory and order control.

---

## 🧰 Features

- 🔍 Product search and category filtering
- 🛒 Cart and wishlist management
- 📦 Order placement and tracking
- 💳 Razorpay payment integration
- 🧾 Invoice download (PDF via JasperReports)
- 🔐 JWT-based authentication and role-based access
- 📊 Admin dashboard for product and order control

---

## 🚀 Tech Stack

### 🔧 Backend (Spring Boot)
- Java 11
- Spring Boot 2 (Security, Web, Data MongoDB)
- MongoDB
- JWT (JJWT)
- JasperReports
- Maven

### 🎨 Frontend (React)
- React + JSX
- Material UI (MUI)
- Axios
- React Router DOM

---

## 🛠️ Project Setup

### 📦 Backend Setup

#### 

1️⃣ Clone the Repository
```bash
git clone https://github.com/stuartAman/EzzyBuy-A2Z-eStore.git
cd EzzyBuy-A2Z-eStore/backend

2️⃣ MongoDB Configuration
Update src/main/resources/application.properties:
properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/ezzybuydb

# JWT Secret
ezzybuy.jwt.secret=your_jwt_secret_key

# Razorpay API Keys
razorpay.key_id=your_razorpay_key_id
razorpay.key_secret=your_razorpay_key_secret

# Server Port
server.port=8443
3️⃣ Run MongoDB Locally
If MongoDB is installed locally, start it with:
mongod --dbpath /path/to/your/db
Example: mongod --dbpath C:\data\db (Windows)

🛠️ Running Backend in Spring Tool Suite (STS)
✅ Prerequisites
STS installed
Java 11+
Maven installed
MongoDB running locally

🧩 Steps
1️⃣ Open STS
2️⃣ Import the backend project
    Go to File → Import → Existing Maven Projects
    Select the EzzyBuy-A2Z-eStore/backend folder
    Click Finish

3️⃣  Verify MongoDB is running
    Run this in terminal:
    mongod --dbpath /path/to/your/db

4️⃣  Configure application.properties

     Located at: src/main/resources/application.properties
     Example:
      spring.data.mongodb.uri=mongodb://localhost:27017/ezzybuydb
      razorpay.key_id=your_razorpay_key_id
      razorpay.key_secret=your_razorpay_key_secret
      ezzybuy.jwt.secret=your_jwt_secret_key
      server.port=8443

5️⃣  Run the application
     Right-click the main class (e.g., EzzyBuyApplication.java)
     Select Run As → Spring Boot App

6️⃣  Access Backend
      Open browser: https://localhost:8443

🌐 Running Frontend in Visual Studio Code (VS Code)
✅ Prerequisites
Node.js and npm installed

VS Code installed

🧩 Steps
1️⃣  Open VS Code

2️⃣  Open the frontend folder
    Go to File → Open Folder
    Select EzzyBuy-A2Z-eStore/frontend

3️⃣  Install dependencies
    Open terminal in VS Code:
    npm install
4️⃣  Configure API base URL
    Create or edit .env file in root of frontend:
    REACT_APP_API_BASE_URL=https://localhost:8443
5️⃣  Start the frontend
    npm start
6️⃣  Access Frontend
    Open browser: http://localhost:3000




🧪 Test the Flow
Register a user

Login and receive JWT

Browse products

Add to cart and checkout

Complete payment via Razorpay

Download invoice

🔐 Roles
Visitor: Browse products, register/login
User: Manage profile, cart, wishlist, orders, payments
Admin: Add/remove products, manage orders, update statuses


✅ With both backend and frontend running seamlessly, Ezzy Buy A2Z is now fully operational—ready to deliver a smooth, secure, and scalable e-commerce experience. Time to shift gears from building to growing. 🚀
