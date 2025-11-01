import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { prisma } from "../../prisma/client";

export const deleteSickLeave = publicProcedure
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
    });
