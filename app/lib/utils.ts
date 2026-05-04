import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) =>
    twMerge(clsx(inputs));

export const formatSize = (bytes: number): string => {
    if (!bytes) {
        return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const unitIndex = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const size = bytes / 1024 ** unitIndex;

    return `${Number(size.toFixed(2))} ${units[unitIndex]}`;
};

export const generateUUID = () =>
    crypto.randomUUID();