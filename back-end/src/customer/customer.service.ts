import { PrismaService } from '@app/prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll(query: { [key: string]: any }) {
        try {
            const size = +(query.pageSize || 10);
            const page = +(query.page || 1);
            const where: Prisma.CustomerWhereInput = {
                deletedAt: null
            };


            const total = await this.prisma.customer.count({
                where,
            })

            const data = await this.prisma.customer.findMany({
                where,
                orderBy: {
                    createdAt: "desc"
                },
                take: size,
                skip: ((page - 1) * size)
            });

            const startIndex = (page - 1) * size + 1;
            let endIndex = page * size;

            if (endIndex > total) {
                endIndex = total;
            }

            return {
                currentPage: page,
                data,
                lastPage: Math.ceil((total / size)),
                perPage: size,
                total,
                startIndex,
                endIndex
            }
        } catch (error) {
            console.log(error);
            throw new BadRequestException()
        }
    }
}
