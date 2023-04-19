import bodyParser from "body-parser";
import express from "express";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import http from "http";
import { Server } from "socket.io";
import { MatchGameModePlaylist } from "../../app/src/app/common/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "../../app/src/app/common/match/game-mode/game-mode.enum.js";
import { RawGameLobby } from "../../shared/common/raw-games/raw-game-lobby.js";

// Import routes
// const programmingLanguagesRouter = require('./src/routes/programmingLanguages.route');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const firebaseConfig: FirebaseOptions = {
    projectId: "dev-project",
    databaseURL: "[::1]:8643",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, "localhost", 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const name = process.env.NAME || "World";
    res.send(`Hello ${name}!`);
});

app.get("/raw-games/lobby", (req, res) => {
    const mockLobby = new RawGameLobby({
        joinCode: "abc123",
        gameModePlaylist: MatchGameModePlaylist.Sandbox,
        gameModeGenericId: MatchGameModeGenericId.FiringRange,
        organizerOriginId: "master123",
        playerOriginIds: ["master123", "charly"],
        isJoinable: true,
        isStarted: false,
    });
    res.send(mockLobby);
});

app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});

// Install routes
// app.use('/programming-languages', programmingLanguagesRouter);

/** Error handler middleware */
app.use((err: any, _req: express.Request, res: express.Response) => {
    const statusCode = err?.statusCode || 500;
    console.error(err?.message, err?.stack);
    res.status(statusCode).json({ message: err?.message });
});

//********** Socket.io **********/
const documents: { [key: string]: string } = {};
io.on("connection", (socket) => {
    let previousId: string;

    const safeJoin = (currentId: string) => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on("getDoc", (docId) => {
        safeJoin(docId);
        socket.emit("document", documents[docId]);
    });

    socket.on("addDoc", (doc) => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });
});

httpServer.listen(4444, () => {
    console.log("Listening on port 4444");
});
