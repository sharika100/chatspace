# ChatSpace — Real-Time Multi-Room Chat Application

A modern, responsive real-time chat application built with **React.js (Vite)**, **Firebase Authentication**, and **Cloud Firestore**, designed for high-performance multi-user communication. Built for the **Code4Campus / Mulearn Web Development Task (400 Karma Points)** and pre-configured for seamless deployment to **Vercel**.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v13-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS3-38B2AC?logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Only-000000?logo=vercel&logoColor=white)

---

## 🌟 Features

- **Genuine Real-Time Messaging**: Built on Cloud Firestore listeners (`onSnapshot`) for millisecond-latency message sync across devices without manual polling or refresh.
- **Multiple Categorized Chat Rooms**:
  - Default pre-seeded community rooms: `#General`, `#Technology`, `#Programming`, `#Web Development`, and `#Random`.
  - Room search and instant keyword filtering.
  - Custom public room creation with client & server-side validation (duplicate detection, character limits).
- **Secure Firebase Authentication**:
  - Email & Password registration with display name collection.
  - Email & Password login with session persistence.
  - One-click Google Sign-In support.
  - Synchronized user profiles in Firestore (`users/{uid}`).
  - Protected routes and instant user logout.
- **Modern Dark Navy UI / UX**:
  - Inspired by modern messaging platforms with a refined dark navy (`#020617` / `#0f172a`), slate, and violet/indigo theme.
  - Fully responsive desktop (sidebar + conversation panel) and mobile layout (collapsible drawer, full-height viewport).
  - Distinct styling for current user messages vs other participants (avatars with deterministic color gradients, display names, timestamps).
  - Auto-scrolling message stream, empty states, and keyboard shortcuts (<kbd>Enter</kbd> to send, <kbd>Shift</kbd> + <kbd>Enter</kbd> for new line).
- **Production-Ready Security Rules**: Strict Firestore rules preventing impersonation, unauthorized updates, and payload tampering.
- **Vercel-Only Deployment**: Single-Page Application (SPA) rewrite rules configured via `vercel.json`.

---

## 📁 Project Architecture

```
chatspace/
├── firestore.rules             # Production security rules for Firestore
├── vercel.json                 # Vercel SPA routing configuration
├── .env.example                # Environment variable template
├── .gitignore                  # Git exclusions including .env
├── package.json                # Project dependencies and build scripts
├── vite.config.js              # Vite configuration with chunk splitting
├── index.html                  # HTML entry point with metadata
└── src/
    ├── firebase.js             # Firebase SDK initialization & verification
    ├── main.jsx                # Application root entry
    ├── App.jsx                 # View router and state coordinator
    ├── index.css               # Global theme & scrollbar styling
    ├── context/
    │   ├── authContextInstance.js # React AuthContext instance
    │   ├── AuthContext.jsx     # Auth state provider
    │   └── useAuth.js          # useAuth custom hook
    ├── services/
    │   ├── authService.js      # Auth registration, login, logout, & profile sync
    │   └── chatService.js      # Real-time room & message subscriptions & writes
    ├── components/
    │   ├── Sidebar.jsx         # Left navigation sidebar & room search
    │   ├── RoomList.jsx        # Categorized room list items with icons
    │   ├── ChatHeader.jsx      # Room header with participant stats & mobile toggle
    │   ├── MessageList.jsx     # Scrollable message history with auto-scroll
    │   ├── MessageBubble.jsx   # Message bubble with user/other distinction
    │   ├── MessageInput.jsx    # Expanding message composer with char counter
    │   ├── CreateRoomModal.jsx # Room creation dialog with validation
    │   ├── ConfigBanner.jsx    # Helper banner when Firebase keys are pending
    │   ├── LoadingSpinner.jsx  # Pulsing loading indicator
    │   └── Toast.jsx           # Floating notification toast
    └── pages/
        ├── Login.jsx           # User login page
        ├── Register.jsx        # User registration page
        └── Chat.jsx            # Main multi-room chat interface
```

---

## 🚀 Firebase Setup Guide

Follow these steps to connect your own Firebase project:

### 1. Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `chatspace-app`) and click **Continue**.
4. Disable or enable Google Analytics (optional) and complete creation.

