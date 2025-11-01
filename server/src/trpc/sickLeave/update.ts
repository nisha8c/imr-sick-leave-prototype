import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { prisma } from "../../prisma/client";

export const updateSickLeave = publicProcedure
    .input(
        z.object({
            id: z.string(),
            date: z.string(),
            reason: z.string().optional(),
            comment: z.string().optional(),
        })
    )
    .mutation(async ({ input }) => {
        const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret";
        const existing = await prisma.sickLeave.findUnique({ where: { id: input.id } });

        if (!existing) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Sick leave entry not found.",
            });
        }

        try {
            const [updated] = await prisma.$queryRawUnsafe<any[]>(`
                UPDATE "SickLeave"
                SET date = $1,
                    reason = pgp_sym_encrypt($2::text, $3::text),
                    comment = pgp_sym_encrypt($4::text, $3::text),
                    "updatedAt" = NOW()
                WHERE id = $5
                RETURNING id, date,
                  pgp_sym_decrypt(reason, $3)::text AS reason,
                  pgp_sym_decrypt(comment, $3)::text AS comment,
                  timezone, "createdAt", "updatedAt";
              `,
                new Date(input.date),
                input.reason || "",
                encryptionKey,
                input.comment || "",
                input.id
            );

            return { message: "Sick leave updated successfully", updated };
        } catch (err) {
            console.error("Update error:", err);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update sick leave entry.",
                cause: err,
            });
        }
    });
