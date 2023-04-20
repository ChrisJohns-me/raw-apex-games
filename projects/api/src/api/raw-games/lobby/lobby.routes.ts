import { Router } from "express";
import LobbyController from "./lobby.controller.js";

const lobbyRoutes = Router();

lobbyRoutes.get("/:lobbyId", LobbyController.getLobby);
lobbyRoutes.post("/", LobbyController.createLobby);

export default lobbyRoutes;
