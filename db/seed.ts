import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import sampleData from "./sample-data";

dotenv.config();

async function main() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();


    await prisma.product.createMany({
        data: sampleData.products,
    });

    await prisma.user.createMany({
        data: sampleData.users,
    });
    console.log("Database has been seeded.");
}

main()