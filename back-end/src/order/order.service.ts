import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '@app/prisma';
import { $Enums, Prisma } from '@prisma/client';
import { ChangeStatusInputDto } from './dto/change-input.dto';

@Injectable()
export class OrderService {
  private readonly orderStatus: $Enums.OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      return await this.prisma.order.create({
        data: {
          totalAmount: createOrderDto.totalAmount,
          status: createOrderDto.status,
          ...(createOrderDto.customer.id || "") != ""
            ? { customerId: createOrderDto.customer.id }
            : {
              customer: {
                create: {
                  firstName: createOrderDto.customer.firstName,
                  lastName: createOrderDto.customer.lastName,
                  address: createOrderDto.customer.address,
                  city: createOrderDto.customer.city,
                  postalCode: createOrderDto.customer.postalCode,
                  country: createOrderDto.customer.country,
                }
              }
            },
          orderItems: {
            create: createOrderDto.orderItems.map(({ id, ...item }) => item)
          }
        }
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
      const where: Prisma.OrderWhereInput = {
        deletedAt: null,
        customerId: (query.customerId || "") != "" ? query.customerId : undefined
      };

      if ((query.search || "").trim() != "") {
        where.AND = [
          {
            OR: [
              (this.orderStatus.includes(query.search) ?
                {
                  status: query.search,
                } :
                {} as any
              ),
              (
                !isNaN(+query.search) ?
                  {
                    totalAmount: +query.search,
                  } :
                  {}
              ),
              {
                customer: {
                  OR: [
                    ...(
                      query.search.split(/\s/)
                        .map((val: string) => ({
                          firstName: {
                            contains: val,
                            mode: "insensitive"
                          }
                        }))
                    ),
                    ...(
                      query.search.split(/\s/)
                        .map((val: string) => ({
                          lastName: {
                            contains: val,
                            mode: "insensitive"
                          }
                        }))
                    ),
                    {
                      address: {
                        contains: query.search,
                        mode: "insensitive"
                      },
                    },
                    {
                      city: {
                        contains: query.search,
                        mode: "insensitive"
                      },
                    },
                    {
                      country: {
                        contains: query.search,
                        mode: "insensitive"
                      },
                    },
                    {
                      postalCode: {
                        contains: query.search,
                        mode: "insensitive"
                      },
                    }
                  ],
                }
              },
              {
                orderItems: {
                  some: {
                    deletedAt: null,
                    book: {
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
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        ]
      }

      const total = await this.prisma.order.count({
        where,
      })

      const data = await this.prisma.order.findMany({
        where,
        orderBy: {
          id: "desc"
        },
        include: {
          customer: true,
          orderItems: {
            where: {
              deletedAt: null
            },
            include: {
              book: true
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

  async findOne(id: number) {
    try {
      return await this.prisma.order.findFirstOrThrow({
        where: {
          id,
          deletedAt: null
        },
        include: {
          customer: true,
          orderItems: {
            where: {
              deletedAt: null
            },
            include: {
              book: true
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.prisma.order.update({
        where: {
          id
        },
        data: {
          totalAmount: updateOrderDto.totalAmount,
          status: updateOrderDto.status,
          customer: {
            update: {
              firstName: updateOrderDto.customer.firstName,
              lastName: updateOrderDto.customer.lastName,
              address: updateOrderDto.customer.address,
              city: updateOrderDto.customer.city,
              postalCode: updateOrderDto.customer.postalCode,
              country: updateOrderDto.customer.country,
            }
          },
          orderItems: {
            update: updateOrderDto.orderItems
              .filter(item => item.id != null)
              .map(({ id, deleted, ...item }) => ({
                where: { id },
                data: {
                  ...item,
                  deletedAt: deleted ? new Date() : null
                }
              })),
            create: updateOrderDto.orderItems
              .filter(item => item.id == null)
              .map(({ id, ...item }) => item)
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  async changeStatus(changeStatusInputDto: ChangeStatusInputDto) {
    try {
      return await this.prisma.order.update({
        where: { id: +changeStatusInputDto.id },
        data: {
          status: changeStatusInputDto.status
        }
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }
}
