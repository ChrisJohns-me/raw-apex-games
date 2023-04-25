import { Router } from "express";
import LobbyController from "./lobby.controller.js";

const lobbyRoutes = Router();

lobbyRoutes.get("/", LobbyController.getLobby);
lobbyRoutes.get("/:lobbyId", LobbyController.getLobby);
lobbyRoutes.post("/:lobbyId", LobbyController.createLobby);
lobbyRoutes.put("/:lobbyId", LobbyController.updateLobby);
lobbyRoutes.delete("/:lobbyId", LobbyController.deleteLobby);

export default lobbyRoutes;
