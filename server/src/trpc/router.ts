
import {router} from "./trpc";
import {sickLeaveRouter} from "./sickLeave";
export const appRouter = router({ sickLeave: sickLeaveRouter });
export type AppRouter = typeof appRouter;
