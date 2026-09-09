# TalentConnect

TalentConnect is a modern web platform designed to seamlessly connect event planners with local talents and services. Whether you are hosting a wedding, corporate event, birthday party, or a concert, TalentConnect makes finding, booking, and managing event services completely hassle-free.

---

## 🚀 Features

- **Service Browsing**: Discover diverse categories of services, including musicians, photographers, caterers, decorators, and more.
- **Advanced Filtering & Search**: Find the right talent based on categories, pricing, ratings, and availability.
- **Secure Authentication**: User sign-in and registration powered by Firebase Authentication.
- **Event Booking System**: Intuitive system to request, schedule, and track service bookings.
- **Service Management**: Allow service providers/talents to register, showcase their profiles, manage their services, and track bookings.
- **Database Seeding**: Easily seed the MongoDB database with realistic demo categories, users, services, and reviews.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (v19)
- **Build Tool / Bundler**: Vite (v7)
- **Routing**: React Router DOM (v7)
- **Backend Services**: Firebase SDK (v12) for Client Auth & Services
- **Styling**: Vanilla CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose v8 ODM)
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Environment Variables**: dotenv
- **Development Tools**: nodemon

---

## 📂 Project Structure

```text
TalentConnect/
├── backend/                # Express Server & API Routes
│   ├── middleware/        # Authentication & Validation Middleware
│   ├── models/            # Mongoose Schemas (User, Service, Booking, etc.)
│   ├── routes/            # Express Router Handlers (Auth, Bookings, Users, etc.)
│   ├── seed.js            # Initial Database Seeding Script
│   ├── server.js          # Express Entry Point
│   └── package.json
├── src/                    # Frontend React Application
│   ├── assets/            # Static assets
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components (Blog, CancellationPolicy, Browse, etc.)
│   └── main.jsx           # React Entry Point
├── package.json            # Root configuration for Frontend
├── vite.config.js          # Vite config
└── README.md               # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/pranjalkwatra27/Talent-Connect-Platform.git
cd Talent-Connect-Platform
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory (based on `backend/.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/TalentConnect
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Seed the database (optional but recommended for test data):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (based on `.env.example`) and configure your Firebase keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🧑‍💻 Scripts

### Backend (`/backend`)
- `npm start`: Runs the server using standard Node.js.
- `npm run dev`: Runs the server with `nodemon` for auto-reloading on changes.
- `npm run seed`: Clears existing database entries and populates them with sample categories, services, bookings, and users.

### Frontend (Root)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the React application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.
