import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { Request, Response } from "express";
import LobbyService from "./lobby.service.js";

class LobbyController {
    public async createLobby(req: Request, res: Response) {
        const lobbyData = new RawGameLobby(req.body);
        try {
            const existingLobby = await LobbyService.getLobbyByJoinCode(lobbyData.joinCode);
            if (existingLobby) {
                console.log(`Lobby already exists with join code ${lobbyData.joinCode}, returning existing lobby.`);
                res.json(existingLobby);
                return;
            }

            const newLobby = await LobbyService.createLobby(lobbyData);
            res.json(newLobby);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem creating lobby." });
        }
    }

    public async getLobby(req: Request, res: Response) {
        const { lobbyId: joinCode } = req.params;
        try {
            const result = await LobbyService.getLobbyByJoinCode(joinCode);
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
