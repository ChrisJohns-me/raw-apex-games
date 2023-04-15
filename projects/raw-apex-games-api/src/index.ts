import bodyParser from "body-parser";
import express from "express";

// Import routes
// const programmingLanguagesRouter = require('./src/routes/programmingLanguages.route');

const app = express();
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
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const statusCode = err?.statusCode || 500;
    console.error(err?.message, err?.stack);
    res.status(statusCode).json({ message: err?.message });
});
