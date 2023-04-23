import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { Request, Response } from "express";
import LobbyService from "./lobby.service.js";

class LobbyController {
    public async createLobby(req: Request, res: Response) {
        const reqLobbyId = new RawGameLobby({ lobbyId: req.params.lobbyId }).lobbyId;
        const lobbyData = new RawGameLobby(req.body);
        const userOriginId = req.userData.originId;
        lobbyData.organizerOriginId = userOriginId; // Overwrite the lobby organizer to avoid impersonation

        if (reqLobbyId !== lobbyData.lobbyId) {
            res.status(400).send({ error: "Lobby ID in request body does not match lobby ID in request URL." });
            return;
        }

        try {
            // Lobby ID must be unique; return existing lobby if it exists
            const lobbyIdExistingLobby = await LobbyService.getLobbyByLobbyId(lobbyData.lobbyId);
            if (lobbyIdExistingLobby) {
                console.log(`Lobby already exists with lobby ID "${lobbyData.lobbyId}", returning existing lobby.`);
                res.json(lobbyIdExistingLobby);
                return;
            }

            await LobbyService.createLobby(lobbyData);
            res.status(200);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem creating lobby." });
        }
    }

    /**
     * Expects either a lobby ID (/:lobbyId parameter) or originId (?originId query) to be provided.
     * TODO: Maybe restrict getLobbybyOriginId(`originId`) to only be accessible by the user with that originId
     */
    public async getLobby(req: Request, res: Response) {
        const lobbyId = new RawGameLobby({ lobbyId: req.params.lobbyId }).lobbyId;
        const originId = new RawGameLobby({ organizerOriginId: req.query.originId?.toString() }).organizerOriginId;
        try {
            if (lobbyId) {
                const result = await LobbyService.getLobbyByLobbyId(lobbyId);
                res.json(result);
                return;
            } else if (originId) {
                const result = await LobbyService.getLobbyByOriginId(originId);
                res.json(result);
                return;
            } else {
                res.status(400).send({ error: `Must provide a lobby id (/:lobbyId parameter) or originId (?originId query).` });
                return;
            }
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem fetching lobby." });
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

    public async updateLobby(req: Request, res: Response) {
        const reqLobbyId = new RawGameLobby({ lobbyId: req.params.lobbyId }).lobbyId;
        const lobbyData = new RawGameLobby(req.body);

        if (reqLobbyId !== lobbyData.lobbyId) {
            res.status(400).send({ error: "Lobby ID in request body does not match lobby ID in request URL." });
            return;
        }

        try {
            const lobbyByLobbyId = await LobbyService.getLobbyByLobbyId(lobbyData.lobbyId);
            if (!lobbyByLobbyId) {
                res.status(404).send({ error: `Lobby with lobby ID "${lobbyData.lobbyId}" does not exist.` });
                return;
            }

            await LobbyService.updateLobby(lobbyData);
            res.status(200);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem updating lobby." });
        }
    }

    /**
     * Only the organizer of the lobby can delete it.
     * Expects lobby ID (/:lobbyId parameter) to be provided.
     */
    public async deleteLobby(req: Request, res: Response) {
        const lobbyId = new RawGameLobby({ lobbyId: req.params.lobbyId }).lobbyId;
        const userOriginId = req.userData.originId;
        try {
            const lobbyByLobbyId = await LobbyService.getLobbyByLobbyId(lobbyId);
            if (!lobbyByLobbyId) {
                res.status(200); // Already deleted
                return;
            } else if (lobbyByLobbyId.organizerOriginId !== userOriginId) {
                res.status(403).send({ error: "Only the organizer of the lobby can delete it." });
                return;
            }

            await LobbyService.deleteLobbyById(lobbyId);
            res.status(200);
        } catch (e: unknown) {
            console.error(e);
            res.status(500).send({ error: "Problem deleting lobby." });
        }
    }
}

export default new LobbyController();
