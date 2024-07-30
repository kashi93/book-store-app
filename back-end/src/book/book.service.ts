import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createBookDto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: createBookDto
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async findAll(query: { [key: string]: any }) {
    try {
      const size = +(query.pageSize || 10);
      const page = +(query.page || 1);
      const where: Prisma.BookWhereInput = {
        deletedAt: null
      };

      if ((query.search || "").trim() != "") {
        where.AND = [
          {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: "insensitive"
                },
              },
              {
                isbn: {
                  contains: query.search,
                  mode: "insensitive"
                }
              },
              {
                author: {
                  contains: query.search,
                  mode: "insensitive"
                }
              },
              {
                category: {
                  contains: query.search,
                  mode: "insensitive"
                }
              },
            ]
          }
        ]
      }

      const total = await this.prisma.book.count({
        where,
      })

      const data = await this.prisma.book.findMany({
        where,
        orderBy: {
          updatedAt: "desc"
        },
        include: {
          orderItems: {
            where: {
              deletedAt: null
            },
            select: {
              quantity: true
            }
          }
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
        data: data.map(d => {
          const sold = d.orderItems.reduce((prev, o) => o.quantity + prev, 0);
          return {
            ...d,
            stock: d.stock - sold
          };
        }),
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

  async findOne(id: string) {
    try {
      return await this.prisma.book.findFirstOrThrow({
        where: { id }
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async update(updateBookDto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({
        where: {
          id: updateBookDto.id
        },
        data: updateBookDto
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.book.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date()
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }


  async randomIsBn() {
    try {
      let isbn: string;
      let isUnique: boolean = false;

      while (!isUnique) {
        isbn = this.generateRandomISBN();
        const count = await this.prisma.book.count({
          where: {
            isbn
          }
        });

        isUnique = count === 0;
      }

      return String(isbn);
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  generateRandomISBN(): string {
    // ISBN-13 prefix, always "978" or "979"
    const prefix = "978";

    // Generate random parts for registration group, registrant, and publication
    const registrationGroup = Math.floor(Math.random() * 9) + 1; // Single digit
    const registrant = Math.floor(Math.random() * 9000) + 1000;  // Four digits
    const publication = Math.floor(Math.random() * 90000) + 10000; // Five digits

    // Combine parts into the first 12 digits of the ISBN
    const isbnWithoutCheckDigit = `${prefix}${registrationGroup}${registrant}${publication}`;

    // Calculate the check digit using the ISBN-13 algorithm
    const checkDigit = this.calculateCheckDigit(isbnWithoutCheckDigit);

    // Combine all parts into the final ISBN-13
    return `${isbnWithoutCheckDigit}${checkDigit}`;
  }

  calculateCheckDigit(isbnWithoutCheckDigit: string): number {
    let sum = 0;
    for (let i = 0; i < isbnWithoutCheckDigit.length; i++) {
      const digit = parseInt(isbnWithoutCheckDigit[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const remainder = sum % 10;
    return (remainder === 0) ? 0 : 10 - remainder;
  }

  async getAuthorList() {
    try {
      return await this.prisma.book.findMany({
        select: {
          author: true
        },
        distinct: ["author"]
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async getCategoryList() {
    try {
      return await this.prisma.book.findMany({
        select: {
          category: true
        },
        distinct: ["category"]
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }
}
