import { router } from "../trpc";
import { createSickLeave } from "./create";
import { listSickLeaves } from "./list";
import { updateSickLeave } from "./update";
import { deleteSickLeave } from "./delete";

export const sickLeaveRouter = router({
    create: createSickLeave,
    list: listSickLeaves,
    update: updateSickLeave,
    delete: deleteSickLeave,
});
