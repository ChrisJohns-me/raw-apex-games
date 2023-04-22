import bodyParser from "body-parser";
import express, { Application } from "express";
import apiRoutes from "./api-routes.js";
import corsMiddleware from "./middleware/cors.middleware.js";
import userDataMiddleware from "./middleware/user-data.middleware.js";
import FirebaseUtil from "./utils/firebase.util.js";

class App {
    public app: Application = express();

    constructor() {
        this.initApp();
        this.initFirestore();
        this.initMiddleware();
        this.initRoutes();
    }

    private initApp(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private initFirestore() {
        FirebaseUtil;
    }

    private initMiddleware() {
        corsMiddleware(this.app);
        userDataMiddleware(this.app);
    }

    private initRoutes() {
        this.app.use("/api", apiRoutes);
    }
}

export default new App().app;
