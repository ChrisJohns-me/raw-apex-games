import { Router } from "express";
import { getLobbyController } from "./lobby.controllers.js";

const lobbyRoutes = Router();

lobbyRoutes.get("/:lobbyId", getLobbyController);

export default lobbyRoutes;
