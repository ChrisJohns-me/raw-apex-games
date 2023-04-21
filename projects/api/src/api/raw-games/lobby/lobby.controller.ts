import { RawGameLobby } from "#shared/models/raw-games/raw-game-lobby.js";
import { Request, Response } from "express";
import LobbyService from "./lobby.service.js";

class LobbyController {
    public async createLobby(req: Request, res: Response) {
        console.log("LobbyController: Create lobby new");
        const lobbyData = new RawGameLobby(req.body);
        try {
            console.log("About to call LobbyService.createLobby");
            const result = await LobbyService.createLobby(lobbyData);
            res.json(result);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem creating lobby." });
        }
    }

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
