import { z } from "zod";
import { prisma } from "../prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const sickLeaveRouter = router({
    // ------------------------
    // CREATE NEW ENTRY
    // ------------------------
    create: publicProcedure
        .input(
            z.object({
                date: z.string(),
                reason: z.string().optional(),
                comment: z.string().optional(),
                timezone: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const localDate = dayjs.tz(input.date, input.timezone).startOf("day").toDate();

            const existing = await prisma.sickLeave.findFirst({ where: { date: localDate } });
            if (existing) {
                return {
                    message: "duplicate",
                    existing,
                };
            }

            try {
                const newEntry = await prisma.sickLeave.create({
                    data: {
                        date: localDate,
                        reason: input.reason,
                        comment: input.comment,
                        timezone: input.timezone,
                    },
                });

                return { message: "Sick leave created successfully", newEntry };
            } catch (err) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create sick leave entry.",
                    cause: err,
                });
            }
        }),

    // ------------------------
    // LIST ALL ENTRIES
    // ------------------------
    list: publicProcedure.query(async () => {
        try {
            return await prisma.sickLeave.findMany({ orderBy: { date: "desc" } });
        } catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch sick leave entries.",
                cause: err,
            });
        }
    }),

    // ------------------------
    // UPDATE EXISTING ENTRY
    // ------------------------
    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                date: z.string(),
                reason: z.string().optional(),
                comment: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const existing = await prisma.sickLeave.findUnique({ where: { id: input.id } });
            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Sick leave entry not found.",
                });
            }

            try {
                const updated = await prisma.sickLeave.update({
                    where: { id: input.id },
                    data: {
                        date: new Date(input.date),
                        reason: input.reason,
                        comment: input.comment,
                    },
                });

                return { message: "Sick leave updated successfully", updated };
            } catch (err) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update sick leave entry.",
                    cause: err,
                });
            }
        }),

    // ------------------------
    // DELETE ENTRY
    // ------------------------
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            const existing = await prisma.sickLeave.findUnique({ where: { id: input.id } });
            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Sick leave entry not found.",
                });
            }

            try {
                const deleted = await prisma.sickLeave.delete({ where: { id: input.id } });
                return { message: "Sick leave deleted successfully", deleted };
            } catch (err) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete sick leave entry.",
                    cause: err,
                });
            }
        }),
});
