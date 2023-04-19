import bodyParser from "body-parser";
import express from "express";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import apiRoutes from "./api-routes.js";
import corsMiddleware from "./middleware/cors.middleware.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
corsMiddleware(app);

// Routes
app.use("/api", apiRoutes);

// TODO: Move database initialization to a separate file
const firebaseConfig: FirebaseOptions = {
    projectId: "dev-project",
    databaseURL: "[::1]:8643",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, "localhost", 8080);

export default app;
