import * as dotenv from 'dotenv';
import { PrismaClient } from "@/lib/generated/prisma/client";
import sampleData from "./sample-data";

dotenv.config();

async function main() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.product.createMany({
        data: sampleData.products,
    });
    console.log("Database has been seeded.");
}

main()