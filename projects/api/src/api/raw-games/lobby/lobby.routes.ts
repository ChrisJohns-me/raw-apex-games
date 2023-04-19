import { Router } from "express";
import LobbyController from "./lobby.controller.js";

const lobbyRoutes = Router();

lobbyRoutes.get("/:lobbyId", LobbyController.getLobby);

export default lobbyRoutes;
