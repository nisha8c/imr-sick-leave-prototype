import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { prisma } from "../../prisma/client";

export const listSickLeaves = publicProcedure.query(async () => {
    const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret";

    try {
        const reports = await prisma.$queryRawUnsafe<any[]>(`
          SELECT
            id, date,
            pgp_sym_decrypt(reason, $1)::text AS reason,
            pgp_sym_decrypt(comment, $1)::text AS comment,
            timezone, "createdAt", "updatedAt"
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
});
