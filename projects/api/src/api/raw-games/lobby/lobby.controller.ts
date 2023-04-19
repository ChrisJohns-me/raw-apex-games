import { Request, Response } from "express";
import LobbyService from "./lobby.service.js";

class LobbyController {
    public async getLobby(req: Request, res: Response) {
        const { lobbyId: joinCode } = req.params;
        try {
            const result = await LobbyService.getLobby(joinCode);
            res.json(result);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem fetching lobbys." });
        }
    }

    public async listLobbies(req: Request, res: Response) {
        try {
            const result = await LobbyService.listLobbies();
            res.json(result);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem fetching lobbys." });
        }
    }
}

export default new LobbyController();
