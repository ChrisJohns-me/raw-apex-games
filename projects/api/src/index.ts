import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { Server } from "socket.io";
// Import routes
// const programmingLanguagesRouter = require('./src/routes/programmingLanguages.route');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const name = process.env.NAME || "World";
    res.send(`Hello ${name}!`);
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
const documents = {};
io.on("connection", (socket) => {
    let previousId;

    const safeJoin = (currentId) => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
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
