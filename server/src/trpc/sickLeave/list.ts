import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { prisma } from "../../prisma/client";

import { z } from "zod";

/*
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
*/


export const listSickLeaves = publicProcedure
    .input(
        z.object({
            filterType: z.enum(["latest", "all", "month", "year"]).optional(),
            month: z.string().optional(), // "2025-10"
            year: z.string().optional(),  // "2025"
        })
    )
    .query(async ({ input }) => {
        const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret";

        try {
            // --- Build dynamic filtering clause ---
            let whereClause = "";

            if (input.filterType === "month" && input.month) {
                const [year, month] = input.month.split("-");
                whereClause = `WHERE EXTRACT(YEAR FROM date) = ${year} AND EXTRACT(MONTH FROM date) = ${parseInt(month)}`;
            } else if (input.filterType === "year" && input.year) {
                whereClause = `WHERE EXTRACT(YEAR FROM date) = ${input.year}`;
            }

            let limitClause = "";
            if (input.filterType === "latest") limitClause = "LIMIT 5";

            // --- Fetch filtered reports ---
            const reports = await prisma.$queryRawUnsafe<any[]>(`
                SELECT
                    id, date,
                    pgp_sym_decrypt(reason, $1)::text AS reason,
                    pgp_sym_decrypt(comment, $1)::text AS comment,
                    timezone, "createdAt", "updatedAt"
                FROM "SickLeave"
                    ${whereClause}
                ORDER BY date DESC
                    ${limitClause};
            `, encryptionKey);

            // --- Fetch available months and years (distinct) ---
            const availableMonths = await prisma.$queryRawUnsafe<{ month: string }[]>(`
                SELECT DISTINCT TO_CHAR(date, 'YYYY-MM') AS month
                FROM "SickLeave"
                ORDER BY month DESC;
          `);

                const availableYears = await prisma.$queryRawUnsafe<{ year: number }[]>(`
                    SELECT DISTINCT EXTRACT(YEAR FROM date) AS year
                    FROM "SickLeave"
                    ORDER BY year DESC;
              `);

            // --- Return structured data ---
            return {
                reports,
                availableMonths: availableMonths.map(m => m.month),
                availableYears: availableYears.map(y => String(y.year)),
            };
        } catch (err) {
            console.error("List error:", err);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch sick leave entries.",
                cause: err,
            });
        }
    });

