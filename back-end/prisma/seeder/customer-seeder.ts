import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import * as cliProgress from 'cli-progress';

export default class CustomerSeeder {
    public total = 0;
    private customers: any[] = [];

    async init() {
        const cap = await readFile(`${process.cwd()}/prisma/sample-data/customers.json`, "utf8");
        this.customers = JSON.parse(cap);
        this.total = this.customers.length;
    }

    async seed(bar: cliProgress.SingleBar) {
        const prisma = new PrismaClient();

        for (const cust of this.customers) {
            if (! await prisma.customer.count({ where: { id: cust.id } })) {
                await prisma.customer.create({
                    data: cust
                })
            }

            bar.increment();
        }
    }
}