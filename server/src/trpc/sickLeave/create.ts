import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { prisma } from "../../prisma/client";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createSickLeave = publicProcedure
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

        // Prevent future dates
        if (localDate.isAfter(dayjs.tz(dayjs(), input.timezone), "day")) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Future sick leave dates are not allowed.",
            });
        }

        // Check duplicate
        const existing = await prisma.sickLeave.findFirst({
            where: {
                AND: [
                    {
                        date: {
                            gte: localDate.toDate(),
                            lt: localDate.add(1, "day").toDate(),
                        },
                    },
                    { timezone: input.timezone },
                ],
            },
        });

        if (existing) {
            const [decrypted] = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                  id, date,
                  pgp_sym_decrypt(reason, $1)::text AS reason,
                  pgp_sym_decrypt(comment, $1)::text AS comment,
                  timezone, "createdAt", "updatedAt"
                FROM "SickLeave"
                WHERE id = $2
                LIMIT 1;
              `, encryptionKey, existing.id);

            return { message: "duplicate", existing: decrypted };
        }

        // Create new entry with encryption
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
                message: err.message,
                cause: err,
            });
        }
    });
