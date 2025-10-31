import * as z from "zod";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

/**
 * Returns the validation schema for sick leave forms.
 * `t` is passed from react-i18next to support localization.
 */
export const getSickLeaveFormSchema = (t: any) =>
    z.object({
        date: z
            .string()
            .min(1, t("form.dateRequired"))
            .refine((val) => dayjs(val).isSameOrBefore(dayjs(), "day"), {
                message: t("form.futureDateNotAllowed"),
            }),
        reason: z.string().min(1, t("form.reasonRequired")),
        comment: z.string().optional(),
    });

export type SickLeaveFormData = z.infer<ReturnType<typeof getSickLeaveFormSchema>>;
