// src/types/sickLeave.ts

/**
 * Represents a single sick leave report as used in the frontend.
 * Mirrors the backend Prisma model for SickLeave.
 */
export interface SickLeave {
    id: string;
    date: string;
    reason?: string | null;
    comment?: string | null;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}


/**
 * Represents the data required to create a new sick leave entry.
 * Used in forms and tRPC mutation inputs.
 */
export interface SickLeaveCreateInput {
    date: string;      // e.g. "2025-10-31"
    reason?: string;
    comment?: string;
    timezone: string;  // e.g. "Europe/Stockholm"
}

/**
 * Represents the server response when creating or fetching sick leaves.
 */
export interface SickLeaveResponse {
    message: string;
    existing?: SickLeave;
    newEntry?: SickLeave;
}
