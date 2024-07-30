import { $Enums, Prisma, PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import * as cliProgress from 'cli-progress';

export default class OrderSeeder {
    public total = 30;
    private customers: any[] = [];
    private books: any[] = [];
    private orderStatus: { [key in $Enums.OrderStatus]: $Enums.OrderStatus } = {
        Pending: 'Pending',
        Processing: 'Processing',
        Shipped: 'Shipped',
        Delivered: 'Delivered',
        Cancelled: 'Cancelled',
        Returned: 'Returned'
    }

    async init() {
        const cap1 = await readFile(`${process.cwd()}/prisma/sample-data/customers.json`, "utf8");
        const cap2 = await readFile(`${process.cwd()}/prisma/sample-data/books.json`, "utf8");

        this.customers = JSON.parse(cap1);
        this.books = JSON.parse(cap2);
        this.books = this.books.filter(book => book.id != null);
    }

    async seed(bar: cliProgress.SingleBar) {
        const prisma = new PrismaClient();

        for (let a = 0; a < this.total; a++) {
            const customer = this.customers[this.getRandomInt(0, this.customers.length - 1)];
            const items: any[] = [];

            for (let b = 0; b < this.getRandomInt(1, 5); b++) {
                const book = this.books[this.getRandomInt(0, this.books.length - 1)];

                items.push({
                    bookId: book.id,
                    quantity: this.getRandomInt(1, 5),
                    unitPrice: book.price
                })
            }

            await prisma.order.create({
                data: {
                    totalAmount: items
                        .map(item => item.unitPrice * item.quantity)
                        .reduce((prev, total) => total + prev, 0),
                    status: this.orderStatus[
                        Object.getOwnPropertyNames(this.orderStatus)[
                        this.getRandomInt(0, Object.getOwnPropertyNames(this.orderStatus).length - 1)
                        ]
                    ],
                    customerId: customer.id,
                    orderItems: {
                        create: items
                    }
                }
            })

            bar.increment();
        }
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}