import { Router } from "express";
import lobbiesRoutes from "./lobby/lobbies.routes.js";
import lobbyRoutes from "./lobby/lobby.routes.js";

const rawGamesRoutes = Router();

rawGamesRoutes.use("/lobby", lobbyRoutes);
rawGamesRoutes.use("/lobbies", lobbiesRoutes);

export default rawGamesRoutes;
