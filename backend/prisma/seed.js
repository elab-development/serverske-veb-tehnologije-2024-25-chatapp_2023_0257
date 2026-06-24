"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function main() {
    await prisma_1.default.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } });
    await prisma_1.default.role.upsert({ where: { name: 'PREMIUM' }, update: {}, create: { name: 'PREMIUM' } });
    await prisma_1.default.role.upsert({ where: { name: 'USER' }, update: {}, create: { name: 'USER' } });
    console.log('Uloge uspešno seed-ovane!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
