import * as functions from "firebase-functions";
import { postPlayerReport } from "./player-report/post-player-report";

export const playerReport = functions.https.onRequest((request, response) => {
    if (functions.config().environment?.dev) {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Headers", "*");
    }

    switch (request.method) {
        case "POST":
            postPlayerReport(request, response);
            break;
        case "OPTIONS":
            response.send();
            break;
        default:
            response.status(405).send("Method Not Allowed");
            break;
    }
});
