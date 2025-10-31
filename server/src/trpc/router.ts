
import { sickLeaveRouter } from "./sickLeaveRouter";
import {router} from "./trpc";
export const appRouter = router({ sickLeave: sickLeaveRouter });
export type AppRouter = typeof appRouter;
