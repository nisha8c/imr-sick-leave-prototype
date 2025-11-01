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
            const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret";
            const localDate = dayjs.tz(`${input.date}T00:00:00`, input.timezone);

            // Validate that the date is not in the future
            if (localDate.isAfter(dayjs.tz(dayjs(), input.timezone), "day")) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Future sick leave dates are not allowed.",
                });
            }

            const existing = await prisma.sickLeave.findFirst({
                where: {
                    AND: [
                        {
                            date: {
                                gte: localDate.toDate(),
                                lt: localDate.add(1, "day").toDate(),
                            },
                        },
                        {
                            timezone: input.timezone,
                        },
                    ],
                },
            });

            if (existing) {
                const decrypted = await prisma.$queryRawUnsafe<any[]>(`
                    SELECT 
                      id,
                      date,
                      pgp_sym_decrypt(reason, $1)::text AS reason,
                      pgp_sym_decrypt(comment, $1)::text AS comment,
                      timezone,
                      "createdAt",
                      "updatedAt"
                    FROM "SickLeave"
                    WHERE id = $2
                    LIMIT 1;
                  `, encryptionKey, existing.id);

                return { message: "duplicate", existing: decrypted[0] };
            }


            try {
                const [newEntry] = await prisma.$queryRawUnsafe<any[]>(`
                            INSERT INTO "SickLeave" (id, date, reason, comment, timezone, "createdAt", "updatedAt")
                            VALUES (
                                gen_random_uuid(),
                                $1,
                                pgp_sym_encrypt($2::text, $3::text),
                                pgp_sym_encrypt($4::text, $3::text),
                                $5,
                                NOW(),
                                NOW()
                            )
                                RETURNING id, date,
                                pgp_sym_decrypt(reason, $3)::text AS reason,
                                pgp_sym_decrypt(comment, $3)::text AS comment,
                                timezone, "createdAt", "updatedAt";
                    `,
                    localDate.toDate(),
                    input.reason || "",
                    encryptionKey,
                    input.comment || "",
                    input.timezone
                );


                return { message: "Sick leave created successfully", newEntry };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message ,
                    cause: err,
                });
            }
        }),

    // ------------------------
    // LIST ALL ENTRIES
    // ------------------------
    list: publicProcedure.query(async () => {
        const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret";

        try {
            const reports = await prisma.$queryRawUnsafe<any[]>(`
                SELECT
                  id,
                  date,
                  pgp_sym_decrypt(reason, $1)::text AS reason,
                  pgp_sym_decrypt(comment, $1)::text AS comment,
                  timezone,
                  "createdAt",
                  "updatedAt"
                FROM "SickLeave"
                ORDER BY date DESC;
            `, encryptionKey);

            return reports;
        } catch (err) {
            console.error("List error:", err);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch sick leave entries.",
                cause: err,
            });
        }
    }),

    // ------------------------
// UPDATE EXISTING ENTRY (Encrypt on update)
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
