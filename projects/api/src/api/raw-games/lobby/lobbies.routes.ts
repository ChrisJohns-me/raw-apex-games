import { Router } from "express";
import LobbyController from "./lobby.controller.js";

const lobbiesRoutes = Router();

lobbiesRoutes.get("/", LobbyController.listLobbies);

export default lobbiesRoutes;
