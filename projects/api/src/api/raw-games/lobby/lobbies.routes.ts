import { Router } from "express";
import { listLobbiesController } from "./lobby.controllers.js";

const lobbiesRoutes = Router();

lobbiesRoutes.get("/", listLobbiesController);

export default lobbiesRoutes;
