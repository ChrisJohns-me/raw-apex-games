import { Request, Response } from "express";
import { getLobby, listLobbies } from "./lobby.service.js";

export async function getLobbyController(req: Request, res: Response) {
    const { lobbyId: joinCode } = req.params;
    try {
        const result = await getLobby(joinCode);
        res.json(result);
    } catch (e: unknown) {
        console.error(e);
        res.status(500).send({ error: "Problem fetching lobbys." });
    }
}

export async function listLobbiesController(req: Request, res: Response) {
    try {
        const result = await listLobbies();
        res.json(result);
    } catch (e: unknown) {
        console.error(e);
        res.status(500).send({ error: "Problem fetching lobbys." });
    }
}
