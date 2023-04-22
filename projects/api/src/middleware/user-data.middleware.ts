import { UserData } from "#shared/models/user-data.js";
import { Application, Request } from "express";

export default function userDataMiddleware(app: Application) {
    app.use((req: Request, res, next) => {
        const reqOriginId: Optional<string> = req.headers["x-origin-id"] ? (req.headers["x-origin-id"] as string) : undefined;
        const userData = new UserData({
            originId: reqOriginId,
        });

        if (userData.originId.length) {
            req["userData"] = userData;
            next();
        } else {
            res.status(401).send({ error: "Missing user data" });
            return;
        }
    });
}
