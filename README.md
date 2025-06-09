# WaterOnMyBlock

## Description

**WaterOnMyBlock** is a community-centered flood reporting platform co-designed with residents of Chatham, Chicago. As climate change intensifies rainfall and aging infrastructure struggles to adapt, local street and basement flooding has become a persistent issue. This web application empowers residents to document and track these incidents in real time, generating community-owned data that can support civic advocacy, scientific research, and infrastructure planning.

The platform allows users to drop a pin on a map, fill out a detailed annotation form (including flood depth, location, water quality, timeline, and cause), and upload photos with customizable privacy settings. Submissions are visualized both as map markers and as a chronological community feed, which residents can browse to stay informed about nearby flooding.

Unlike traditional 311 systems that often exclude or delay citizen reports, WaterOnMyBlock supports both public and private submissions and incorporates participatory features such as anonymous posting and alderman email alerts. The system was developed in collaboration with Argonne National Lab, the Greater Chatham Initiative, and University of Chicago researchers, and was iteratively tested across multiple community engagement events.

---

## 👤 How to Use the Site

To contribute or browse flood reports, follow these simple steps:

### 🔐 1. Sign Up / Log In
- Navigate to [https://wateronmyblock.com](https://wateronmyblock.com)
- Click **“Log In”** at the top right
- You can sign up with your email address or use an existing Google account
- Logging in enables you to submit flood reports and view private content you've posted
<img width="614" alt="Screenshot 2025-05-28 at 3 10 33 AM" src="https://github.com/user-attachments/assets/15928834-359a-4dc8-a7c9-6d462097b2d5" />
---

### 📍 2. Submit a Flood Annotation
- After logging in, click anywhere on the map to drop a new pin at the location of the flood. Optionally, you can also use the search bar on the top left to search for a specific landmark. 
- Fill out the multi-step **Annotation Form**, which asks for:
  - **Date of incident**
  - **Flood depth, cause, and water quality**
  - **Type of location (street, property, etc)**
  - **Optional photo upload**, with the ability to mark it as “Public” or “Private”
  - **Additional comments or description**

- If you’d like, check the box to **email your alderman** about this incident.
- When finished, click **Submit**. Your report will appear on the map (if public) and in the community feed.
<img width="1465" alt="Screenshot 2025-05-28 at 3 13 11 AM" src="https://github.com/user-attachments/assets/9bec6121-4899-4a88-be07-14aa51558293" />
---

### 🗺️ 3. View Existing Reports on the Map
- The main map shows **publicly visible flood incidents**
- Click on a marker to see its details, including:
  - Flood description
  - Type and location
  - Time of submission
  - Uploaded photos (if public)
<img width="1464" alt="Screenshot 2025-05-28 at 3 14 41 AM" src="https://github.com/user-attachments/assets/e63a5994-35e9-44b7-820d-b66bf761507d" />
---

### 📰 4. Explore the Community Feed
- Scroll down to view the **Community Feed**
- This feed is automatically sorted by **most recent submissions**
- Click on an entry to center the map on the flood location
- Upvote entries to highlight widely observed flood zones
<img width="1461" alt="Screenshot 2025-05-28 at 3 16 19 AM" src="https://github.com/user-attachments/assets/23650dd4-b7ac-47cb-89e2-0d3e352c8b2c" />
---

### 🔒 5. Your Privacy Options
- When submitting a report, you can mark the entire entry or its images as **“Private”**
- Private entries will not be visible on the public map or feed, but are still stored and can be used for research or city analysis (with consent)
<img width="629" alt="Screenshot 2025-05-28 at 3 17 37 AM" src="https://github.com/user-attachments/assets/ab99fd02-1ec8-4643-9518-1588915cc39d" />
---

## 🏗️ Site Architecture

The application is built using the **MERN stack** (MongoDB, Express, React, Node.js), with a mobile-first responsive frontend and a secure REST API backend. It follows a modular folder structure and integrates third-party tools such as the Google Maps Geocoding API for address autofill and browser-image-compression for image optimization.

---

### 🔹 Frontend Overview (`/frontend`)
The frontend is built with **React (via create-react-app)** and includes custom components, views, context-based stores, and styles. Here's a breakdown of the most important subfolders and files inside `frontend/src/`:

📁 components/
- App.js – Root component that wires up routing, layout, global state, and the welcome popup.
- Navbar.js – Top navigation bar with links, login/logout controls, and responsive layout.
- WelcomePopup.js – Introductory popup shown on first load explaining how to use the app.
- ImageUpload.js – Handles image selection, compression, base64 conversion, and privacy tagging for submissions.

#### 📁 `pages/`
- Full-page views used for routing
- **`AboutUs.js`** – Static informational page about the project’s mission and collaborators
- **`Resources.js`** – List of flooding resources, 311 links, and preparedness tips
- **`Login.js`**, **`Logout.js`**, **`SignUpForm.js`**, **`SignUpFinal.js`** – Auth flow components (account creation, login/logout). `SignUpFinal.js` is the last step of the multi-page sign-up process.
- **`Map.js`** – Interactive map where users drop flood markers and view incident locations
- **`AnnotationForm.js`** – Multi-step submission form used to report floods

#### 📁 `styles/`
- Centralized CSS and custom media queries for responsive styling to accomodate mobile

#### 📁 `images/`
- Static assets like logos, background images, and social cards

#### 📄 `axiosInstance.js`
- Custom Axios wrapper with a predefined `baseURL` and headers
- Used across the app for all API communication with the backend

#### 📄 `firebase.js`
- Initializes Firebase for authentication


## 🧪 How to Test

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/WaterOnMyBlock.git
cd WaterOnMyBlock/webapp
```

### 2. Install dependencies
```bash
cd frontend
npm install
```

```
cd ../server
npm install
```

### 3. Set up environment variables
You'll need to configure both the frontend and server with appropriate environment variables. Create a .env file in both frontend/ and server/ directories.

🖥️ In /frontend/.env.local (Development Environment):
```
REACT_APP_BASE_URL=http://localhost:8080

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id

REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id

REACT_APP_CHATHAM_LAT=41.7405
REACT_APP_CHATHAM_LNG=-87.5997
```

🚀 In /frontend/.env.production (Production Deployment):
```
REACT_APP_BASE_URL=http://your_production_backend_url

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id

REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id

REACT_APP_CHATHAM_LAT=41.7405
REACT_APP_CHATHAM_LNG=-87.5997
```

🔧 In /server/.env:

```
PORT=8080
DB_URL=your_mongodb_connection_string
SECRET=your_jwt_secret_key

REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
```






