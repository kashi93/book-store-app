import { IsUnique } from "@app/custom-validator";
import { Prisma } from "@prisma/client";
import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    @IsUnique<Prisma.BookWhereInput>(val => ({
        model: "Book",
        condition: {
            isbn: val
        }
    }))
    isbn: string

    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    category: string

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number

    @IsNotEmpty()
    @IsInt()
    stock: number

    @IsOptional()
    publishedDate?: Date

    @IsOptional()
    description?: string

    @IsOptional()
    coverImageUrl?: string
}
