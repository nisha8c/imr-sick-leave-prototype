import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
}

export const exportToCSV = (reports: any[]) => {
    if (!reports.length) return;

    // Sort latest first
    const sorted = [...reports].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Define headers
    const headers = ["Date", "Reason", "Comment", "Created At", "Timezone"];

    // Format rows for CSV
    const rows = sorted.map(r => [
        new Date(r.date).toISOString().split("T")[0],
        r.reason?.replace(/"/g, '""') || "",
        r.comment?.replace(/"/g, '""') || "",
        new Date(r.createdAt).toISOString(),
        r.timezone || "",
    ]);

    // Join everything into a CSV string
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(v => `"${v}"`).join(",")),
    ].join("\n");

    // Download as file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sick_leave_reports.csv";
    link.click();
};

export const exportToExcel = (reports: any[]) => {
    if (!reports.length) return;

    const sorted = [...reports].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const worksheetData = sorted.map(r => ({
        Date: new Date(r.date).toISOString().split("T")[0],
        Reason: r.reason || "",
        Comment: r.comment || "",
        "Created At": new Date(r.createdAt).toISOString(),
        Timezone: r.timezone || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sick Leave Reports");
    XLSX.writeFile(workbook, "sick_leave_reports.xlsx");
};