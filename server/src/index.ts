import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export type { AppRouter } from "./trpc/router";
