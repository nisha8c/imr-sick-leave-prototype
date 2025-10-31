import { prisma } from "../prisma/client";
export const createContext = () => ({ prisma });
export type Context = ReturnType<typeof createContext>;
