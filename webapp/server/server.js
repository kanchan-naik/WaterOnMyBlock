// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const connectToDb = require("./config/connectToDb");
const incidentController = require("./controllers/incidentController"); // Change to incidentController
const usersController = require("./controllers/usersController");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const requireAuth = require("./middleware/requireAuth");
const path = require("path");
const Image = require("./models/imageModel"); // Adjust the path if needed

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "http://ec2-23-22-165-228.compute-1.amazonaws.com", // Production frontend
  "http://wateronmyblock.com",
];

// Create an express app
const app = express();

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(express.json({ limit: "10mb" })); // Increase limit for JSON
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.raw({ limit: "10mb" })); // If using raw body
app.use(express.text({ limit: "10mb" })); // If using text

// CORS configuration for production
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (like mobile apps or Postman)
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow cookies to be sent with the request
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend
      "http://ec2-23-22-165-228.compute-1.amazonaws.com", // Production frontend
      "http://wateronmyblock.com",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

// Configure express app
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectToDb();

// Routing

/* User Authentication */
app.post("/signup", (req, res, next) => {
  console.log("POST /signup endpoint hit");
  usersController.signup(req, res, next);
});

app.post("/login", (req, res, next) => {
  console.log("POST /login endpoint hit");
  usersController.login(req, res, next);
});

app.get("/logout", (req, res, next) => {
  console.log("GET /logout endpoint hit");
  usersController.logout(req, res, next);
});

app.get("/check-auth", (req, res, next) => {
  console.log("GET /check-auth endpoint hit");
  requireAuth(req, res, next, () => usersController.checkAuth(req, res));
});

/* Incident Stuff */
// Get all incidents
app.get("/incidents", (req, res, next) => {
  console.log("GET /incidents endpoint hit");
  incidentController.getIncidents(req, res, next);
});

// Get a specific incident by ID
app.get("/incidents/:id", (req, res, next) => {
  console.log(`GET /incidents/${req.params.id} endpoint hit`);
  incidentController.getIncidentById(req, res, next);
});

// Create a new incident
app.post("/incidents", (req, res, next) => {
  console.log("POST /incidents endpoint hit");
  console.log("req:", req.body);
  incidentController.createIncident(req, res, next);
});

// Update an incident by ID
app.put("/incidents/:id", (req, res, next) => {
  console.log(`PUT /incidents/${req.params.id} endpoint hit`);
  incidentController.updateIncident(req, res, next);
});

// Delete an incident by ID
app.delete("/incidents/:id", (req, res, next) => {
  console.log(`DELETE /incidents/${req.params.id} endpoint hit`);
  incidentController.deleteIncident(req, res, next);
});

// Start our server
app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});

app.patch("/incidents/:id/upvote", (req, res, next) => {
  console.log(`PATCH /incidents/${req.params.id}/upvote endpoint hit`);
  incidentController.upvoteIncident(req, res, next);
});

// General
app.get("/", (req, res) => {
  console.log("GET / endpoint hit");
  res.json({ hello: "world" });
});

// Serve frontend static files only in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Catch-all route for frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}
