import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty } from 'class-validator';
import { IsUnique } from '@app/custom-validator';
import { Prisma } from '@prisma/client';

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsUnique<Prisma.BookWhereInput>((val, property) => ({
        model: "Book",
        condition: {
            isbn: val,
            NOT: {
                id: property.id
            }
        }
    }))
    isbn: string
}
