"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt_1.default.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@library.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@library.com",
            password,
            role: "ADMIN", // 👈 use string
        },
    });
    console.log("✅ Admin user created");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
