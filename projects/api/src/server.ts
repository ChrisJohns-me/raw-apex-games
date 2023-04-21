import http from "http";
// import { Server } from "socket.io";
import app from "./app.js";

// HTTP server
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(port);

/** Error handler middleware */
// app.use((err: any, _req: Request, res: Response) => {
//     const statusCode = err?.statusCode || 500;
//     console.error(err?.message, err?.stack);
//     res.status(statusCode).json({ message: err?.message });
// });

// Socket.io server
const httpServer = http.createServer(app);
// const io = new Server(httpServer);

// const documents: { [key: string]: string } = {};
// io.on("connection", (socket) => {
//     let previousId: string;

//     const safeJoin = (currentId: string) => {
//         socket.leave(previousId);
//         socket.join(currentId);
//         previousId = currentId;
//     };

//     socket.on("getDoc", (docId) => {
//         safeJoin(docId);
//         socket.emit("document", documents[docId]);
//     });

//     socket.on("addDoc", (doc) => {
//         documents[doc.id] = doc;
//         safeJoin(doc.id);
//         io.emit("documents", Object.keys(documents));
//         socket.emit("document", doc);
//     });
// });

// httpServer.listen(4444, () => {
//     console.log("Listening on port 4444");
// });
