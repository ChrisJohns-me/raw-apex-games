import cors from "cors";
import { Express } from "express";

export default function corsMiddleware(app: Express) {
    app.use(cors());
}