### 2. Register a Web Application
1. In your Firebase Project Overview, click the **Web icon (`</>`)**.
2. App nickname: `chatspace-web`.
3. Leave "Firebase Hosting" unchecked (we are deploying to **Vercel**).
4. Click **Register app**.
5. Copy the configuration credentials shown in the `firebaseConfig` snippet.

### 3. Enable Authentication
1. In the left sidebar, click **Build** &rarr; **Authentication** &rarr; **Get Started**.
2. Under the **Sign-in method** tab:
   - Click **Email/Password** &rarr; toggle **Enable** &rarr; click **Save**.
   - *(Optional)* Click **Google** &rarr; toggle **Enable** &rarr; select support email &rarr; click **Save**.

### 4. Create Cloud Firestore Database
1. In the left sidebar, click **Build** &rarr; **Firestore Database** &rarr; **Create database**.
2. Database ID: `(default)`.
3. Location: Choose the region nearest to you (e.g., `us-central1` or `asia-south1`).
4. Select **Start in production mode** (or test mode during initial setup).
5. Click **Create**.

### 5. Publish Firestore Security Rules
1. In the Firestore Database tab, click **Rules**.
2. Replace any existing rules with the contents of [`firestore.rules`](./firestore.rules) provided in this project.
3. Click **Publish**.

*(Alternatively, deploy via Firebase CLI using `firebase deploy --only firestore:rules`)*.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js `v18+` or `v20+` (or `v24+`)
- npm `v9+` or `v11+`

### 1. Clone the repository & Install Dependencies
```bash
cd chatspace
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=chatspace-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chatspace-app
VITE_FIREBASE_STORAGE_BUCKET=chatspace-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔒 Firestore Security Rules Overview

The rules in `firestore.rules` enforce strict production constraints:
- **Authentication**: Unauthenticated users cannot read or write any documents.
- **Message Integrity**:
  - `senderId` must strictly equal `request.auth.uid` (prevents user impersonation).
  - Message text must be non-empty and $\le 1000$ characters.
  - Messages are immutable (`allow update, delete: if false`) to maintain a tamper-proof conversation history.
- **Room Protection**:
  - Room names must be between 2 and 50 characters.
  - `createdBy` must match the authenticated user.
  - Rooms cannot be deleted or arbitrarily modified by clients.
- **User Profiles**:
  - Users can read all profiles to display avatars and names.
  - Users can only create or update their own profile document (`request.auth.uid == userId`).

---

## 🌐 Deploying to Vercel (Vercel ONLY)

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of ChatSpace application"
   git remote add origin https://github.com/YOUR_USERNAME/chatspace.git
   git branch -M main
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com/) and log in.
   - Click **Add New...** &rarr; **Project**.
   - Select your GitHub repository `chatspace` and click **Import**.
3. **Configure Project Settings**:
   - Framework Preset: **Vite** (auto-detected).
   - Root Directory: `./` (default).
   - Build Command: `npm run build` (default).
   - Output Directory: `dist` (default).
4. **Add Environment Variables**:
   Under **Environment Variables**, add the 6 variables from your `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. **Click Deploy**:
   - Vercel will build and deploy your application in under 30 seconds.
   - Your application will receive an active URL like `https://chatspace-xyz.vercel.app`.

### Method 2: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```
When prompted, select the default settings and set the environment variables via `vercel env add`.

---

## 🧪 Functional Verification Checklist

- [x] **Registration**: Register new user with display name, email, and password.
- [x] **Profile Persistence**: Verify user profile created in Firestore `users/{uid}`.
- [x] **Login & Logout**: Authenticate with existing credentials, test session persistence across page refreshes, and test logout.
- [x] **Default Rooms**: Verify automatic seeding of `#General`, `#Technology`, `#Programming`, `#Web Development`, and `#Random`.
- [x] **Room Creation**: Create a new room with name and description; verify duplicate names are rejected.
- [x] **Real-Time Messaging**: Open two separate browser windows (or an Incognito window) logged in as two distinct users. Send messages in Room A and confirm instant appearance without refresh.
- [x] **Room Switching**: Switch between rooms and verify that only messages for the selected room appear.
- [x] **Keyboard Shortcuts**: Send message with <kbd>Enter</kbd>; insert newline with <kbd>Shift</kbd> + <kbd>Enter</kbd>.
- [x] **Empty Message & Length Limits**: Verify empty messages cannot be sent and characters are limited to 1000.
- [x] **Mobile Responsiveness**: Test collapsible sidebar drawer on viewport widths below 768px.
