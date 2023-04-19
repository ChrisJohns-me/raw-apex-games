import cors from "cors";
import { Application } from "express";

export default function corsMiddleware(app: Application) {
    app.use(cors());
}
