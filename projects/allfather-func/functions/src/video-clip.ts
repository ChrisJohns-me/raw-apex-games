import * as functions from "firebase-functions";
import { postVideoClip } from "./video-clip/post-video-clip";

export const videoClip = functions.https.onRequest((request, response) => {
    if (functions.config().environment?.dev) {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Headers", "*");
    }

    switch (request.method) {
        case "POST":
            postVideoClip(request, response);
            break;
        case "OPTIONS":
            response.send();
            break;
        default:
            response.status(405).send("Method Not Allowed");
            break;
    }
});
