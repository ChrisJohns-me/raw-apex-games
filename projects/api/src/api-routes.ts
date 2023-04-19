import { Router } from "express";
import rawGamesRoutes from "./api/raw-games/raw-games.routes.js";

const apiRoutes = Router();

apiRoutes.use("/raw-games", rawGamesRoutes);

export default apiRoutes;
