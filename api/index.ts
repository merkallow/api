// import express, { Application, Request, Response } from "express";

// const app: Application = express();

// app.set("port", process.env.PORT || 3000);

// app.get("/", (_req: Request, res: Response) => {
//   res.json({ message: "Hello world!" });
// });

// app.listen(app.get("port"), () => {
//   console.log(`Server on http://localhost:${app.get("port")}/`);
// });

import './db';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { services } from './services';

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Mount REST on /api
app.use('/api', services);

const port = process.env.PORT || 3000;

app.listen(port, () =>
	console.log(`Express app listening on localhost:${port}`)
);
