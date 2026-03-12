import dotenv from "dotenv";

dotenv.config();

function required(name: string, value?: string): string {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT || 3000),
    DB_HOST: required("DB_HOST", process.env.DB_HOST),
    DB_PORT: Number(process.env.DB_PORT || 3306),
    DB_NAME: required("DB_NAME", process.env.DB_NAME),
    DB_USER: required("DB_USER", process.env.DB_USER),
    DB_PASSWORD: required("DB_PASSWORD", process.env.DB_PASSWORD),
};
