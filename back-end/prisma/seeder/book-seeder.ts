import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import * as cliProgress from 'cli-progress';

export default class BookSeeder {
    public total = 0;
    private books: any[] = [];

    async init() {
        const cap = await readFile(`${process.cwd()}/prisma/sample-data/books.json`, "utf8");
        this.books = JSON.parse(cap);
        this.total = this.books.length;
    }

    async seed(bar: cliProgress.SingleBar) {
        const prisma = new PrismaClient();

        for await (const book of this.books) {
            if (!await prisma.book.count({ where: { isbn: book.isbn } })) {
                await prisma.book.create({
                    data: {
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        stock: book.stock,
                        isbn: book.isbn,
                        publishedDate: new Date(book.publishedDate).toISOString(),
                        description: book.description,
                        coverImageUrl: book.coverImageUrl,
                        author: book.author,
                        category: book.category
                    },
                });
            }

            bar.increment();
        }
    }
}